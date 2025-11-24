#!/bin/bash

# Kubernetes Deployment Script for AI Evaluation System Frontend
# Usage: ./scripts/deploy-k8s.sh [environment] [options]

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
K8S_DIR="$PROJECT_DIR/k8s"
ENVIRONMENT="${1:-staging}"
NAMESPACE=""
DOCKER_IMAGE="${DOCKER_IMAGE:-ghcr.io/hkhr-project/ai-evaluation-frontend}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS:${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to validate environment
validate_environment() {
    case "$ENVIRONMENT" in
        "staging"|"production")
            NAMESPACE="hkhr-evaluation-${ENVIRONMENT}"
            log "Deploying to $ENVIRONMENT environment (namespace: $NAMESPACE)"
            ;;
        *)
            error "Invalid environment: $ENVIRONMENT. Must be staging or production"
            exit 1
            ;;
    esac
}

# Function to check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."

    # Check if kubectl is installed
    if ! command_exists kubectl; then
        error "kubectl is not installed or not in PATH"
        exit 1
    fi

    # Check if helm is installed
    if ! command_exists helm; then
        error "helm is not installed or not in PATH"
        exit 1
    fi

    # Check if we can connect to the cluster
    if ! kubectl cluster-info >/dev/null 2>&1; then
        error "Cannot connect to Kubernetes cluster"
        exit 1
    fi

    # Check Docker image availability
    if [ "${SKIP_IMAGE_CHECK:-false}" != "true" ]; then
        if ! docker pull "$DOCKER_IMAGE:$IMAGE_TAG" >/dev/null 2>&1; then
            error "Cannot pull Docker image: $DOCKER_IMAGE:$IMAGE_TAG"
            exit 1
        fi
    fi

    success "All prerequisites satisfied"
}

# Function to create namespace
create_namespace() {
    log "Creating namespace: $NAMESPACE"

    if kubectl get namespace "$NAMESPACE" >/dev/null 2>&1; then
        warn "Namespace $NAMESPACE already exists"
    else
        kubectl apply -f "$K8S_DIR/namespace.yaml"
        success "Namespace $NAMESPACE created"
    fi
}

# Function to apply secrets
apply_secrets() {
    log "Applying Kubernetes secrets..."

    if [ -f "$K8S_DIR/secrets.yaml" ]; then
        # Create secrets template
        envsubst < "$K8S_DIR/secrets.yaml" | kubectl apply -f -
        success "Secrets applied"
    else
        warn "Secrets file not found, skipping..."
    fi
}

# Function to apply configmaps
apply_configmaps() {
    log "Applying ConfigMaps..."

    if [ -f "$K8S_DIR/configmap.yaml" ]; then
        # Replace image tag in configmap if needed
        sed "s|ghcr.io/hkhr-project/ai-evaluation-frontend:latest|$DOCKER_IMAGE:$IMAGE_TAG|g" \
            "$K8S_DIR/configmap.yaml" | kubectl apply -f - -n "$NAMESPACE"
        success "ConfigMaps applied"
    else
        warn "ConfigMap file not found, skipping..."
    fi
}

# Function to deploy application
deploy_application() {
    log "Deploying application to $ENVIRONMENT..."

    local deployment_file="$K8S_DIR/deployment-${ENVIRONMENT}.yaml"

    if [ ! -f "$deployment_file" ]; then
        error "Deployment file not found: $deployment_file"
        exit 1
    fi

    # Update image tag in deployment
    sed -i.bak "s|image: $DOCKER_IMAGE:latest|image: $DOCKER_IMAGE:$IMAGE_TAG|g" "$deployment_file"

    # Apply deployment
    kubectl apply -f "$deployment_file"

    # Restore original file
    mv "$deployment_file.bak" "$deployment_file"

    success "Application deployed to $ENVIRONMENT"
}

# Function to wait for deployment
wait_for_deployment() {
    log "Waiting for deployment rollout..."

    local deployment_name="hkhr-evaluation-frontend"
    if [ "$ENVIRONMENT" = "staging" ]; then
        deployment_name="hkhr-evaluation-frontend-staging"
    fi

    # Wait for rollout to complete
    kubectl rollout status deployment/"$deployment_name" -n "$NAMESPACE" --timeout=600s

    # Wait for pods to be ready
    kubectl wait --for=condition=ready pod -l app="$deployment_name" -n "$NAMESPACE" --timeout=300s

    success "Deployment rollout completed"
}

# Function to run health check
run_health_check() {
    log "Running health check..."

    local service_name="hkhr-evaluation-frontend-service"
    if [ "$ENVIRONMENT" = "staging" ]; then
        service_name="hkhr-evaluation-frontend-staging-service"
    fi

    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        local health_status=$(kubectl get pod -l app="$service_name" -n "$NAMESPACE" -o jsonpath='{.items[0].status.phase}')

        if [ "$health_status" = "Running" ]; then
            # Check health endpoint
            local pod_name=$(kubectl get pod -l app="$service_name" -n "$NAMESPACE" -o jsonpath='{.items[0].metadata.name}')

            if kubectl exec "$pod_name" -n "$NAMESPACE" -- curl -f -s http://localhost:8080/health >/dev/null 2>&1; then
                success "Health check passed"
                return 0
            fi
        fi

        log "Health check attempt $attempt/$max_attempts failed, retrying in 10 seconds..."
        sleep 10
        ((attempt++))
    done

    error "Health check failed after $max_attempts attempts"
    return 1
}

# Function to show deployment status
show_deployment_status() {
    log "Deployment status:"

    echo
    echo "Namespace: $NAMESPACE"
    echo "Environment: $ENVIRONMENT"
    echo "Image: $DOCKER_IMAGE:$IMAGE_TAG"
    echo

    kubectl get pods -n "$NAMESPACE" -l app=hkhr-evaluation-frontend
    echo

    kubectl get services -n "$NAMESPACE" -l service-type=frontend
    echo

    if [ "$ENVIRONMENT" = "production" ]; then
        kubectl get ingress -n "$NAMESPACE"
        echo

        kubectl get hpa -n "$NAMESPACE"
    fi
}

# Function to get external URLs
get_external_urls() {
    log "External URLs:"

    if [ "$ENVIRONMENT" = "staging" ]; then
        echo "Staging URL: https://staging.hkhr-evaluation.com"
    else
        echo "Production URL: https://hkhr-evaluation.com"

        # Get load balancer IP if available
        local lb_ip=$(kubectl get service hkhr-evaluation-frontend-internal -n "$NAMESPACE" -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
        if [ -n "$lb_ip" ]; then
            echo "Load Balancer IP: $lb_ip"
        fi
    fi

    # Get ingress information
    local ingress_host=$(kubectl get ingress -n "$NAMESPACE" -o jsonpath='{.items[0].spec.rules[0].host}' 2>/dev/null || echo "")
    if [ -n "$ingress_host" ]; then
        echo "Ingress Host: $ingress_host"
    fi
}

# Function to enable monitoring
enable_monitoring() {
    if [ "${ENABLE_MONITORING:-false}" = "true" ]; then
        log "Enabling monitoring..."

        # Apply monitoring manifests
        if [ -d "$K8S_DIR/monitoring" ]; then
            kubectl apply -f "$K8S_DIR/monitoring/" -n "$NAMESPACE"
            success "Monitoring enabled"
        fi
    fi
}

# Function to cleanup
cleanup() {
    log "Cleaning up temporary files..."

    # Remove backup files created during deployment
    find "$K8S_DIR" -name "*.bak" -delete 2>/dev/null || true

    success "Cleanup completed"
}

# Function to rollback deployment
rollback_deployment() {
    log "Rolling back deployment..."

    local deployment_name="hkhr-evaluation-frontend"
    if [ "$ENVIRONMENT" = "staging" ]; then
        deployment_name="hkhr-evaluation-frontend-staging"
    fi

    kubectl rollout undo deployment/"$deployment_name" -n "$NAMESPACE"
    kubectl rollout status deployment/"$deployment_name" -n "$NAMESPACE" --timeout=300s

    success "Deployment rolled back"
}

# Function to show usage
show_usage() {
    cat << EOF
Usage: $0 [environment] [options]

Environments:
  staging      Deploy to staging environment
  production   Deploy to production environment

Options:
  --image IMAGE      Docker image to deploy (default: ghcr.io/hkhr-project/ai-evaluation-frontend)
  --tag TAG         Image tag to deploy (default: latest)
  --skip-image-check Skip Docker image pull check
  --enable-monitoring Enable monitoring and logging
  --rollback        Rollback to previous deployment
  --status-only     Show deployment status only
  --health-only     Run health check only

Environment Variables:
  DOCKER_IMAGE       Docker image name
  IMAGE_TAG          Image tag to deploy
  SKIP_IMAGE_CHECK  Skip Docker image check
  ENABLE_MONITORING Enable monitoring

Examples:
  $0 staging
  $0 production --tag v1.2.3
  $0 staging --enable-monitoring --skip-image-check
  $0 production --rollback

EOF
}

# Main deployment flow
main() {
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --image)
                DOCKER_IMAGE="$2"
                shift 2
                ;;
            --tag)
                IMAGE_TAG="$2"
                shift 2
                ;;
            --skip-image-check)
                export SKIP_IMAGE_CHECK=true
                shift
                ;;
            --enable-monitoring)
                export ENABLE_MONITORING=true
                shift
                ;;
            --rollback)
                ROLLBACK=true
                shift
                ;;
            --status-only)
                STATUS_ONLY=true
                shift
                ;;
            --health-only)
                HEALTH_ONLY=true
                shift
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                if [[ $1 == -* ]]; then
                    error "Unknown option: $1"
                    show_usage
                    exit 1
                fi
                shift
                ;;
        esac
    done

    # Trap cleanup on exit
    trap cleanup EXIT

    log "Starting Kubernetes deployment to $ENVIRONMENT environment..."
    log "Image: $DOCKER_IMAGE:$IMAGE_TAG"

    # Handle special modes
    if [ "${ROLLBACK:-false}" = "true" ]; then
        validate_environment
        check_prerequisites
        rollback_deployment
        show_deployment_status
        exit 0
    fi

    if [ "${STATUS_ONLY:-false}" = "true" ]; then
        validate_environment
        check_prerequisites
        show_deployment_status
        get_external_urls
        exit 0
    fi

    if [ "${HEALTH_ONLY:-false}" = "true" ]; then
        validate_environment
        check_prerequisites
        run_health_check
        exit 0
    fi

    # Main deployment steps
    validate_environment
    check_prerequisites
    create_namespace
    apply_secrets
    apply_configmaps
    deploy_application
    wait_for_deployment
    run_health_check
    enable_monitoring
    show_deployment_status
    get_external_urls

    success "Kubernetes deployment to $ENVIRONMENT completed successfully!"
}

# Run main function
main "$@"