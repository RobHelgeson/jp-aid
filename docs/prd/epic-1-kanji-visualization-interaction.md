# Epic 1: Kanji Visualization & Interaction

**Goal:**
Deliver the complete, interactive user interface for searching, viewing, and exploring kanji, using mocked data.

**Expanded Goal:**
This epic focuses on building the user-facing experience for kanji exploration. It covers the unified search, results list, detail view, and interactive property graph, ensuring users can intuitively navigate and discover kanji relationships. All features will be developed using mock data to enable rapid UI iteration and feedback.

---

## Story 1.1: Search Input

**As a** learner,
**I want** a single, clear input field on the main screen where I can type or paste Japanese text (a kanji, a word, or a sentence), a reading (kana), or select a component (radical/primitive) to begin my search.

**Acceptance Criteria:**

1. The main screen has a single input field.
2. The input field supports text input, paste, and component selection.
3. The input field is clear and easy to use.
4. The system correctly identifies and extracts the input type (kanji, word, sentence, kana, radical, primitive).

---

## Story 1.2: Results Display

**As a** learner,
**I want** to see a list of resulting kanji, with each list item clearly displaying the character and its primary English meaning, so I can quickly identify the one I'm interested in.

**Acceptance Criteria:**

1. The results list is displayed after a search is initiated.
2. Each item in the results list displays the kanji character and its primary English meaning.
3. The results list is sorted and filtered based on the search query.
4. The results list is paginated for easy navigation.

---

## Story 1.3: Navigate to Details

**As a** learner,
**I want** to be able to click on any kanji in the results list to navigate to its dedicated detail screen.

**Acceptance Criteria:**

1. Each kanji in the results list is clickable.
2. Clicking a kanji navigates to the corresponding kanji detail screen.
3. The detail screen displays the correct kanji information.

---

## Story 1.4: Return to Results

**As a** learner,
**I want** a clear way to navigate back to the results list so I can explore other kanji from the same search without re-entering my query.

**Acceptance Criteria:**

1. The detail screen has a clear "return to results" button.
2. Clicking the button navigates back to the results list.
3. The results list is refreshed to show the same search results.

---

## Story 1.5: Detail Screen Layout

**As a** learner,
**I want** to see the main kanji displayed prominently in multiple fonts (serif, sans-serif, handwritten), along with its core data (readings, meaning, example words).

**Acceptance Criteria:**

1. The detail screen displays the main kanji prominently.
2. The detail screen shows multiple font renderings of the kanji.
3. The detail screen displays the kanji's core data (readings, meaning, example words).

---

## Story 1.6: Detail Screen Paging

**As a** learner,
**I want** to have "next" and "previous" controls so I can easily cycle through the full set of kanji from my initial search without leaving the detail view.

**Acceptance Criteria:**

1. The detail screen has "next" and "previous" controls.
2. Clicking "next" or "previous" navigates between kanji in the detail view.
3. The detail view remains centered on the current kanji.

---

## Story 1.7: Graph Visualization (Property Graph Model)

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

## Story 1.8: Graph Interaction – Change Property & Breadcrumb Navigation

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

## Story 1.9: Graph Interaction – Explore & Node Traversal

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
