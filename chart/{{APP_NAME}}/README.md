# {{APP_TITLE}} Helm Chart

Helm chart for deploying {{APP_TITLE}} Discord bot with multi-service architecture.

## Prerequisites

- Kubernetes 1.28+
- Helm 3.14+
- Gateway API CRDs installed
- cert-manager for TLS certificates
- Secrets Store CSI Driver with GCP provider

## Components

This chart deploys:

- **Bot Service**: Discord.js bot with slash commands
- **API Service**: Express REST API for bot management
- **Dashboard**: Next.js admin interface
- **PostgreSQL**: Database (Bitnami subchart)
- **Redis**: Cache and pub/sub (Bitnami subchart)

## Installation

```bash
# Update dependencies
helm dependency update

# Install for development
helm install {{APP_NAME}} . -f base/values.yaml -f dev/values.yaml -n {{APP_NAME}}-dev

# Install for production
helm install {{APP_NAME}} . -f base/values.yaml -f prod/values.yaml -n {{APP_NAME}}
```

## Configuration

### Required Secrets in Google Secret Manager

| Secret Name | Description |
|-------------|-------------|
| `{{APP_NAME}}-discord-token` | Discord bot token |
| `{{APP_NAME}}-database-url` | PostgreSQL connection URL |
| `{{APP_NAME}}-api-key` | API authentication key |

### Environment-Specific Values

- `base/values.yaml` - Shared configuration
- `dev/values.yaml` - Development overrides
- `staging/values.yaml` - Staging overrides
- `prod/values.yaml` - Production overrides

## Upgrading

```bash
helm upgrade {{APP_NAME}} . -f base/values.yaml -f prod/values.yaml -n {{APP_NAME}}
```

## Uninstalling

```bash
helm uninstall {{APP_NAME}} -n {{APP_NAME}}
```