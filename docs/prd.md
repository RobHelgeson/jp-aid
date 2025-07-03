# Product Requirements Document (PRD) - JP Kanji Deep Dive

## Goals and Background Context

### Goals

- Launch a stable, functional MVP within 3 months.
- Secure a reliable, open-source data source for all kanji information.
- Achieve a "just works" level of quality for the core features.
- Users can find kanji using radical, reading, or text input.
- Users can explore kanji relationships visually and contextually.
- High engagement: long session duration, frequent use of sentence breakdown.

### Background Context

JP Kanji Deep Dive is a web-based reference app for Japanese learners, focused on deep, contextual kanji exploration. Existing tools are fragmented—SRS apps focus on memorization, and dictionaries lack structure/relationship exploration. This project aims to fill that gap with a graph-based, visually rich, and context-driven kanji reference tool.

### Change Log

| Date       | Version | Description                | Author |
|------------|---------|----------------------------|--------|
| 2024-06-07 | 1.0     | Initial PRD draft          | Rob    |

## Requirements

### Functional

- FR1: The system must allow searching for kanji by radical, Heisig primitive, or on/kun reading.
- FR2: The system must allow input of Japanese text and extract all unique kanji.
- FR3: The system must display kanji results in a list with summary info.
- FR4: The system must provide a kanji detail view with readings, meanings, example words, and multiple font renderings.
- FR5: The system must visualize kanji relationships as an interactive graph.
- FR6: The system must allow navigation between search, results, and detail screens.
- FR7: The system must support paging through kanji results and graph navigation.

### Non Functional

- NFR1: The app must be web-based and mobile-responsive.
- NFR2: The app must support latest Chrome, Firefox, and Safari.
- NFR3: The app must be performant and intuitive, even with large datasets.
- NFR4: The app must use only open-source or freely licensed data and fonts.
- NFR5: The app must be maintainable by a single developer.

## User Interface Design Goals

### Overall UX Vision

Modern, clean, and intuitive interface for deep kanji exploration. Prioritizes discoverability and visual relationships between kanji.

### Key Interaction Paradigms

- Unified search input
- Results list with summary info
- Detail view with paging and graph navigation

### Core Screens and Views

- Search Screen
- Results Screen
- Kanji Detail Screen (with graph)

### Accessibility

None at this time.

### Branding

None at this time. (To be refined with UX agent later.)

### Target Device and Platforms

Web (desktop and mobile-responsive only)

## Technical Assumptions

### Repository Structure

Monorepo managed with Nx.

### Service Architecture

Monolith: Angular frontend, Nest.js backend, both managed via Nx.

### Testing Requirements

- Use best practices for testing.
- Unit tests required.
- Integration and end-to-end tests to be added as the project matures.

### Additional Technical Assumptions and Requests

- Database: Evaluate Postgres and graph DBs (e.g., Neo4j). SQLite not preferred.
- All frontend/backend components generated via Nx.

## Epics

## Epic 1: Kanji Visualization & Interaction

**Goal:**
Deliver the complete, interactive user interface for searching, viewing, and exploring kanji, using mocked data.

**Expanded Goal:**
This epic focuses on building the user-facing experience for kanji exploration. It covers the unified search, results list, detail view, and interactive property graph, ensuring users can intuitively navigate and discover kanji relationships. All features will be developed using mock data to enable rapid UI iteration and feedback.

---

### Story 1.1: Search Input

**As a** learner,
**I want** a single, clear input field on the main screen where I can type or paste Japanese text (a kanji, a word, or a sentence), a reading (kana), or select a component (radical/primitive) to begin my search.

**Acceptance Criteria:**

1. The main screen has a single input field.
2. The input field supports text input, paste, and component selection.
3. The input field is clear and easy to use.
4. The system correctly identifies and extracts the input type (kanji, word, sentence, kana, radical, primitive).

---

### Story 1.2: Results Display

**As a** learner,
**I want** to see a list of resulting kanji, with each list item clearly displaying the character and its primary English meaning, so I can quickly identify the one I'm interested in.

**Acceptance Criteria:**

1. The results list is displayed after a search is initiated.
2. Each item in the results list displays the kanji character and its primary English meaning.
3. The results list is sorted and filtered based on the search query.
4. The results list is paginated for easy navigation.

---

### Story 1.3: Navigate to Details

**As a** learner,
**I want** to be able to click on any kanji in the results list to navigate to its dedicated detail screen.

**Acceptance Criteria:**

1. Each kanji in the results list is clickable.
2. Clicking a kanji navigates to the corresponding kanji detail screen.
3. The detail screen displays the correct kanji information.

---

### Story 1.4: Return to Results

**As a** learner,
**I want** a clear way to navigate back to the results list so I can explore other kanji from the same search without re-entering my query.

**Acceptance Criteria:**

1. The detail screen has a clear "return to results" button.
2. Clicking the button navigates back to the results list.
3. The results list is refreshed to show the same search results.

---

### Story 1.5: Detail Screen Layout

**As a** learner,
**I want** to see the main kanji displayed prominently in multiple fonts (serif, sans-serif, handwritten), along with its core data (readings, meaning, example words).

**Acceptance Criteria:**

1. The detail screen displays the main kanji prominently.
2. The detail screen shows multiple font renderings of the kanji.
3. The detail screen displays the kanji's core data (readings, meaning, example words).

---

### Story 1.6: Detail Screen Paging

**As a** learner,
**I want** to have "next" and "previous" controls so I can easily cycle through the full set of kanji from my initial search without leaving the detail view.

**Acceptance Criteria:**

1. The detail screen has "next" and "previous" controls.
2. Clicking "next" or "previous" navigates between kanji in the detail view.
3. The detail view remains centered on the current kanji.

---

### Story 1.7: Graph Visualization (Property Graph Model)

**As a** learner,
**I want** to see an interactive property graph on the detail screen that visualizes kanji and their features (e.g., on'yomi, radical) as distinct node types,
**so that** I can discover and explore kanji relationships by traversing through both kanji and feature nodes.

**Acceptance Criteria:**

1. The detail screen displays a property graph with at least two node types: kanji and feature (e.g., on'yomi, radical).
2. Kanji nodes are visually distinct from feature nodes (e.g., size, color, icon).
3. Edges are labeled or color-coded to indicate the relationship type (e.g., "has on'yomi", "has radical").
4. The graph initially centers on the selected kanji and shows its immediate feature nodes and connected kanji.
5. The number of nodes/edges displayed at once is limited for clarity, with an option to expand if needed.
6. The graph is interactive: nodes are clickable, and the view supports zoom/pan.

---

### Story 1.8: Graph Interaction – Change Property & Breadcrumb Navigation

**As a** learner,
**I want** to change the relationship type being explored (e.g., from on'yomi to radical) and see a breadcrumb/history trail of my navigation,
**so that** I can explore different kanji relationships and easily backtrack through my exploration path.

**Acceptance Criteria:**

1. The graph includes a control (e.g., dropdown) to select the relationship/property type.
2. Changing the property type re-centers the graph on the current node and updates visible nodes/edges accordingly.
3. A breadcrumb/history trail is always visible, showing the sequence of nodes and properties traversed (e.g., 家 → on'yomi: カ → 林 → radical: 木 → 本).
4. Clicking a breadcrumb step returns the graph to that previous state.
5. The UI clearly distinguishes between kanji and feature nodes in the breadcrumb.
6. There is always a "reset to origin" button to return to the original kanji/search.

---

### Story 1.9: Graph Interaction – Explore & Node Traversal

**As a** learner,
**I want** to click on any node (kanji or feature) in the graph to traverse to related nodes, updating the detail screen and graph context,
**so that** I can follow any path of interest and explore the kanji network deeply.

**Acceptance Criteria:**

1. Clicking a kanji node recenters the graph and detail screen on that kanji, showing its features and related kanji.
2. Clicking a feature node recenters the graph on that feature, showing all kanji sharing that feature.
3. Each traversal step is added to the breadcrumb/history trail.
4. The graph and detail data update accordingly with each traversal.
5. Navigation history is preserved for back/forward actions.
6. The UI prevents user overwhelm by limiting visible nodes and providing "expand" controls as needed.

## Epic 2: Sentence & Word Deconstruction

**Goal:**
Enable users to input Japanese text (words or sentences), extract all kanji, and prepare the data for the UI and graph features.

**Expanded Goal:**
This epic covers the logic and user experience for parsing Japanese input, extracting kanji, mapping them to their positions in the original text, and ensuring seamless integration with the UI. It ensures that users can break down any input into its kanji components for further exploration.

---

### Story 2.1: Text Parsing

**As a** user,
**I want** the system to correctly identify and extract only the unique kanji characters from my input,
**so that** I can focus on the kanji present in any word or sentence.

**Acceptance Criteria:**

1. The system accepts any Japanese text input (word, sentence, phrase).
2. Only kanji characters are extracted; kana, punctuation, and duplicates are ignored.
3. Extraction is accurate for mixed-content input (kanji, kana, Latin, symbols).
4. The extracted kanji are passed to the next processing step.

---

### Story 2.2: Kanji Ordering

**As a** user,
**I want** the extracted kanji to be presented in the order they appear in the input,
**so that** the context of the original sentence is preserved.

**Acceptance Criteria:**

1. The output list of kanji matches the order of appearance in the input.
2. If a kanji appears multiple times, only the first occurrence is kept.
3. The order is preserved when passing data to the results/detail screens.

---

### Story 2.3: Kanji Mapping

**As a** user,
**I want** to see each kanji's position in the original text,
**so that** I can relate the kanji to its usage in the sentence.

**Acceptance Criteria:**

1. Each extracted kanji is mapped to its index/position in the input.
2. The mapping is available to the UI for highlighting or reference.
3. The mapping supports multi-kanji and multi-sentence input.

---

### Story 2.4: Non-Kanji Handling

**As a** user,
**I want** a clear message if my input contains no kanji, or if the kanji found are not in the database,
**so that** I know why no results are shown and what to do next.

**Acceptance Criteria:**

1. If no kanji are found in the input, a user-friendly message is displayed (e.g., "No kanji found in your input. Please try again.").
2. If kanji are found in the input but none are present in the database, a different message is displayed (e.g., "No information available for the kanji you entered. Please try different text or check back later.").
3. If some kanji are found and some are missing from the database, the UI displays available results and clearly indicates which kanji could not be found.
4. All error and info messages are clear, actionable, and do not block further input.

---

### Story 2.5: Multi-Word Support

**As a** user,
**I want** the system to handle multiple words or sentences gracefully,
**so that** I can extract kanji from all input and see results grouped logically.

**Acceptance Criteria:**

1. The system extracts kanji from all words/sentences in the input.
2. Results are grouped or annotated by word/sentence if possible.
3. The UI supports displaying grouped results.

---

### Story 2.6: Integration with UI

**As a** user,
**I want** the extracted kanji to be passed seamlessly to the results and detail screens,
**so that** my experience is smooth and uninterrupted.

**Acceptance Criteria:**

1. Extracted kanji are passed to the results screen without loss or reordering.
2. The transition from input to results/detail is smooth and fast.
3. The UI updates correctly for all valid and invalid input cases.

## Epic 3: Core Search & Data Foundation

**Goal:**
Build the backend systems, data models, and APIs that power all kanji search, relationship, and detail features, supporting the needs discovered in Epics 1 and 2.

**Expanded Goal:**
This epic establishes the technical foundation for the application. It covers mock data support for UI development, database technology evaluation, robust data modeling for kanji and their relationships, and the creation of performant, scalable APIs. The goal is to ensure the backend can fully support the property graph model, UI requirements, and future extensibility.

---

### Story 3.1: Mock Data Support

**As a** developer,
**I want** to provide a way to serve mock data to the frontend during early UI development (e.g., static JSON files or a simple mock server),
**so that** UI work can proceed before the real backend is ready.

**Acceptance Criteria:**

1. Mock data is available for all UI components and flows defined in Epics 1 and 2.
2. The mock data structure matches the expected API responses.
3. The frontend can switch between mock and real data sources with minimal changes.
4. Mock data is easy to extend as UI requirements evolve.

---

### Story 3.2: Database Technology Evaluation

**As a** developer,
**I want** to evaluate Postgres and graph databases (e.g., Neo4j) for storing and querying kanji and their relationships,
**so that** we can choose the best fit for our needs.

**Acceptance Criteria:**

1. A documented comparison of Postgres and at least one graph database (e.g., Neo4j) is produced.
2. The evaluation considers data modeling, query performance, scalability, and ease of integration with Nx/Nest.js.
3. A clear recommendation is made, with rationale, for which technology to use for MVP and beyond.

---

### Story 3.3: Data Model – Kanji

**As a** developer,
**I want** a robust data model for kanji that includes character, readings (on/kun), meanings, radicals, Heisig primitives, example words, and font variants,
**so that** all UI and graph features can be supported.

**Acceptance Criteria:**

1. The data model includes all required kanji properties.
2. The model supports efficient querying for all search and graph use cases.
3. The model is documented and reviewed for completeness and extensibility.

---

### Story 3.4: Data Model – Relationships

**As a** developer,
**I want** to model relationships between kanji (e.g., shared radical, shared reading, shared primitive) in a way that supports efficient graph queries and visualization,
**so that** the property graph model can be fully realized.

**Acceptance Criteria:**

1. The data model supports multiple node types (kanji, feature) and labeled edges.
2. Relationships are stored in a way that enables fast traversal and filtering.
3. The model supports adding new relationship types in the future.

---

### Story 3.5: API – Search

**As a** developer,
**I want** an API endpoint that allows searching for kanji by radical, primitive, on/kun reading, or direct character input,
**so that** the frontend can retrieve all relevant kanji and their summary data.

**Acceptance Criteria:**

1. The API supports all search types required by the UI.
2. Responses are paginated and include summary info for each kanji.
3. The API is documented and tested.

---

### Story 3.6: API – Kanji Details

**As a** developer,
**I want** an API endpoint that returns all details for a given kanji, including its relationships,
**so that** the detail screen and graph can be populated.

**Acceptance Criteria:**

1. The API returns all required kanji details and related features.
2. The response structure matches the needs of the detail and graph UI.
3. The API is performant and tested with real and mock data.

---

### Story 3.7: API – Graph Data

**As a** developer,
**I want** an API endpoint that, given a kanji and a relationship type, returns all related kanji and features for graph visualization,
**so that** the property graph UI can be fully powered.

**Acceptance Criteria:**

1. The API returns nodes and edges for the property graph, supporting multiple node types.
2. The API supports limiting the number of nodes/edges for performance.
3. The API is documented and tested for all supported relationship types.

---

### Story 3.8: Performance & Scalability

**As a** developer,
**I want** the data layer and APIs to be performant and scalable,
**so that** the app remains fast even with large datasets or many users.

**Acceptance Criteria:**

1. The backend is tested with large kanji datasets and high query volumes.
2. Performance bottlenecks are identified and addressed.
3. The system is monitored for scalability and reliability.

## Checklist Results Report

(To be completed after running the PM checklist.)

## Next Steps

- Proceed to sharding, story assignment, or implementation planning as per workflow.
