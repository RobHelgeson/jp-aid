# JP Kanji Deep Dive UI/UX Specification

## Introduction

This document defines the user experience goals, information architecture, user flows, and visual design specifications for JP Kanji Deep Dive's user interface. It serves as the foundation for visual design and frontend development, ensuring a cohesive and user-centered experience.

### Overall UX Goals & Principles

#### Target User Personas

- **Japanese Language Learners:** Students at various levels (beginner to advanced) who need a deep, contextual understanding of kanji beyond simple memorization. They are motivated to explore the connections between characters and their usage in real words.

#### Usability Goals

- **Intuitive Discovery:** Users should be able to find and explore kanji and their relationships with minimal cognitive load.
- **Efficiency:** Core tasks like searching and navigating between kanji details should be fast and require minimal steps.
- **Clarity:** Information must be presented clearly, with a strong visual hierarchy to distinguish between different types of data (e.g., readings, meanings, components).
- **Engagement:** The interface should encourage exploration and keep users engaged through interactive visualizations.

#### Design Principles

1. **Context is King:** Always present kanji within the context of words, sentences, and related characters.
2. **Visual First:** Use data visualization (especially the graph) to reveal patterns and relationships that are hard to see in text.
3. **Progressive Disclosure:** Show essential information first, with clear pathways to more detailed data. Avoid overwhelming the user.
4. **Seamless Navigation:** Moving between search, results, and detail views should feel fluid and effortless.

### Change Log

| Date       | Version | Description         | Author    |
| ---------- | ------- | ------------------- | --------- |
| {{Date}}   | 1.0     | Initial Draft       | UX Expert |

## Information Architecture (IA)

### Site Map / Screen Inventory

```mermaid
graph TD
    A[Search Screen] --> B{Search Triggered};
    B --> C[Results Screen];
    C --> D[Kanji Detail Screen: /kanji/{id}];
    D --> C;
    D --> E{Graph Node Clicked};
    E --> D;
```

### Navigation Structure

- **Primary Navigation:** The app is primarily a single-page application experience. However, key views should have distinct, stateful URLs to allow for direct access and shareability.
  - `Search Screen`: `/`
  - `Results Screen`: `/search?q={query}`
  - `Kanji Detail Screen`: `/kanji/{character}`
- **Breadcrumb Strategy:** A traditional site-wide breadcrumb is not applicable. However, a **Graph Exploration Path** is required within the Kanji Detail Screen. This will function like breadcrumbs, showing the user's traversal path through the kanji graph (e.g., `Kanji A > Radical B > Kanji C`) and allowing them to step back.

## User Flows

### Flow 1: Kanji Search and Exploration

**User Goal:** To search for a kanji and explore its details and relationships.

**Entry Points:** The main search input on the Search Screen.

**Success Criteria:** The user successfully navigates from a search query to a specific kanji's detail screen and can interact with its data and relationship graph.

#### Flow Diagram

```mermaid
graph TD
    Start[Search Screen] --> InputChoice{Input Method};
    InputChoice -- Text --> Search[Enter Text & Search];
    InputChoice -- Radical --> OpenDialog[Open Radical Dialog];
    OpenDialog --> SelectAndSearch[Select Radical & Search];
    Search --> Results[Results Screen: Show list of kanji];
    SelectAndSearch --> Results;
    Results --> ClickKanji{Select a kanji};
    ClickKanji --> Detail[Kanji Detail Screen: /kanji/{id}];
    Detail --> Back[Click 'Back to Results'];
    Back --> Results;
    Detail --> ClickNode[Click node on graph];
    ClickNode --> Detail;
    Detail --> Page[Click 'Next'/'Previous' kanji];
    Page --> Detail;
```

**Edge Cases & Error Handling:**

- **No Results:** Display a clear "No results found" message with suggestions for a new search.
- **Invalid Input:** {{Specify handling for invalid input, e.g., non-Japanese text where not applicable}}.
- **API/Data Error:** Display a non-intrusive error message and allow the user to retry.

## Wireframes & Mockups

**Primary Design Files:** {{Link to Figma, Miro, or other design tool}}

### Key Screen Layouts

#### Search Screen

- **Purpose:** To provide a simple, direct starting point for any search.
- **Layout Concept:** Inspired by the clean, minimalist interface of ChatGPT. A single, centered call-to-action. Selecting the 'Radical/Component' option will trigger a selection dialog.

    ```
    +------------------------------------------------------+
    |                                                      |
    |                                                      |
    |                                                      |
    |                JP Kanji Deep Dive                    |
    |           [__________________________________] (Search Input)
    |             (o) Text   ( ) Radical/Component         |
    |                          ^-- (triggers dialog)       |
    |                                                      |
    |                                                      |
    |                                                      |
    |                                                      |
    |                                                      |
    +------------------------------------------------------+
    ```

#### Radical/Component Selector Dialog

- **Purpose:** To allow users to visually browse and select radicals or Heisig primitives that are difficult to type.
- **Layout Concept:** A modal dialog that overlays the search screen. It contains a searchable/filterable grid of all available radicals/primitives.

    ```
    +------------------------------------------------------+
    |            [ Select a Radical or Component ]           |
    |           [___________________] (Filter by name/strokes)
    |                                                      |
    |  +---+ +---+ +---+ +---+ +---+ +---+ +---+ +---+   |
    |  |Rad| |Rad| |Rad| |Rad| |Rad| |Rad| |Rad| |Rad|   |
    |  +---+ +---+ +---+ +---+ +---+ +---+ +---+ +---+   |
    |  +---+ +---+ +---+ +---+ +---+ +---+ +---+ +---+   |
    |  |Rad| |Rad| |Rad| |Rad| |Rad| |Rad| |Rad| |Rad|   |
    |  +---+ +---+ +---+ +---+ +---+ +---+ +---+ +---+   |
    |  ...                                               |
    |                                                      |
    |                                [Select] [Cancel]     |
    +------------------------------------------------------+
    ```

#### Results Screen

- **Purpose:** To display a scannable list of kanji from the search query.
- **Layout Concept:** A responsive grid that displays kanji cards. This layout is preferred over a simple list to better utilize screen space and provide a more engaging visual presentation. We will validate this against a list view during prototyping.

    ```
    +------------------------------------------------------+
    | Search: "{query}" [Back Button]                      |
    +------------------------------------------------------+
    |                                                      |
    |  +--------+   +--------+   +--------+   +--------+  |
    |  |        |   |        |   |        |   |        |  |
    |  | Kanji  |   | Kanji  |   | Kanji  |   | Kanji  |  |
    |  | Meaning|   | Meaning|   | Meaning|   | Meaning|  |
    |  |        |   |        |   |        |   |        |  |
    |  +--------+   +--------+   +--------+   +--------+  |
    |                                                      |
    |  +--------+   +--------+   +--------+   +--------+  |
    |  |        |   |        |   |        |   |        |  |
    |  | Kanji  |   | Kanji  |   | Kanji  |   | Kanji  |  |
    |  | Meaning|   | Meaning|   | Meaning|   | Meaning|  |
    |  |        |   |        |   |        |   |        |  |
    |  +--------+   +--------+   +--------+   +--------+  |
    |                                                      |
    |                  [<]  Page 1 of 5  [>]               |
    +------------------------------------------------------+
    ```

#### Kanji Detail Screen

- **Purpose:** To provide a comprehensive, deep dive into a single kanji.
- **Layout Concept (Desktop):** A two-column layout. The left column contains the core kanji information for focused reading, while the right column is dedicated to the interactive graph for exploration.

    ```
    +------------------------------------------------------+
    | Kanji: 読 [Back to Results] [< Prev] [Next >]         |
    +------------------------------------------------------+
    |                                                      |
    | +---------------------+  +-------------------------+ |
    | | KANJI INFO          |  | GRAPH VISUALIZATION     | |
    | | ------------------- |  | ----------------------- | |
    | | Large Kanji Display |  |                         | |
    | | Readings, Meanings  |  |   (Interactive Graph)   | |
    | | Example Words       |  |                         | |
    | | Font Renderings     |  |                         | |
    | | ...                 |  |                         | |
    | |                     |  |                         | |
    | +---------------------+  +-------------------------+ |
    |                                                      |
    +------------------------------------------------------+
    ```

- **Layout Concept (Mobile):** The two columns stack vertically to maintain readability and usability on smaller screens.
- **Technical Note:** A suitable JavaScript library for rendering the interactive, navigable property graph needs to be researched. Candidates include `D3.js`, `vis.js`, `Cytoscape.js`, or modern WebGL-based options.

## Component Library / Design System

**Design System Approach:** The project will use **Material Design Components (MDC) version 3**. A theming foundation for both Light and Dark modes should be implemented *before* major component development begins to ensure consistency.

### Animations & Transitions

- **Framework:** Utilize Angular's built-in animation modules (`BrowserAnimationsModule`).
- **Style:** Animations should be "snappy" and meaningful.
- **Application:** Apply to all page transitions, tab changes, and component state changes (e.g., expansion panels, dialogs) to create a fluid user experience.

### Core Components

#### Search Input

- **Purpose:** Unified input for text, readings, and components.
- **Variants:** Default, with radical selector open.
- **States:** Default, Focused, Typing, Disabled.

#### Radical Selector Dialog

- **Purpose:** A modal dialog for users to visually browse, filter, and select a radical or Heisig primitive for their search.
- **Key Elements:** Filter input, grid of radicals, selection state, confirm/cancel buttons.
- **States:** Open, Closed.

#### Kanji List Item

- **Purpose:** Display a single kanji in the results list.
- **States:** Default, Hover, Active/Selected.

#### Graph Node

- **Purpose:** Represent a kanji or a feature (e.g., radical, reading) in the graph.
- **Variants:** Kanji Node, Feature Node (visually distinct).
- **States:** Default, Hover, Selected.

## Branding & Style Guide

- **Color Palette:**
  - **Dark Mode (Default - Fire Theme):**
    - **Primary:** Bright Orange (`#FF9800`)
    - **Background:** Dark Charcoal (`#121212`)
    - **Surface:** Dark Gray (`#1E1E1E`)
    - **Text:** Off-white (`#E0E0E0`)
    - **Accents:** Yellow (`#FFEB3B`), Red (`#F44336`)
  - **Light Mode (Purple Theme):**
    - **Primary:** Bright Purple (`#673AB7`)
    - **Background:** White (`#FFFFFF`)
    - **Surface:** Light Gray (`#F5F5F5`)
    - **Text:** Dark Gray (`#212121`)
    - **Accents:** Blue (`#2196F3`), Red (`#EF5350`)
- **Typography:** (TODO: Final fonts to be handpicked later)
  - **Default UI (Sans-Serif):** `Noto Sans JP`
  - **Default Kanji (Serif):** `Noto Serif JP`
  - **Default Kanji (Handwritten):** `Yuji Boku`
- **Iconography:** `Material Icons` will be used for all UI controls.
