# Unified Project Structure

```plaintext
@jp-aid/source/
├── .github/                    # CI/CD workflows
│   └── workflows/
│       └── ci.yaml
├── apps/                       # Application packages
│   ├── jp-aid/                 # Angular frontend application
│   │   ├── src/
│   │   │   ├── app/            # Core application logic, components
│   │   │   ├── assets/         # Static assets like images, fonts
│   │   │   └── environments/   # Environment-specific configuration
│   │   ├── project.json        # Nx project configuration
│   │   └── ...
│   └── api/                    # NestJS backend application
│       ├── src/
│       │   ├── app/            # Core application modules
│       │   │   ├── auth/       # Authentication module
│       │   │   ├── core/       # Core services, guards, etc.
│       │   │   └── feature-x/  # Example feature module
│       │   ├── main.ts         # Application entry point
│       │   └── ...
│       ├── project.json        # Nx project configuration
│       └── ...
├── libs/                       # Shared packages
│   ├── shared-interfaces/      # Shared TypeScript types/interfaces
│   │   ├── src/
│   │   └── project.json
│   └── ui/                     # Shared UI components (optional)
│       ├── src/
│       └── project.json
├── kubernetes/                 # Kubernetes manifests and Helm charts
│   └── helm/
│       └── jp-aid/
│           ├── Chart.yaml
│           ├── values.yaml
│           └── templates/
├── docs/                       # Project documentation
│   ├── prd.md
│   ├── fullstack-architecture.md
│   └── ...
├── .env.example                # Environment variable template
├── nx.json                     # Nx workspace configuration
├── package.json                # Root package.json
└── README.md
```
