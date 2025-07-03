# Product Requirements Document (PRD) - JP Kanji Deep Dive

## Introduction

This document outlines the product requirements for the JP Kanji Deep Dive application. It translates the vision from the Project Brief into actionable Epics and User Stories that will guide development.

---

## Epic 1: Kanji Visualization & Interaction

**Goal:** To build the complete, interactive user interface for searching, viewing, and exploring kanji, using mocked data. This epic defines the "what" and "how" of the user experience, which will drive the backend requirements.

**User Stories:**

**1.1 (Search Input):** As a learner, I want a single, clear input field on the main screen where I can type or paste Japanese text (a kanji, a word, or a sentence), a reading (kana), or select a component (radical/primitive) to begin my search.

**1.2 (Results Display):** As a learner, after initiating a search, I want to see a list of resulting kanji, with each list item clearly displaying the character and its primary English meaning, so I can quickly identify the one I'm interested in.

**1.3 (Navigate to Details):** As a learner, I want to be able to click on any kanji in the results list to navigate to its dedicated detail screen.

**1.4 (Return to Results):** As a learner, from the detail screen, I want a clear way to navigate back to the results list so I can explore other kanji from the same search without re-entering my query.

**1.5 (Detail Screen Layout):** As a learner, on the detail screen, I want to see the main kanji displayed prominently in multiple fonts (serif, sans-serif, handwritten), along with its core data (readings, meaning, example words).

**1.6 (Detail Screen Paging):** As a learner, while on a detail screen, I want to have "next" and "previous" controls so I can easily cycle through the full set of kanji from my initial search without leaving the detail view.

**1.7 (Graph Visualization):** As a learner, on the detail screen, I want to see an interactive graph that visualizes other kanji that are related to the main kanji by a default property (e.g., sharing the same primary radical).

**1.8 (Graph Interaction - Change Property):** As a learner, I want to be able to change the relationship being graphed (e.g., from "same radical" to "same on'yomi" or "same primitive element") via a simple control, like a dropdown menu.

**1.9 (Graph Interaction - Explore):** As a learner, when I click on a *different* kanji node within the graph, I want the entire detail screen to update and re-center on that new kanji, showing its details and its own set of relationships.

---

## Epic 2: Sentence & Word Deconstruction

**Goal:** Enable users to input Japanese text (words or sentences), extract all kanji, and prepare the data for the UI and graph features.

**User Stories:**

**2.1 (Text Parsing):** As a user, when I enter a word or sentence into the search box, I want the system to correctly identify and extract only the unique kanji characters from that string, ignoring kana, punctuation, and duplicates.

**2.2 (Kanji Ordering):** As a user, I want the extracted kanji to be presented in the order they appear in the input, so the context of the original sentence is preserved.

**2.3 (Kanji Mapping):** As a user, for each kanji extracted, I want to see its position in the original text, so I can relate the kanji to its usage in the sentence.

**2.4 (Non-Kanji Handling):** As a user, if my input contains no kanji, I want to receive a clear message indicating that no kanji were found.

**2.5 (Multi-Word Support):** As a user, if I enter multiple words or sentences, I want the system to handle them gracefully, extracting kanji from all input and grouping results logically.

**2.6 (Integration with UI):** As a user, after kanji are extracted, I want the results to be passed seamlessly to the results and detail screens defined in Epic 1, so my experience is smooth and uninterrupted.

---

## Epic 3: Core Search & Data Foundation

**Goal:** Build the backend systems, data models, and APIs that power all kanji search, relationship, and detail features, supporting the needs discovered in Epics 1 and 2.

**User Stories:**

**3.1 (Mock Data Support):** As a developer, I want to provide a way to serve mock data to the frontend during early UI development (e.g., static JSON files or a simple mock server), so UI work can proceed before the real backend is ready.

**3.2 (Database Technology Evaluation):** As a developer, I want to evaluate Postgres and graph databases (e.g., Neo4j) for storing and querying kanji and their relationships, so we can choose the best fit for our needs.

**3.3 (Data Model - Kanji):** As a developer, I need a robust data model for kanji that includes character, readings (on/kun), meanings, radicals, Heisig primitives, example words, and font variants, so all UI and graph features can be supported.

**3.4 (Data Model - Relationships):** As a developer, I need to model relationships between kanji (e.g., shared radical, shared reading, shared primitive) in a way that supports efficient graph queries and visualization.

**3.5 (API - Search):** As a developer, I need an API endpoint that allows searching for kanji by radical, primitive, on/kun reading, or direct character input, returning all relevant kanji and their summary data.

**3.6 (API - Kanji Details):** As a developer, I need an API endpoint that returns all details for a given kanji, including its relationships, so the detail screen and graph can be populated.

**3.7 (API - Graph Data):** As a developer, I need an API endpoint that, given a kanji and a relationship type, returns all related kanji for graph visualization.

**3.8 (Performance & Scalability):** As a developer, I want the data layer and APIs to be performant and scalable, so the app remains fast even with large datasets or many users.
