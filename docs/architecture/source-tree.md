# JP-Aid Source Tree Architecture

## Introduction

This document provides a comprehensive overview of the JP-Aid project's source tree structure, code organization patterns, and architectural guidance for maintaining consistency across the codebase. The project is built on Nx, a powerful monorepo tool that enables efficient development and management of multiple applications and shared libraries.

## Repository Structure Overview

JP-Aid follows Nx workspace conventions with a clear separation between applications, libraries, and documentation:

```
jp-aid/
├── apps/                     # Applications
│   ├── jp-aid/              # Main Angular application
│   └── jp-aid-e2e/          # End-to-end tests
├── libs/                     # Shared libraries
│   └── shared-interfaces/    # TypeScript interfaces and types
├── docs/                     # Documentation
│   ├── architecture/         # Architecture documentation
│   ├── prd/                 # Product requirements
│   └── stories/             # User stories
├── .bmad-core/              # BMAD Method configuration
└── [configuration files]    # Nx, TypeScript, and tooling config
```

## Applications Directory (`apps/`)

### Main Application (`apps/jp-aid/`)

The primary Angular application with a focused structure for Japanese language learning:

```
apps/jp-aid/
├── public/                   # Static assets
│   └── favicon.ico
├── src/
│   ├── app/                 # Application root
│   │   ├── app.config.ts    # App configuration
│   │   ├── app.routes.ts    # Route configuration
│   │   ├── app.scss         # Global styles
│   │   ├── kanji-search/    # Kanji search feature
│   │   ├── kanji-results/   # Kanji results display
│   │   └── services/        # Application services
│   ├── styles/              # Global styling
│   │   └── themes/          # Theme definitions
│   ├── index.html           # Application entry point
│   └── main.ts              # Bootstrap file
├── eslint.config.mjs        # ESLint configuration
├── jest.config.ts           # Jest testing config
├── project.json             # Nx project configuration
└── tsconfig.*.json          # TypeScript configurations
```

**Architectural Patterns:**

- **Feature-based organization**: Each major feature (kanji-search, kanji-results) has its own directory
- **Component co-location**: HTML, SCSS, spec, and TypeScript files are grouped together
- **Service layer separation**: Business logic isolated in services directory
- **Configuration separation**: Distinct configs for app, routing, and styling

### E2E Testing (`apps/jp-aid-e2e/`)

Playwright-based end-to-end testing application:

```
apps/jp-aid-e2e/
├── src/
│   └── example.spec.ts      # Test specifications
├── playwright.config.ts     # Playwright configuration
├── project.json             # Nx project configuration
└── tsconfig.json            # TypeScript configuration
```

## Libraries Directory (`libs/`)

### Shared Interfaces (`libs/shared-interfaces/`)

Centralized TypeScript interfaces and types for cross-application consistency:

```
libs/shared-interfaces/
├── src/
│   ├── lib/
│   │   ├── kanji.ts         # Kanji-related interfaces
│   │   └── shared-interfaces.ts  # Common interfaces
│   └── index.ts             # Public API exports
├── project.json             # Nx project configuration
└── tsconfig.*.json          # TypeScript configurations
```

**Architectural Benefits:**

- **Type safety**: Shared interfaces ensure consistent data structures
- **Reusability**: Common types available across all applications
- **Single source of truth**: Interface definitions centralized
- **Nx graph optimization**: Proper dependency tracking

## Documentation Structure (`docs/`)

### Architecture Documentation (`docs/architecture/`)

### Service Layer Organization

Services are organized by domain and responsibility:

```
services/
├── data/                    # Data access services
├── business/               # Business logic services
├── utility/                # Utility services
└── api/                    # API communication services
```

### Styling Architecture

```
styles/
├── themes/                 # Theme definitions
│   ├── light.scss
│   └── dark.scss
├── components/             # Component-specific styles
├── utilities/              # Utility classes
└── variables/              # SCSS variables
```

## Nx Configuration and Tooling

### Workspace Configuration

Key configuration files that define the workspace behavior:

- **`nx.json`**: Nx workspace configuration, caching, and task runners
- **`tsconfig.base.json`**: Base TypeScript configuration shared across projects
- **`package.json`**: Workspace dependencies and scripts
- **`jest.config.ts`**: Global Jest configuration
- **`eslint.config.mjs`**: Global ESLint configuration
