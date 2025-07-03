# Deployment Architecture

The application is designed to be deployed into a Kubernetes cluster. The deployment is managed entirely by a Helm chart located in `kubernetes/helm/jp-aid/`.

- **Frontend Deployment:** The Angular application is compiled into static assets. A multi-stage Dockerfile first builds the app, then copies the assets into a lightweight NGINX container. This container is deployed as a Kubernetes Deployment and exposed via a Service.
- **Backend Deployment:** The NestJS application is bundled into a Node.js server application. Its Dockerfile creates a production-ready image, which is deployed as a Kubernetes Deployment and exposed via a Service.
- **Database Deployment:** Memgraph is deployed as a Kubernetes StatefulSet to ensure stable network identity and persistent storage. A PersistentVolumeClaim (PVC) is used to provision storage for the graph data.
- **Ingress:** An Ingress resource is used to manage external access to the frontend and backend services, routing traffic based on URL paths (e.g., `/api/*` to the backend, `/` to the frontend).

## CI/CD Pipeline

The project will use GitHub Actions for continuous integration and deployment. A workflow will be defined in `.github/workflows/ci.yaml` that automates the following steps on every push to the `main` branch:

1. **Lint & Test:** Run linting and unit tests for both frontend and backend applications using Nx.
2. **Build Docker Images:** Build production Docker images for the frontend and backend.
3. **Push to Registry:** Push the images to a container registry (e.g., Docker Hub, GitHub Container Registry).
4. **Deploy to Kubernetes:** Use the `helm upgrade` command to deploy the new application versions to the production Kubernetes cluster.

A simplified example of the GitHub Actions workflow:

```yaml