# Epic 2: Sentence & Word Deconstruction

**Goal:**
Enable users to input Japanese text (words or sentences), extract all kanji, and prepare the data for the UI and graph features.

**Expanded Goal:**
This epic covers the logic and user experience for parsing Japanese input, extracting kanji, mapping them to their positions in the original text, and ensuring seamless integration with the UI. It ensures that users can break down any input into its kanji components for further exploration.

---

## Story 2.1: Text Parsing

**As a** user,
**I want** the system to correctly identify and extract only the unique kanji characters from my input,
**so that** I can focus on the kanji present in any word or sentence.

**Acceptance Criteria:**

1. The system accepts any Japanese text input (word, sentence, phrase).
2. Only kanji characters are extracted; kana, punctuation, and duplicates are ignored.
3. Extraction is accurate for mixed-content input (kanji, kana, Latin, symbols).
4. The extracted kanji are passed to the next processing step.

---

## Story 2.2: Kanji Ordering

**As a** user,
**I want** the extracted kanji to be presented in the order they appear in the input,
**so that** the context of the original sentence is preserved.

**Acceptance Criteria:**

1. The output list of kanji matches the order of appearance in the input.
2. If a kanji appears multiple times, only the first occurrence is kept.
3. The order is preserved when passing data to the results/detail screens.

---

## Story 2.3: Kanji Mapping

**As a** user,
**I want** to see each kanji's position in the original text,
**so that** I can relate the kanji to its usage in the sentence.

**Acceptance Criteria:**

1. Each extracted kanji is mapped to its index/position in the input.
2. The mapping is available to the UI for highlighting or reference.
3. The mapping supports multi-kanji and multi-sentence input.

---

## Story 2.4: Non-Kanji Handling

**As a** user,
**I want** a clear message if my input contains no kanji, or if the kanji found are not in the database,
**so that** I know why no results are shown and what to do next.

**Acceptance Criteria:**

1. If no kanji are found in the input, a user-friendly message is displayed (e.g., "No kanji found in your input. Please try again.").
2. If kanji are found in the input but none are present in the database, a different message is displayed (e.g., "No information available for the kanji you entered. Please try different text or check back later.").
3. If some kanji are found and some are missing from the database, the UI displays available results and clearly indicates which kanji could not be found.
4. All error and info messages are clear, actionable, and do not block further input.

---

## Story 2.5: Multi-Word Support

**As a** user,
**I want** the system to handle multiple words or sentences gracefully,
**so that** I can extract kanji from all input and see results grouped logically.

**Acceptance Criteria:**

1. The system extracts kanji from all words/sentences in the input.
2. Results are grouped or annotated by word/sentence if possible.
3. The UI supports displaying grouped results.

---

## Story 2.6: Integration with UI

**As a** user,
**I want** the extracted kanji to be passed seamlessly to the results and detail screens,
**so that** my experience is smooth and uninterrupted.

**Acceptance Criteria:**

1. Extracted kanji are passed to the results screen without loss or reordering.
2. The transition from input to results/detail is smooth and fast.
3. The UI updates correctly for all valid and invalid input cases.
