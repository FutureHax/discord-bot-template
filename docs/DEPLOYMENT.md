# Deployment Guide

This guide covers deploying {{APP_TITLE}} to Kubernetes.

## Deployment Methods

### 1. Flux GitOps (Recommended)

Flux automatically deploys changes when you push to Git.

#### Initial Setup

```bash
# Bootstrap Flux
flux bootstrap github \
  --owner={{GITHUB_ORG}} \
  --repository={{APP_NAME}} \
  --path=flux \
  --personal
```

#### Deploy to Development

```bash
# Apply dev kustomization
flux reconcile kustomization {{APP_NAME}}-dev --with-source

# Check status
flux get helmrelease -n {{APP_NAME}}-dev
```

#### Deploy to Production

```bash
# Resume if suspended
flux resume helmrelease {{APP_NAME}} -n {{APP_NAME}}

# Force reconciliation
flux reconcile helmrelease {{APP_NAME}} -n {{APP_NAME}}
```

### 2. Helm Direct Install

For environments without Flux:

```bash
# Update dependencies
cd chart/{{APP_NAME}}
helm dependency update

# Install/Upgrade
helm upgrade --install {{APP_NAME}} . \
  -f base/values.yaml \
  -f prod/values.yaml \
  -n {{APP_NAME}} \
  --create-namespace \
  --set bot.image.tag=1.0.0 \
  --set api.image.tag=1.0.0 \
  --set dashboard.image.tag=1.0.0
```

## Release Process

### Automatic (Semantic Release)

1. Commit with conventional commit message:
   ```bash
   git commit -m "feat(bot): add new command"
   git push origin main
   ```

2. GitHub Actions will:
   - Run tests
   - Build Docker images
   - Create GitHub release
   - Push Helm chart to registry

3. Flux detects new version and deploys

### Manual Release

```bash
# Build images
docker buildx bake --push

# Package and push Helm chart
helm package chart/{{APP_NAME}}
helm push {{APP_NAME}}-*.tgz oci://{{DOCKER_REGISTRY}}

# Update image tag in values
flux reconcile helmrelease {{APP_NAME}} -n {{APP_NAME}}
```

## Rollback

### With Helm

```bash
# List revisions
helm history {{APP_NAME}} -n {{APP_NAME}}

# Rollback to previous
helm rollback {{APP_NAME}} -n {{APP_NAME}}

# Rollback to specific revision
helm rollback {{APP_NAME}} 5 -n {{APP_NAME}}
```

### With Flux

```bash
# Suspend auto-updates
flux suspend helmrelease {{APP_NAME}} -n {{APP_NAME}}

# Rollback manually
helm rollback {{APP_NAME}} -n {{APP_NAME}}
```

## Monitoring

### Pod Status

```bash
kubectl get pods -n {{APP_NAME}} -w
```

### Logs

```bash
# Bot logs
kubectl logs -n {{APP_NAME}} -l app.kubernetes.io/component=bot -f

# API logs
kubectl logs -n {{APP_NAME}} -l app.kubernetes.io/component=api -f

# Dashboard logs
kubectl logs -n {{APP_NAME}} -l app.kubernetes.io/component=dashboard -f
```

### Health Checks

```bash
# Port forward to bot
kubectl port-forward -n {{APP_NAME}} svc/{{APP_NAME}} 3000:3000

# Check health
curl http://localhost:3000/health
```

## Troubleshooting

### Pod CrashLoopBackOff

```bash
# Check logs
kubectl logs -n {{APP_NAME}} <pod-name> --previous

# Describe pod
kubectl describe pod -n {{APP_NAME}} <pod-name>
```

### Secrets Not Mounting

```bash
# Check SecretProviderClass
kubectl get secretproviderclass -n {{APP_NAME}}

# Check CSI driver pods
kubectl get pods -n kube-system -l app=secrets-store-csi-driver
```

### Database Connection Issues

```bash
# Check PostgreSQL pod
kubectl get pods -n {{APP_NAME}} -l app.kubernetes.io/name=postgresql

# Test connection from bot pod
kubectl exec -it -n {{APP_NAME}} <bot-pod> -- \
  nc -zv {{APP_NAME}}-postgresql 5432
```