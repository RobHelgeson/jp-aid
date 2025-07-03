# Project Brief: JP Kanji Deep Dive (v2)

## Executive Summary

**JP Kanji Deep Dive** is a web-based reference application for Japanese language learners. It addresses the need for an in-depth, exploratory tool by allowing users to look up kanji by their components (radicals, Heisig primitives) or readings, and to deconstruct Japanese text into detailed kanji views. Its key value is providing rich contextual information and a unique, graph-based visualization of kanji relationships, positioning it as a specialized dictionary and exploration tool rather than a standard flashcard app.

## Problem Statement

Japanese language learners currently rely on a fragmented ecosystem of tools. SRS apps like Anki are built for memorization, not deep understanding. Online dictionaries like Jisho.org are excellent for quick lookups but lack features for exploring kanji structure or recognizing characters in varied, real-world contexts (like handwriting). This forces learners to piece together information from multiple sources, hindering their ability to see patterns and understand the "why" behind a kanji's construction. There is no single tool focused purely on deep, contextual reference.

## Proposed Solution

We will build a "digital loupe" for kanji—a specialized, web-based reference tool. The core of the application will be a powerful search, a "sentence breakdown" feature, and an interactive relationship graph. Our key differentiators will be:

1. **Component-Based Search:** Lookup by radical, Heisig primitive, and on/kun readings.
2. **Contextual Deconstruction:** Paste in a sentence and get a detailed card for each kanji.
3. **Interactive Relationship Graph:** A view that displays a directed graph of kanji related by a shared property (like radical or reading), allowing users to explore connections visually.
4. **Rich Visuals:** Display each kanji in multiple fonts, including a handwritten style, to improve recognition.
This solution will succeed by super-serving a niche of dedicated learners who have moved beyond basic memorization and are focused on deep comprehension.

## Target Users

- **Primary:** Intermediate to advanced Japanese language learners who are actively studying kanji.
- **Secondary:** Beginners curious about kanji composition; native speakers or linguists interested in a handy reference tool.

## Goals & Success Metrics

### Project Objectives

- Launch a stable, functional MVP within 3 months.
- Secure a reliable, open-source data source for all kanji information.
- Achieve a "it just works" level of quality for the core features.

### User Success Metrics

- Users can successfully find a kanji using any of the primary lookup methods (radical, reading, text input).
- Feedback from user communities (e.g., Reddit's /r/LearnJapanese) is predominantly positive.
- Average session duration is long enough to indicate deep exploration, not just a quick lookup.

### Key Performance Indicators (KPIs)

- Weekly Active Users (WAU)
- Number of searches per session
- Percentage of users utilizing the sentence breakdown feature

## MVP Scope

### Screen Flow

The user journey will involve three primary screens:

1. **Search Screen:** A unified interface for all lookups (radical, primitive, reading, text).
2. **Results Screen:** A list view of kanji returned from the search, showing just enough detail for identification.
3. **Detail Screen:** A comprehensive view of a single kanji, featuring its data, the relationship graph, and the ability to page through the other results from the initial search.

### Core Features (Must Have)

- **Unified Search:** Search for kanji by radical, Heisig primitive element, or on/kun reading. It will also accept direct input of a word or sentence.
- **Kanji Relationship Graph:** An interactive, directed graph view showing how the selected kanji relates to others based on a chosen property (e.g., same radical, same reading).
- **Kanji Detail View:** A view that shows the selected kanji, its readings, core meanings, example words, and displays the character in serif, sans-serif, and handwritten fonts.

### Out of Scope for MVP

- User accounts and saved history.
- SRS / flashcard functionality.
- OCR from image upload or camera.
- Direct integration with audio services (we will link out instead).
- Example sentences (example words are sufficient for MVP).

## Post-MVP Vision

- **Phase 2:** Introduce user accounts, example sentences, and OCR capabilities.
- **Long-term:** Explore a browser extension for on-page analysis and potential native mobile apps.

## Technical Considerations

### Platform Requirements

- **Target Platforms:** Web (desktop and mobile-responsive).
- **Browser Support:** Latest versions of Chrome, Firefox, Safari.

### Technology Preferences

- **Repository Structure:** Monorepo managed with **Nx**. All frontend and backend components should be generated and managed via Nx tooling.
- **Frontend:** **Angular**
- **Backend:** **Nest.js**
- **Database:** Technologies to evaluate: **Postgres** and **Graph Databases** (e.g., Neo4j) to natively support the relationship graph feature. SQLite is not a preferred option.

## Constraints & Assumptions

### Constraints

- **Timeline:** Target 3 months for MVP.
- **Budget:** This is a personal project, so no budget for paid services/APIs.
- **Resources:** Development will be handled by a single person.

### Key Assumptions

- A free, reliable, and sufficiently comprehensive kanji database exists and is accessible.
- An open-source, commercially-free handwritten Japanese font can be found.
- Users are motivated enough to use a dedicated tool and don't require gamification or SRS features to stay engaged.

## Risks & Open Questions

### Key Risks

- **Data Sourcing (High):** The entire project depends on finding a high-quality, free kanji database. Licensing and accuracy are major concerns.
- **Handwritten Font (Medium):** Finding a font that accurately represents natural handwriting and has a permissive license may be difficult.
- **UI Complexity (Medium):** The sentence breakdown UI must be intuitive and not overwhelm the user.

### Open Questions

- What is the best data source that balances comprehensiveness, accuracy, and licensing for both relational and graph representations?
- What is the most intuitive UI for selecting radicals/primitives during a search?
- What is the best performing and most intuitive way to render and interact with the kanji graph?

## Next Steps

1. Finalize and approve this Project Brief.
2. Proceed to the `pm` agent to create the Product Requirements Document (PRD).
3. Begin technical research into Kanji databases (relational and graph) and fonts.
