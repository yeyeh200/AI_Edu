#!/bin/bash

# AI Evaluation System Frontend Deployment Script
# Usage: ./scripts/deploy.sh [environment] [options]

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_DIR/dist"
ENVIRONMENT="${1:-staging}"
VERSION="${2:-latest}"
REGISTRY="${DOCKER_REGISTRY:-ghcr.io}"
IMAGE_NAME="${DOCKER_IMAGE_NAME:-hkhr-project/ai-evaluation-frontend}"

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
        "development"|"staging"|"production")
            log "Deploying to $ENVIRONMENT environment"
            ;;
        *)
            error "Invalid environment: $ENVIRONMENT. Must be development, staging, or production"
            exit 1
            ;;
    esac
}

# Function to check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."

    # Check if Docker is installed
    if ! command_exists docker; then
        error "Docker is not installed or not in PATH"
        exit 1
    fi

    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        error "Docker is not running"
        exit 1
    fi

    # Check if Node.js is installed
    if ! command_exists node; then
        error "Node.js is not installed or not in PATH"
        exit 1
    fi

    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt "18" ]; then
        error "Node.js version 18 or higher is required. Current version: $(node --version)"
        exit 1
    fi

    success "All prerequisites satisfied"
}

# Function to clean previous build
clean_build() {
    log "Cleaning previous build..."

    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
    fi

    # Remove node_modules for fresh install
    if [ "${CLEAN_DEPS:-false}" = "true" ]; then
        log "Removing node_modules..."
        rm -rf "$PROJECT_DIR/node_modules"
    fi

    success "Build cleaned"
}

# Function to install dependencies
install_dependencies() {
    log "Installing dependencies..."

    cd "$PROJECT_DIR"

    if [ -f "package-lock.json" ]; then
        npm ci --production=false
    else
        npm install
    fi

    success "Dependencies installed"
}

# Function to run tests
run_tests() {
    if [ "${SKIP_TESTS:-false}" = "true" ]; then
        warn "Skipping tests as per SKIP_TESTS flag"
        return 0
    fi

    log "Running tests..."

    cd "$PROJECT_DIR"

    # Type checking
    npm run type-check

    # Linting
    npm run lint

    # Unit tests
    npm run test -- --run

    # Integration tests
    npm run test:integration

    success "All tests passed"
}

# Function to build application
build_application() {
    log "Building application for $ENVIRONMENT..."

    cd "$PROJECT_DIR"

    # Set environment variables
    export NODE_ENV=production
    export VITE_APP_ENV="$ENVIRONMENT"
    export VITE_APP_VERSION="$VERSION"

    # Build the application
    npm run build

    # Verify build output
    if [ ! -d "$BUILD_DIR" ] || [ ! -f "$BUILD_DIR/index.html" ]; then
        error "Build failed - no output found in $BUILD_DIR"
        exit 1
    fi

    success "Application built successfully"
}

# Function to analyze bundle size
analyze_bundle() {
    if [ "${ANALYZE_BUNDLE:-false}" = "true" ]; then
        log "Analyzing bundle size..."
        cd "$PROJECT_DIR"
        npm run build:analyze
    fi
}

# Function to build Docker image
build_docker_image() {
    log "Building Docker image..."

    cd "$PROJECT_DIR"

    # Build arguments
    BUILD_ARGS=(
        "--build-arg" "NODE_ENV=production"
        "--build-arg" "BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
        "--build-arg" "VCS_REF=$(git rev-parse HEAD 2>/dev/null || echo 'unknown')"
    )

    if [ -n "$VERSION" ] && [ "$VERSION" != "latest" ]; then
        BUILD_ARGS+=("--build-arg" "VERSION=$VERSION")
    fi

    # Build the image
    docker build "${BUILD_ARGS[@]}" -t "${IMAGE_NAME}:${VERSION}" -t "${IMAGE_NAME}:latest" .

    success "Docker image built successfully"
}

# Function to push Docker image
push_docker_image() {
    if [ "${SKIP_PUSH:-false}" = "true" ]; then
        warn "Skipping Docker image push as per SKIP_PUSH flag"
        return 0
    fi

    log "Pushing Docker image..."

    # Login to registry if credentials are provided
    if [ -n "${DOCKER_USERNAME}" ] && [ -n "${DOCKER_PASSWORD}" ]; then
        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin "$REGISTRY"
    fi

    # Push version tag
    docker push "${IMAGE_NAME}:${VERSION}"

    # Push latest tag
    if [ "$VERSION" != "latest" ]; then
        docker push "${IMAGE_NAME}:latest"
    fi

    success "Docker image pushed successfully"
}

# Function to deploy to environment
deploy_to_environment() {
    log "Deploying to $ENVIRONMENT..."

    case "$ENVIRONMENT" in
        "development")
            deploy_development
            ;;
        "staging")
            deploy_staging
            ;;
        "production")
            deploy_production
            ;;
    esac
}

# Function to deploy to development
deploy_development() {
    log "Starting development deployment..."

    # Stop existing containers
    docker-compose -f docker-compose.dev.yml down || true

    # Start new containers
    docker-compose -f docker-compose.dev.yml up -d

    success "Development deployment completed"
}

# Function to deploy to staging
deploy_staging() {
    log "Starting staging deployment..."

    # SSH deployment or use docker-compose
    if [ -n "${STAGING_HOST}" ] && [ -n "${STAGING_USER}" ]; then
        # Remote deployment via SSH
        ssh "${STAGING_USER}@${STAGING_HOST}" "
            cd /opt/hkhr-evaluation &&
            docker-compose -f docker-compose.staging.yml pull &&
            docker-compose -f docker-compose.staging.yml up -d &&
            docker system prune -f
        "
    else
        # Local deployment
        docker-compose -f docker-compose.staging.yml down || true
        docker-compose -f docker-compose.staging.yml up -d
    fi

    success "Staging deployment completed"
}

# Function to deploy to production
deploy_production() {
    log "Starting production deployment..."

    # Confirm deployment for production
    read -p "Are you sure you want to deploy to production? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        warn "Production deployment cancelled"
        exit 0
    fi

    if [ -n "${PRODUCTION_HOST}" ] && [ -n "${PRODUCTION_USER}" ]; then
        # Remote deployment via SSH
        ssh "${PRODUCTION_USER}@${PRODUCTION_HOST}" "
            cd /opt/hkhr-evaluation &&
            docker-compose -f docker-compose.prod.yml pull &&
            docker-compose -f docker-compose.prod.yml up -d --no-deps frontend &&
            docker system prune -f
        "
    else
        # Local deployment
        docker-compose -f docker-compose.prod.yml down || true
        docker-compose -f docker-compose.prod.yml up -d
    fi

    success "Production deployment completed"
}

# Function to run health check
run_health_check() {
    log "Running health check..."

    local health_url="${HEALTH_URL:-http://localhost:8080/health}"
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$health_url" >/dev/null 2>&1; then
            success "Health check passed"
            return 0
        fi

        log "Health check attempt $attempt/$max_attempts failed, retrying in 10 seconds..."
        sleep 10
        ((attempt++))
    done

    error "Health check failed after $max_attempts attempts"
    return 1
}

# Function to cleanup
cleanup() {
    log "Cleaning up..."

    # Remove temporary files
    if [ -d "$BUILD_DIR" ] && [ "${KEEP_BUILD:-false}" != "true" ]; then
        rm -rf "$BUILD_DIR"
    fi

    success "Cleanup completed"
}

# Function to show usage
show_usage() {
    cat << EOF
Usage: $0 [environment] [options]

Environments:
  development    Deploy to development environment
  staging        Deploy to staging environment
  production     Deploy to production environment

Options:
  --version VERSION     Set application version (default: latest)
  --skip-tests          Skip running tests
  --skip-push           Skip pushing Docker image
  --clean-deps          Remove node_modules before build
  --analyze-bundle      Run bundle analysis
  --keep-build          Keep build artifacts
  --health-url URL      Health check URL (default: http://localhost:8080/health)

Environment Variables:
  DOCKER_REGISTRY       Docker registry URL
  DOCKER_IMAGE_NAME     Docker image name
  DOCKER_USERNAME       Docker registry username
  DOCKER_PASSWORD       Docker registry password
  STAGING_HOST          Staging server host
  STAGING_USER          Staging server user
  PRODUCTION_HOST       Production server host
  PRODUCTION_USER       Production server user

Examples:
  $0 staging
  $0 production --version v1.2.3 --skip-tests
  $0 development --clean-deps --analyze-bundle

EOF
}

# Main deployment flow
main() {
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --version)
                VERSION="$2"
                shift 2
                ;;
            --skip-tests)
                export SKIP_TESTS=true
                shift
                ;;
            --skip-push)
                export SKIP_PUSH=true
                shift
                ;;
            --clean-deps)
                export CLEAN_DEPS=true
                shift
                ;;
            --analyze-bundle)
                export ANALYZE_BUNDLE=true
                shift
                ;;
            --keep-build)
                export KEEP_BUILD=true
                shift
                ;;
            --health-url)
                export HEALTH_URL="$2"
                shift 2
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

    log "Starting deployment to $ENVIRONMENT environment..."
    log "Version: $VERSION"
    log "Image: $IMAGE_NAME"

    # Main deployment steps
    validate_environment
    check_prerequisites
    clean_build
    install_dependencies
    run_tests
    build_application
    analyze_bundle
    build_docker_image
    push_docker_image
    deploy_to_environment
    run_health_check

    success "Deployment to $ENVIRONMENT completed successfully!"
}

# Run main function
main "$@"