variable "cluster_name" {
  description = "Name of the Kubernetes cluster"
  type        = string
  default     = "hkhr-evaluation-cluster"
}

variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "asia-east1"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "Environment must be either staging or production."
  }
}

variable "domain_name" {
  description = "Root domain name"
  type        = string
  default     = "hkhr-evaluation.com"
}

variable "namespace" {
  description = "Kubernetes namespace"
  type        = string
  default     = "hkhr-evaluation"
}

variable "frontend_image" {
  description = "Frontend Docker image"
  type        = string
  default     = "ghcr.io/hkhr-project/ai-evaluation-frontend"
}

variable "frontend_tag" {
  description = "Frontend Docker image tag"
  type        = string
  default     = "latest"
}

variable "replica_count" {
  description = "Number of frontend replicas"
  type        = number
  default     = 3

  validation {
    condition     = var.replica_count >= 1 && var.replica_count <= 10
    error_message = "Replica count must be between 1 and 10."
  }
}

variable "min_replicas" {
  description = "Minimum number of replicas for autoscaling"
  type        = number
  default     = 2
}

variable "max_replicas" {
  description = "Maximum number of replicas for autoscaling"
  type        = number
  default     = 10
}

variable "cpu_request" {
  description = "CPU request for frontend pods"
  type        = string
  default     = "100m"
}

variable "memory_request" {
  description = "Memory request for frontend pods"
  type        = string
  default     = "128Mi"
}

variable "cpu_limit" {
  description = "CPU limit for frontend pods"
  type        = string
  default     = "500m"
}

variable "memory_limit" {
  description = "Memory limit for frontend pods"
  type        = string
  default     = "512Mi"
}

variable "ingress_annotations" {
  description = "Annotations for Ingress resources"
  type        = map(string)
  default = {
    "kubernetes.io/ingress.class"               = "nginx"
    "cert-manager.io/cluster-issuer"            = "letsencrypt-prod"
    "nginx.ingress.kubernetes.io/ssl-redirect" = "true"
    "nginx.ingress.kubernetes.io/proxy-body-size" = "20m"
  }
}

variable "enable_monitoring" {
  description = "Enable monitoring and logging"
  type        = bool
  default     = true
}

variable "enable_ssl" {
  description = "Enable SSL/TLS"
  type        = bool
  default     = true
}

variable "ssl_cert_secret_name" {
  description = "Secret name for SSL certificates"
  type        = string
  default     = "hkhr-evaluation-tls"
}

variable "health_check_path" {
  description = "Health check path"
  type        = string
  default     = "/health"
}

variable "health_check_interval" {
  description = "Health check interval in seconds"
  type        = number
  default     = 30
}

variable "health_check_timeout" {
  description = "Health check timeout in seconds"
  type        = number
  default     = 5
}

variable "health_check_failure_threshold" {
  description = "Health check failure threshold"
  type        = number
  default     = 3
}

variable "node_selector" {
  description = "Node selector for frontend pods"
  type        = map(string)
  default = {
    "node-type" = "frontend"
  }
}

variable "tolerations" {
  description = "Tolerations for frontend pods"
  type        = list(object({
    key      = string
    operator = string
    value    = string
    effect   = string
  }))
  default = [{
    key      = "frontend"
    operator = "Equal"
    value    = "true"
    effect   = "NoSchedule"
  }]
}

variable "pod_disruption_budget_min_available" {
  description = "Minimum available pods for PodDisruptionBudget"
  type        = number
  default     = 2
}

variable "resource_labels" {
  description = "Common resource labels"
  type        = map(string)
  default = {
    "app.kubernetes.io/name"      = "hkhr-evaluation-frontend"
    "app.kubernetes.io/component" = "frontend"
    "app.kubernetes.io/part-of"   = "hkhr-evaluation"
  }
}

variable "service_annotations" {
  description = "Annotations for Service resources"
  type        = map(string)
  default = {
    "service.beta.kubernetes.io/aws-load-balancer-internal" = "true"
  }
}

variable "deployment_annotations" {
  description = "Annotations for Deployment resources"
  type        = map(string)
  default = {}
}

variable "environment_variables" {
  description = "Environment variables for the application"
  type        = map(string)
  default = {
    "NODE_ENV"        = "production"
    "VITE_APP_ENV"    = "production"
    "VITE_API_BASE_URL" = "https://api.hkhr-evaluation.com"
    "VITE_WS_URL"     = "wss://api.hkhr-evaluation.com"
  }
}

variable "service_ports" {
  description = "Service ports configuration"
  type = list(object({
    name     = string
    port     = number
    target_port = number
    protocol = string
  }))
  default = [{
    name        = "http"
    port        = 80
    target_port = 8080
    protocol    = "TCP"
  }]
}