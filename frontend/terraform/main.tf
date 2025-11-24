terraform {
  required_version = ">= 1.0"
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = ">= 2.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.0"
    }
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
  config_context = var.environment == "production" ? "production-context" : "staging-context"
}

# Generate random suffix for unique resources
resource "random_pet" "suffix" {
  length = 2
}

# Create namespace
resource "kubernetes_namespace" "frontend" {
  metadata {
    name = var.namespace
    labels = merge(var.resource_labels, {
      environment = var.environment
      component   = "frontend"
    })
    annotations = {
      "description" = "Frontend namespace for HKHR Evaluation System"
    }
  }
}

# Create ConfigMap for Nginx configuration
resource "kubernetes_config_map_v1" "nginx_config" {
  metadata {
    name      = "nginx-config"
    namespace = kubernetes_namespace.frontend.metadata.name
    labels = merge(var.resource_labels, {
      app = "nginx"
    })
  }

  data = {
    "nginx.conf" = templatefile("${path.module}/nginx.conf.tftpl", {
      domain_name       = var.domain_name
      environment        = var.environment
      ssl_enabled       = var.enable_ssl
      health_check_path = var.health_check_path
      api_proxy_path    = "/api/"
    })
  }
}

# Create Secret for SSL certificates
resource "kubernetes_secret_v1" "ssl_certs" {
  count = var.enable_ssl ? 1 : 0

  metadata {
    name      = var.ssl_cert_secret_name
    namespace = kubernetes_namespace.frontend.metadata.name
    labels = merge(var.resource_labels, {
      app = "ssl"
    })
  }

  type = "kubernetes.io/tls"

  data = {
    "tls.crt" = var.enable_ssl ? file("${path.module}/certs/tls.crt") : ""
    "tls.key" = var.enable_ssl ? file("${path.module}/certs/tls.key") : ""
  }
}

# Create Secret for environment variables
resource "kubernetes_secret_v1" "app_secrets" {
  metadata {
    name      = "app-secrets"
    namespace = kubernetes_namespace.frontend.metadata.name
    labels = merge(var.resource_labels, {
      app = "frontend"
    })
  }

  type = "Opaque"

  data = {
    "app-version"          = var.frontend_tag
    "sentry-dsn"          = var.environment_variables["SENTRY_DSN"] != "" ? base64encode(var.environment_variables["SENTRY_DSN"]) : ""
    "google-analytics-id" = var.environment_variables["VITE_GOOGLE_ANALYTICS_ID"] != "" ? base64encode(var.environment_variables["VITE_GOOGLE_ANALYTICS_ID"]) : ""
  }
}

# Frontend Deployment
resource "kubernetes_deployment_v1" "frontend" {
  metadata {
    name      = "hkhr-evaluation-frontend"
    namespace = kubernetes_namespace.frontend.metadata.name
    labels = merge(var.resource_labels, {
      version = var.frontend_tag
    })
    annotations = merge(var.deployment_annotations, {
      "deployment.kubernetes.io/revision" = random_pet.suffix.id
    })
  }

  spec {
    replicas = var.replica_count

    strategy {
      type = "RollingUpdate"
      rolling_update {
        max_surge       = 1
        max_unavailable = 0
      }
    }

    selector {
      match_labels = merge(var.resource_labels, {
        app = "hkhr-evaluation-frontend"
      })
    }

    template {
      metadata {
        labels = merge(var.resource_labels, {
          app     = "hkhr-evaluation-frontend"
          version = var.frontend_tag
        })
      }

      spec {
        security_context {
          run_as_non_root = true
          run_as_user    = 101
          run_as_group   = 101
          fs_group       = 101
          seccomp_profile {
            type = "RuntimeDefault"
          }
        }

        container {
          name  = "frontend"
          image = "${var.frontend_image}:${var.frontend_tag}"

          ports {
            container_port = 8080
            name           = "http"
            protocol       = "TCP"
          }

          env = [
            for key, value in var.environment_variables : {
              name  = key
              value = value
            }
          ]

          env_from {
            secret_ref {
              name = kubernetes_secret_v1.app_secrets.metadata.name
            }
          }

          resources {
            requests = {
              cpu    = var.cpu_request
              memory = var.memory_request
            }
            limits = {
              cpu    = var.cpu_limit
              memory = var.memory_limit
            }
          }

          security_context {
            allow_privilege_escalation = false
            read_only_root_filesystem     = true
            capabilities {
              drop = ["ALL"]
            }
            run_as_non_root = true
            run_as_user    = 101
          }

          volume_mount {
            name       = "nginx-config"
            mount_path = "/etc/nginx/nginx.conf"
            sub_path    = "nginx.conf"
            read_only  = true
          }

          volume_mount {
            name       = "ssl-certs"
            mount_path = "/etc/nginx/ssl"
            read_only  = true
          }

          volume_mount {
            name      = "cache"
            mount_path = "/var/cache/nginx"
          }

          volume_mount {
            name      = "logs"
            mount_path = "/var/log/nginx"
          }

          liveness_probe {
            http_get {
              path = var.health_check_path
              port = 8080
            }
            initial_delay_seconds = 30
            period_seconds        = var.health_check_interval
            timeout_seconds       = var.health_check_timeout
            failure_threshold      = var.health_check_failure_threshold
          }

          readiness_probe {
            http_get {
              path = var.health_check_path
              port = 8080
            }
            initial_delay_seconds = 5
            period_seconds        = 10
            timeout_seconds       = 5
            failure_threshold      = 3
          }

          lifecycle {
            pre_stop {
              exec {
                command = ["/bin/sh", "-c", "nginx -s quit && sleep 5"]
              }
            }
          }
        }

        volumes {
          name = "nginx-config"
          config_map {
            name = kubernetes_config_map_v1.nginx_config.metadata.name
          }
        }

        dynamic "volume" {
          for_each = var.enable_ssl ? [1] : []
          content {
            name = "ssl-certs"
            secret {
              secret_name = var.ssl_cert_secret_name
            }
          }
        }

        volume {
          name = "cache"
          empty_dir {}
        }

        volume {
          name = "logs"
          empty_dir {}
        }

        node_selector   = var.node_selector
        tolerations     = var.tolerations
        image_pull_secrets = [{
          name = "ghcr-secret"
        }]
      }
    }
  }
}

# Service
resource "kubernetes_service_v1" "frontend" {
  metadata {
    name      = "hkhr-evaluation-frontend-service"
    namespace = kubernetes_namespace.frontend.metadata.name
    labels = merge(var.resource_labels, {
      service-type = "frontend"
    })
    annotations = var.service_annotations
  }

  spec {
    type = "ClusterIP"

    dynamic "port" {
      for_each = var.service_ports
      content {
        name        = port.value.name
        port        = port.value.port
        target_port = port.value.target_port
        protocol    = port.value.protocol
      }
    }

    selector = merge(var.resource_labels, {
      app = "hkhr-evaluation-frontend"
    })
  }
}

# Ingress for external access
resource "kubernetes_ingress_v1" "frontend" {
  count = var.enable_ssl ? 1 : 0

  metadata {
    name      = "hkhr-evaluation-frontend-ingress"
    namespace = kubernetes_namespace.frontend.metadata.name
    labels = merge(var.resource_labels, {
      component = "ingress"
    })
    annotations = var.ingress_annotations
  }

  spec {
    dynamic "tls" {
      for_each = var.enable_ssl ? [1] : []
      content {
        hosts       = ["${var.domain_name}", "www.${var.domain_name}"]
        secret_name = var.ssl_cert_secret_name
      }
    }

    rule {
      host = var.domain_name
      http {
        path {
          path     = "/"
          pathType = "Prefix"
          backend {
            service {
              name = kubernetes_service_v1.frontend.metadata.name
              port {
                number = var.service_ports[0].port
              }
            }
          }
        }
      }
    }
  }
}

# Horizontal Pod Autoscaler
resource "kubernetes_horizontal_pod_autoscaler_v1" "frontend_hpa" {
  metadata {
    name      = "hkhr-evaluation-frontend-hpa"
    namespace = kubernetes_namespace.frontend.metadata.name
    labels = merge(var.resource_labels, {
      component = "autoscaler"
    })
  }

  spec {
    min_replicas = var.min_replicas
    max_replicas = var.max_replicas

    metrics {
      type = "Resource"
      resource {
        name = "cpu"
        target {
          type Utilization
          average_utilization = 70
        }
      }
    }

    metrics {
      type = "Resource"
      resource {
        name = "memory"
        target {
          type Utilization
          average_utilization = 80
        }
      }
    }
  }
}

# PodDisruptionBudget
resource "kubernetes_pod_disruption_budget_v1" "frontend_pdb" {
  metadata {
    name      = "hkhr-evaluation-frontend-pdb"
    namespace = kubernetes_namespace.frontend.metadata.name
    labels = merge(var.resource_labels, {
      component = "pdb"
    })
  }

  spec {
    min_available = var.pod_disruption_budget_min_available
    selector {
      match_labels = merge(var.resource_labels, {
        app = "hkhr-evaluation-frontend"
      })
    }
  }
}

# ServiceMonitor for monitoring (if enabled)
resource "kubernetes_manifest" "frontend_service_monitor" {
  count = var.enable_monitoring ? 1 : 0

  manifest = {
    apiVersion = "monitoring.coreos.com/v1"
    kind       = "ServiceMonitor"
    metadata = {
      name      = "hkhr-evaluation-frontend-metrics"
      namespace = kubernetes_namespace.frontend.metadata.name
      labels = merge(var.resource_labels, {
        component = "monitoring"
      })
    }
    spec = {
      selector = {
        matchLabels = merge(var.resource_labels, {
          app = "hkhr-evaluation-frontend"
        })
      }
      endpoints = [{
        port     = "http"
        path     = "/metrics"
        interval = "30s"
      }]
    }
  }
}

# Output values
output "namespace" {
  value = kubernetes_namespace.frontend.metadata.name
}

output "deployment_name" {
  value = kubernetes_deployment_v1.frontend.metadata.name
}

output "service_name" {
  value = kubernetes_service_v1.frontend.metadata.name
}

output "ingress_url" {
  value = var.enable_ssl ? "https://${var.domain_name}" : "http://${var.domain_name}"
}

output "pod_count" {
  value = kubernetes_deployment_v1.frontend.spec.replicas
}