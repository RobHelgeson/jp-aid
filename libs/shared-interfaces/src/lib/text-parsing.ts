/**
 * Result of parsing text for kanji characters
 */
export interface TextParsingResult {
  /** The original input text before parsing */
  originalText: string;
  /** Array of unique kanji characters extracted from the text */
  extractedKanji: string[];
  /** Count of unique kanji characters found */
  kanjiCount: number;
  /** Whether any kanji characters were found */
  hasKanji: boolean;
}

/**
 * Options for kanji extraction behavior
 */
export interface KanjiExtractionOptions {
  /** Maintain order of first appearance (default: true) */
  preserveOrder?: boolean;
  /** Return only unique kanji (default: true) */
  removeDuplicates?: boolean;
  /** Include rare kanji from Extension A range (default: true) */
  includeRareKanji?: boolean;
}

/**
 * Position information for a kanji character in the original text
 */
export interface KanjiPosition {
  /** The kanji character */
  kanji: string;
  /** Zero-based index positions where this kanji appears in the original text */
  positions: number[];
  /** Index of first occurrence (for ordering) */
  firstPosition: number;
}

/**
 * Extended parsing result with position mapping
 */
export interface TextParsingResultWithPositions extends TextParsingResult {
  /** Array of kanji with their positions in the original text, ordered by first occurrence */
  kanjiPositions: KanjiPosition[];
}

/**
 * Detailed result status for kanji search operations
 */
export enum KanjiSearchStatus {
  /** Kanji found and all are in database */
  FOUND = 'found',
  /** No kanji characters in input text */
  NO_KANJI_IN_INPUT = 'no_kanji_in_input',
  /** Kanji found but none are in database */
  KANJI_NOT_IN_DATABASE = 'kanji_not_in_database',
  /** Some kanji found, some missing from database */
  PARTIAL_MATCH = 'partial_match'
}

/**
 * Extended search result with status and missing kanji information
 */
export interface KanjiSearchResult {
  /** Status of the search operation */
  status: KanjiSearchStatus;
  /** Kanji characters extracted from input */
  extractedKanji: string[];
  /** Kanji characters found in database */
  foundKanji: string[];
  /** Kanji characters not found in database */
  missingKanji: string[];
  /** Original search text */
  originalText: string;
}

/**
 * Represents a segment of text (word, phrase, or sentence) with its kanji
 */
export interface TextSegment {
  /** The original text of this segment */
  text: string;
  /** Zero-based start position of this segment in the original input */
  startPosition: number;
  /** Zero-based end position (exclusive) of this segment */
  endPosition: number;
  /** Unique kanji characters found in this segment (ordered by first appearance) */
  kanji: string[];
  /** Position data for each kanji in this segment */
  kanjiPositions: KanjiPosition[];
  /** Index of this segment (0-based) */
  segmentIndex: number;
}

/**
 * Result of parsing text with segment grouping
 */
export interface SegmentedParsingResult extends TextParsingResultWithPositions {
  /** Whether the input was segmented (has multiple segments) */
  isSegmented: boolean;
  /** Array of text segments, each containing its kanji */
  segments: TextSegment[];
  /** Total number of segments */
  segmentCount: number;
}

/**
 * Options for text segmentation behavior
 */
export interface SegmentationOptions extends KanjiExtractionOptions {
  /** Enable sentence-level segmentation on 。！？\n (default: true) */
  segmentBySentence?: boolean;
  /** Enable phrase-level segmentation on 、・ and spaces (default: false) */
  segmentByPhrase?: boolean;
  /** Minimum segment length to include (default: 1) */
  minSegmentLength?: number;
  /** Include empty segments in output (default: false) */
  includeEmptySegments?: boolean;
}
