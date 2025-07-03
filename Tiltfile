# Tiltfile for the jp-aid project
# For more information on Tilt, see: https://docs.tilt.dev/

# --- Image Builds ---
# Define how to build the Docker images for our frontend and backend.
# Tilt will automatically discover the Dockerfiles based on our nx.json configuration.
# We add live_update to sync local file changes into the running container
# without a full image rebuild, which is much faster.

docker_build(
    'jp-aid-api',
    context='.',
    dockerfile='apps/api/Dockerfile',
    live_update=[
        sync('apps/api/src', '/app/src')
    ]
)

docker_build(
    'jp-aid-frontend',
    context='.',
    dockerfile='apps/jp-aid/Dockerfile',
    live_update=[
        sync('dist/apps/jp-aid', '/usr/share/nginx/html')
    ]
)


# --- Kubernetes Deployment ---
# Use the existing Helm chart to deploy everything.
# We tell Tilt about the images it builds so it can inject the
# freshly built image references into the Helm template.
helm(
    './kubernetes/helm/jp-aid',
    name='jp-aid',
    namespace='jp-aid',
    set=[
        'api.image.repository=jp-aid-api',
        'frontend.image.repository=jp-aid-frontend'
    ]
)
