# Core Workflows

This section illustrates key system workflows using sequence diagrams.

## User Views Kanji Details

This workflow describes the process of an authenticated user requesting detailed information for a specific Kanji. It demonstrates the interaction between the frontend, backend, and database, including the authentication check.

```mermaid
sequenceDiagram
    participant User
    participant AngularFrontend as Angular Frontend
    participant NestJS_API as NestJS API (K8s Service)
    participant MemgraphDB as Memgraph DB (K8s Service)

    User->>AngularFrontend: Navigates to page for a Kanji (e.g., /kanji/語)
    activate AngularFrontend

    AngularFrontend->>NestJS_API: GET /api/kanji/語 (with JWT in header)
    activate NestJS_API

    NestJS_API->>NestJS_API: AuthGuard validates JWT
    NestJS_API->>MemgraphDB: Cypher query to get Kanji and relations
    activate MemgraphDB

    MemgraphDB-->>NestJS_API: Returns graph data for '語'
    deactivate MemgraphDB

    NestJS_API->>NestJS_API: Assembles KanjiWithDetails DTO
    NestJS_API-->>AngularFrontend: 200 OK with KanjiWithDetails JSON
    deactivate NestJS_API

    AngularFrontend->>AngularFrontend: Renders Kanji details from DTO
    AngularFrontend-->>User: Displays page with Kanji meaning, readings, radicals, etc.
    deactivate AngularFrontend
```
