# GCP Setup Guide

This guide covers setting up Google Cloud Platform resources for {{APP_TITLE}}.

## Prerequisites

- GCP Account with billing enabled
- `gcloud` CLI installed and configured
- Project created in GCP Console

## 1. Enable APIs

```bash
gcloud services enable \
  container.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  cloudresourcemanager.googleapis.com \
  iam.googleapis.com
```

## 2. Create Artifact Registry

```bash
# Create Docker repository
gcloud artifacts repositories create {{APP_NAME}} \
  --repository-format=docker \
  --location=us-central1 \
  --description="{{APP_TITLE}} container images"

# Configure Docker authentication
gcloud auth configure-docker us-central1-docker.pkg.dev
```

## 3. Create GKE Cluster

```bash
gcloud container clusters create {{APP_NAME}}-cluster \
  --zone=us-central1-a \
  --num-nodes=3 \
  --machine-type=e2-medium \
  --workload-pool={{GCP_PROJECT}}.svc.id.goog \
  --enable-ip-alias \
  --enable-network-policy
```

## 4. Create Service Account

```bash
# Create service account
gcloud iam service-accounts create {{APP_NAME}} \
  --display-name="{{APP_TITLE}} Service Account"

# Grant Secret Manager access
gcloud projects add-iam-policy-binding {{GCP_PROJECT}} \
  --member="serviceAccount:{{APP_NAME}}@{{GCP_PROJECT}}.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Bind to Kubernetes service account (Workload Identity)
gcloud iam service-accounts add-iam-policy-binding \
  {{APP_NAME}}@{{GCP_PROJECT}}.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="serviceAccount:{{GCP_PROJECT}}.svc.id.goog[{{APP_NAME}}/{{APP_NAME}}]"
```

## 5. Setup GitHub Actions Authentication

```bash
# Create workload identity pool
gcloud iam workload-identity-pools create github \
  --location=global \
  --display-name="GitHub Actions"

# Create provider
gcloud iam workload-identity-pools providers create-oidc github \
  --location=global \
  --workload-identity-pool=github \
  --display-name="GitHub Actions" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"

# Create GitHub Actions service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions"

# Grant permissions
gcloud projects add-iam-policy-binding {{GCP_PROJECT}} \
  --member="serviceAccount:github-actions@{{GCP_PROJECT}}.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding {{GCP_PROJECT}} \
  --member="serviceAccount:github-actions@{{GCP_PROJECT}}.iam.gserviceaccount.com" \
  --role="roles/container.developer"

# Allow GitHub to impersonate
gcloud iam service-accounts add-iam-policy-binding \
  github-actions@{{GCP_PROJECT}}.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github/attribute.repository/{{GITHUB_ORG}}/{{APP_NAME}}"
```

## 6. Add GitHub Secrets

In your GitHub repository settings, add:

| Secret | Value |
|--------|-------|
| `GCP_PROJECT` | Your GCP project ID |
| `GCP_PROJECT_NUMBER` | Your GCP project number |