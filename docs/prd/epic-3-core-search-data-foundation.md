# Epic 3: Core Search & Data Foundation

**Goal:**
Build the backend systems, data models, and APIs that power all kanji search, relationship, and detail features, supporting the needs discovered in Epics 1 and 2.

**Expanded Goal:**
This epic establishes the technical foundation for the application. It covers mock data support for UI development, database technology evaluation, robust data modeling for kanji and their relationships, and the creation of performant, scalable APIs. The goal is to ensure the backend can fully support the property graph model, UI requirements, and future extensibility.

---

## Story 3.1: Mock Data Support

**As a** developer,
**I want** to provide a way to serve mock data to the frontend during early UI development (e.g., static JSON files or a simple mock server),
**so that** UI work can proceed before the real backend is ready.

**Acceptance Criteria:**

1. Mock data is available for all UI components and flows defined in Epics 1 and 2.
2. The mock data structure matches the expected API responses.
3. The frontend can switch between mock and real data sources with minimal changes.
4. Mock data is easy to extend as UI requirements evolve.

---

## Story 3.2: Database Technology Evaluation

**As a** developer,
**I want** to evaluate Postgres and graph databases (e.g., Neo4j) for storing and querying kanji and their relationships,
**so that** we can choose the best fit for our needs.

**Acceptance Criteria:**

1. A documented comparison of Postgres and at least one graph database (e.g., Neo4j) is produced.
2. The evaluation considers data modeling, query performance, scalability, and ease of integration with Nx/Nest.js.
3. A clear recommendation is made, with rationale, for which technology to use for MVP and beyond.

---

## Story 3.3: Data Model – Kanji

**As a** developer,
**I want** a robust data model for kanji that includes character, readings (on/kun), meanings, radicals, Heisig primitives, example words, and font variants,
**so that** all UI and graph features can be supported.

**Acceptance Criteria:**

1. The data model includes all required kanji properties.
2. The model supports efficient querying for all search and graph use cases.
3. The model is documented and reviewed for completeness and extensibility.

---

## Story 3.4: Data Model – Relationships

**As a** developer,
**I want** to model relationships between kanji (e.g., shared radical, shared reading, shared primitive) in a way that supports efficient graph queries and visualization,
**so that** the property graph model can be fully realized.

**Acceptance Criteria:**

1. The data model supports multiple node types (kanji, feature) and labeled edges.
2. Relationships are stored in a way that enables fast traversal and filtering.
3. The model supports adding new relationship types in the future.

---

## Story 3.5: API – Search

**As a** developer,
**I want** an API endpoint that allows searching for kanji by radical, primitive, on/kun reading, or direct character input,
**so that** the frontend can retrieve all relevant kanji and their summary data.

**Acceptance Criteria:**

1. The API supports all search types required by the UI.
2. Responses are paginated and include summary info for each kanji.
3. The API is documented and tested.

---

## Story 3.6: API – Kanji Details

**As a** developer,
**I want** an API endpoint that returns all details for a given kanji, including its relationships,
**so that** the detail screen and graph can be populated.

**Acceptance Criteria:**

1. The API returns all required kanji details and related features.
2. The response structure matches the needs of the detail and graph UI.
3. The API is performant and tested with real and mock data.

---

## Story 3.7: API – Graph Data

**As a** developer,
**I want** an API endpoint that, given a kanji and a relationship type, returns all related kanji and features for graph visualization,
**so that** the property graph UI can be fully powered.

**Acceptance Criteria:**

1. The API returns nodes and edges for the property graph, supporting multiple node types.
2. The API supports limiting the number of nodes/edges for performance.
3. The API is documented and tested for all supported relationship types.

---

## Story 3.8: Performance & Scalability

**As a** developer,
**I want** the data layer and APIs to be performant and scalable,
**so that** the app remains fast even with large datasets or many users.

**Acceptance Criteria:**

1. The backend is tested with large kanji datasets and high query volumes.
2. Performance bottlenecks are identified and addressed.
3. The system is monitored for scalability and reliability.
