# Secret Management Guide

This guide covers managing secrets for {{APP_TITLE}} using Google Secret Manager.

## Overview

Secrets are stored in Google Secret Manager and mounted into pods using the Secrets Store CSI Driver. This approach:

- Keeps secrets out of Git
- Provides audit logging
- Enables secret rotation
- Works with Workload Identity

## Required Secrets

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `{{APP_NAME}}-discord-token` | Discord bot token | Yes |
| `{{APP_NAME}}-database-url` | PostgreSQL connection URL | Yes |
| `{{APP_NAME}}-api-key` | API authentication key | Yes |
| `{{APP_NAME}}-discord-client-secret` | Discord OAuth secret | Dashboard only |
| `{{APP_NAME}}-field-encryption-key` | Prisma field encryption | Optional |

## Creating Secrets

### 1. Create secrets in GSM

```bash
# Discord token
echo -n "YOUR_DISCORD_TOKEN" | \
  gcloud secrets create {{APP_NAME}}-discord-token \
    --data-file=- \
    --project={{GCP_PROJECT}}

# Database URL
echo -n "postgresql://user:pass@host:5432/db" | \
  gcloud secrets create {{APP_NAME}}-database-url \
    --data-file=- \
    --project={{GCP_PROJECT}}

# API Key (generate random)
API_KEY=$(openssl rand -base64 32)
echo -n "$API_KEY" | \
  gcloud secrets create {{APP_NAME}}-api-key \
    --data-file=- \
    --project={{GCP_PROJECT}}
```

### 2. Grant access to service account

```bash
# Grant secret accessor role
for SECRET in discord-token database-url api-key; do
  gcloud secrets add-iam-policy-binding {{APP_NAME}}-$SECRET \
    --member="serviceAccount:{{APP_NAME}}@{{GCP_PROJECT}}.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor" \
    --project={{GCP_PROJECT}}
done
```

## Environment-Specific Secrets

For different environments (dev, staging, prod), prefix secrets:

```bash
# Development
gcloud secrets create {{APP_NAME}}-dev-discord-token ...

# Staging
gcloud secrets create {{APP_NAME}}-staging-discord-token ...

# Production
gcloud secrets create {{APP_NAME}}-discord-token ...
```

## Updating Secrets

```bash
# Add new version
echo -n "NEW_SECRET_VALUE" | \
  gcloud secrets versions add {{APP_NAME}}-discord-token \
    --data-file=- \
    --project={{GCP_PROJECT}}

# The CSI driver will pick up the new version on next pod restart
# To force update:
kubectl rollout restart deployment/{{APP_NAME}} -n {{APP_NAME}}
```

## Listing Secrets

```bash
# List all secrets
gcloud secrets list --project={{GCP_PROJECT}} --filter="name:{{APP_NAME}}"

# View secret versions
gcloud secrets versions list {{APP_NAME}}-discord-token --project={{GCP_PROJECT}}
```

## Local Development

For local development, use a `.env` file:

```bash
cp .env.example .env
# Edit .env with your local values
```

Never commit `.env` files to Git!