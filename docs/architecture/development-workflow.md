# Development Workflow

This section outlines the commands for setting up and running the project locally.

## Prerequisites

- Node.js (with npm)
- Docker Desktop (with Kubernetes enabled)
- Tilt

## Initial Setup

1. **Clone the repository:**

    ```bash
    git clone <repo-url>
    cd jp-aid
    ```

2. **Install npm dependencies:**

    ```bash
    npm install
    ```

## Local Development with Tilt

For local development against a Kubernetes cluster, Tilt provides the best experience. It watches your files for changes and automatically builds images and deploys them, providing a live-reloading environment inside Kubernetes.

1. **Ensure Docker Desktop is running with its Kubernetes cluster enabled.**

2. **Start the development environment:**

    ```bash
    tilt up
    ```

    Tilt will open a web UI in your browser (usually at `http://localhost:10350`). This UI shows the status of all your services, build logs, and Kubernetes events. The frontend will be accessible at `http://localhost/` once all services are up and running.

3. **To stop the environment:**

    ```bash
    tilt down
    ```

## Standalone Local Development (No Kubernetes)

If you wish to run the services locally without Kubernetes, you can use the standard Nx serve commands. Note that the database will not be available with this method unless you run it separately.

```bash