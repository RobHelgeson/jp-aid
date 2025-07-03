# Application Architecture

This section details the internal architecture of the frontend and backend applications.

## Frontend (Angular)

The Angular application follows a standard component-based architecture.

**Component Organization:**

Components will be organized by feature. Reusable, "dumb" components (e.g., custom buttons, cards) will live in a shared UI library within the monorepo (`libs/ui/`).

```text
apps/jp-aid/src/app/
├── components/
│   ├── kanji-search/
│   └── kanji-detail-view/
├── services/
│   ├── api.service.ts      # Handles all HTTP communication
│   └── auth.service.ts     # Manages user authentication state
└── guards/
    └── auth.guard.ts       # Protects routes that require login
```

**State Management:**

For simplicity, initial state management will rely on RxJS-based services. A centralized state store (like NgRx or Akita) will be considered if the application's state complexity grows significantly.

**Routing:**

Angular's built-in router will manage navigation. An `AuthGuard` will protect routes that require an authenticated user.

## Backend (NestJS)

The NestJS application uses a modular architecture, with each primary feature encapsulated in its own module.

**Module Organization:**

```text
apps/api/src/app/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   └── auth.service.ts
├── kanji/
│   ├── kanji.module.ts
│   ├── kanji.controller.ts
│   ├── kanji.service.ts
│   └── kanji.repository.ts # Handles direct database interaction
└── core/
    ├── guards/
    │   └── jwt-auth.guard.ts
    └── config/
        └── configuration.ts
```

**Data Access:**

The backend employs the **Repository Pattern**. Services will contain the business logic and will call methods in repository classes to interact with the Memgraph database. This isolates the data access logic and makes the application easier to test and maintain. The `kanji.repository.ts` will contain all the Cypher queries.
