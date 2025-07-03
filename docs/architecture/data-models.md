# Data Models

This section defines the core data structures for the application. It is divided into two parts:

1. **Graph Entities**: These represent the fundamental nodes and their properties as stored in the Memgraph database. This model guides the database schema design.
2. **API Data Transfer Objects (DTOs)**: These represent the data shapes the backend API will send to the frontend. They are often composites of the graph entities, designed to provide the client with all the information needed for a specific view, minimizing the need for follow-up requests.

## Graph Entities

### Kanji Node

**Purpose:** Represents a single Japanese character. This is the central node in our graph.

**Key Attributes:**

- `id`: string (The character itself, e.g., '語')
- `meaning`: string[]
- `on_readings`: string[]
- `kun_readings`: string[]
- `stroke_count`: number

**Relationships:**

- `[:HAS_RADICAL]` -> (Radical)
- `[:HAS_PRIMITIVE]` -> (Primitive)

### Radical Node

**Purpose:** Represents an official Kanji radical.

**Key Attributes:**

- `id`: string (The character itself, e.g., '言')
- `stroke_count`: number
- `meaning`: string[]

**Relationships:**

- `[:IS_SUB_RADICAL_OF]` -> (Radical)
- `[:IS_SUPER_RADICAL_OF]` -> (Radical)

### Primitive Node

**Purpose:** Represents a visual component or sub-component of a Kanji that is not an official radical but is useful for learning.

**Key Attributes:**

- `id`: string (A unique name or character representation, e.g., 'five')
- `meaning`: string

## API Data Transfer Objects (DTOs)

These interfaces will be defined in `libs/shared-interfaces` for use by both the frontend and backend.

### KanjiWithDetails DTO

**Purpose:** Provides a complete view of a Kanji character and its immediate relationships for display in the UI. This is assembled by the backend and sent to the client.

```typescript
// Defined in libs/shared-interfaces

/**
 * A fundamental Kanji node as stored in the database.
 */
interface Kanji {
  id: string;
  meaning: string[];
  on_readings: string[];
  kun_readings: string[];
  stroke_count: number;
}

/**
 * A Radical node as stored in the database.
 */
interface Radical {
  id: string;
  stroke_count: number;
  meaning: string[];
}

/**
 * A Primitive node as stored in the database.
 */
interface Primitive {
  id: string;
  meaning: string;
}

/**
 * A rich DTO representing a Kanji and its related components,
 * assembled by the API for the frontend.
 */
interface KanjiWithDetails extends Kanji {
  radicals: Radical[];
  primitives: Primitive[];
  // We can extend this with other related data in the future,
  // e.g., similar_kanji: Kanji[]
}
```
