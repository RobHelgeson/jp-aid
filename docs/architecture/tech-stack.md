# Tech Stack

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Language** | TypeScript | ~5.8.2 | Type-safe frontend development | Strong typing, excellent tooling, native to Angular. |
| **Frontend Framework** | Angular | ~20.0.0 | Core frontend framework | Robust framework for building scalable SPAs. |
| **UI Component Library** | Angular Material | ~18.0.0 | High-quality UI components | Provides a suite of well-tested, accessible components. |
| **Backend Language** | TypeScript | ~5.8.2 | Type-safe backend development | Code sharing with frontend, strong typing. |
| **Backend Framework** | NestJS | ~10.0.0 | Building efficient, scalable server-side apps | Provides an opinionated, modular architecture. |
| **API Style** | REST | - | Standard for client-server communication | Well-understood, widely supported. |
| **Database** | Memgraph | latest | Primary graph data store | High-performance in-memory graph database with Cypher. |
| **File Storage** | Kubernetes PVC | - | Persistent storage for assets | Standard K8s primitive for stateful storage. |
| **Authentication** | JWT via Passport.js | - | Secure API authentication | Standard, token-based authentication mechanism. |
| **E2E Testing** | Playwright | ^1.36.0 | End-to-end application testing | Modern, capable E2E testing for the whole app. |
| **Build Tool** | Nx | 21.2.2 | Monorepo build orchestrator | Manages builds, tests, and dependencies efficiently. |
| **IaC Tool** | Helm | v3+ | Kubernetes Package Management | The de-facto standard for packaging K8s applications. |
| **Local Dev Orchestrator** | Tilt | latest | Manages local K8s development environment | Provides fast feedback and live updates for K8s. |
| **CI/CD** | GitHub Actions | - | Continuous integration and deployment | Automates build, test, and deployment pipelines to K8s. |
| **Monitoring** | Prometheus/Grafana | - | System monitoring and visualization | The open-source standard for metrics in Kubernetes. |
| **Logging** | Loki/Promtail | - | Centralized logging | Lightweight, cost-effective, and integrates with Grafana. |
| **CSS Framework** | SCSS | - | Advanced CSS styling | Superset of CSS with more features. |
