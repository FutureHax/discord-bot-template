#!/bin/bash
# Publish release script - builds and pushes Docker images with version tag
set -e

VERSION=$1
REGISTRY=${DOCKER_REGISTRY:-"{{DOCKER_REGISTRY}}"}
APP_NAME=${APP_NAME:-"{{APP_NAME}}"}

if [ -z "$VERSION" ]; then
  echo "Error: Version argument required"
  exit 1
fi

echo "Publishing version $VERSION..."

# Tag and push Docker images
echo "Tagging Docker images with version $VERSION..."

# Bot
docker tag "$REGISTRY/$APP_NAME:latest" "$REGISTRY/$APP_NAME:$VERSION"
docker push "$REGISTRY/$APP_NAME:$VERSION"

# API
docker tag "$REGISTRY/$APP_NAME-api:latest" "$REGISTRY/$APP_NAME-api:$VERSION"
docker push "$REGISTRY/$APP_NAME-api:$VERSION"

# Dashboard
docker tag "$REGISTRY/$APP_NAME-dashboard:latest" "$REGISTRY/$APP_NAME-dashboard:$VERSION"
docker push "$REGISTRY/$APP_NAME-dashboard:$VERSION"

echo "Docker images pushed successfully!"

# Update Helm chart version
echo "Updating Helm chart version..."
sed -i "s/^version:.*/version: $VERSION/" chart/$APP_NAME/Chart.yaml
sed -i "s/^appVersion:.*/appVersion: \"$VERSION\"/" chart/$APP_NAME/Chart.yaml

echo "Release $VERSION published successfully!"