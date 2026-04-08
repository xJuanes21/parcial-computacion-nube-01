#!/bin/bash

# Configuration
DOCKER_USER="xjuanes21"
SERVICES=("microUsers" "microProducts" "microOrders")

echo "--- Building and Pushing Microservices to Docker Hub ---"

for SERVICE in "${SERVICES[@]}"; do
    case $SERVICE in
        "microUsers")
            IMAGE_NAME="users-service"
            ;;
        "microProducts")
            IMAGE_NAME="products-service"
            ;;
        "microOrders")
            IMAGE_NAME="orders-service"
            ;;
    esac

    echo "[*] Processing $SERVICE..."
    
    # Build image
    docker build -t "$DOCKER_USER/$IMAGE_NAME:latest" "./$SERVICE"
    
    # Push image
    echo "[*] Pushing $DOCKER_USER/$IMAGE_NAME:latest..."
    docker push "$DOCKER_USER/$IMAGE_NAME:latest"
done

echo "--- Build and Push complete! ---"
