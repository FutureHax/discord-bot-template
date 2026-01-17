# Kubernetes Setup Guide

This guide covers setting up the Kubernetes cluster for {{APP_TITLE}}.

## Prerequisites

- Kubernetes 1.28+
- Helm 3.14+
- kubectl configured for your cluster

## 1. Install Gateway API CRDs

```bash
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.0.0/standard-install.yaml
```

## 2. Install cert-manager

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update

helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true
```

### Create ClusterIssuers

```yaml
# letsencrypt-staging.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-staging
    solvers:
      - http01:
          gatewayHTTPRoute:
            parentRefs:
              - name: {{APP_NAME}}
                namespace: {{APP_NAME}}
                kind: Gateway
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-production
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-production
    solvers:
      - http01:
          gatewayHTTPRoute:
            parentRefs:
              - name: {{APP_NAME}}
                namespace: {{APP_NAME}}
                kind: Gateway
```

## 3. Install Secrets Store CSI Driver

```bash
helm repo add secrets-store-csi-driver https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts

helm install csi-secrets-store secrets-store-csi-driver/secrets-store-csi-driver \
  --namespace kube-system \
  --set syncSecret.enabled=true
```

### Install GCP Provider

```bash
kubectl apply -f https://raw.githubusercontent.com/GoogleCloudPlatform/secrets-store-csi-driver-provider-gcp/main/deploy/provider-gcp-plugin.yaml
```

## 4. Install Flux

```bash
# Install Flux CLI
curl -s https://fluxcd.io/install.sh | sudo bash

# Bootstrap Flux
flux bootstrap github \
  --owner={{GITHUB_ORG}} \
  --repository={{APP_NAME}} \
  --path=flux \
  --personal
```

## 5. Install External DNS (Optional)

```bash
helm repo add external-dns https://kubernetes-sigs.github.io/external-dns/

helm install external-dns external-dns/external-dns \
  --namespace external-dns \
  --create-namespace \
  --set provider=google \
  --set google.project={{GCP_PROJECT}} \
  --set policy=sync
```

## Verification

```bash
# Check Gateway API
kubectl get gateways -A

# Check cert-manager
kubectl get clusterissuers

# Check CSI driver
kubectl get csidrivers

# Check Flux
flux check
```