import {Injectable} from '@angular/core';
import {
  KanjiExtractionOptions,
  KanjiPosition,
  SegmentationOptions,
  SegmentedParsingResult,
  TextParsingResult,
  TextParsingResultWithPositions,
  TextSegment
} from '@jp-aid/shared-interfaces';

/**
 * Service for parsing Japanese text and extracting kanji characters.
 * Uses Unicode ranges to identify kanji characters:
 * - CJK Unified Ideographs: U+4E00-U+9FFF (common kanji)
 * - CJK Unified Ideographs Extension A: U+3400-U+4DBF (rare kanji)
 * - CJK Compatibility Ideographs: U+F900-U+FAFF (variant forms)
 */
@Injectable({
  providedIn: 'root'
})
export class TextParsingService {
  private readonly COMMON_KANJI_RANGE = '\u4E00-\u9FFF';
  private readonly RARE_KANJI_RANGE = '\u3400-\u4DBF';
  private readonly COMPATIBILITY_KANJI_RANGE = '\uF900-\uFAFF';

  /**
   * Extracts unique kanji characters from the given text
   * @param text The text to extract kanji from
   * @param options Optional extraction options
   * @returns Array of unique kanji characters in order of first appearance
   */
  extractKanji(text: string, options: KanjiExtractionOptions = {}): string[] {
    const {preserveOrder = true, removeDuplicates = true, includeRareKanji = true} = options;

    if (!text) {
      return [];
    }

    const pattern = this.buildKanjiPattern(includeRareKanji);
    const matches = text.match(pattern);

    if (!matches) {
      return [];
    }

    if (!removeDuplicates) {
      return matches;
    }

    if (preserveOrder) {
      const seen = new Set<string>();
      return matches.filter(char => {
        if (seen.has(char)) {
          return false;
        }
        seen.add(char);
        return true;
      });
    }

    return [...new Set(matches)];
  }

  /**
   * Checks if a single character is a kanji character
   * @param char The character to check
   * @param includeRareKanji Whether to include rare kanji in the check
   * @returns True if the character is a kanji
   */
  isKanji(char: string, includeRareKanji: boolean = true): boolean {
    if (!char || char.length !== 1) {
      return false;
    }

    const pattern = this.buildKanjiPattern(includeRareKanji);
    return pattern.test(char);
  }

  /**
   * Checks if the given text contains any kanji characters
   * @param text The text to check
   * @param includeRareKanji Whether to include rare kanji in the check
   * @returns True if the text contains at least one kanji character
   */
  containsKanji(text: string, includeRareKanji: boolean = true): boolean {
    if (!text) {
      return false;
    }

    const pattern = this.buildKanjiPattern(includeRareKanji);
    return pattern.test(text);
  }

  /**
   * Parses text and returns a complete parsing result
   * @param text The text to parse
   * @param options Optional extraction options
   * @returns TextParsingResult with extracted kanji and metadata
   */
  parseText(text: string, options: KanjiExtractionOptions = {}): TextParsingResult {
    const extractedKanji = this.extractKanji(text, options);

    return {
      originalText: text,
      extractedKanji,
      kanjiCount: extractedKanji.length,
      hasKanji: extractedKanji.length > 0
    };
  }

  /**
   * Extracts kanji with position mapping from the given text.
   * Tracks ALL occurrences of each kanji character in the original text.
   * @param text The text to parse
   * @param options Optional extraction options
   * @returns TextParsingResultWithPositions with kanji and their positions
   */
  extractKanjiWithPositions(
    text: string,
    options: KanjiExtractionOptions = {}
  ): TextParsingResultWithPositions {
    const {includeRareKanji = true} = options;
    const baseResult = this.parseText(text, options);

    if (!text) {
      return {
        ...baseResult,
        kanjiPositions: []
      };
    }

    const positionMap = new Map<string, number[]>();
    const firstOccurrence = new Map<string, number>();
    const pattern = this.buildKanjiPattern(includeRareKanji);

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      pattern.lastIndex = 0;

      if (pattern.test(char)) {
        const existingPositions = positionMap.get(char);
        if (existingPositions) {
          existingPositions.push(i);
        } else {
          positionMap.set(char, [i]);
          firstOccurrence.set(char, i);
        }
      }
    }

    const kanjiPositions: KanjiPosition[] = baseResult.extractedKanji.map(kanji => ({
      kanji,
      positions: positionMap.get(kanji) || [],
      firstPosition: firstOccurrence.get(kanji) ?? -1
    }));

    return {
      ...baseResult,
      kanjiPositions
    };
  }

  /**
   * Parses text and groups kanji by segment (sentence or phrase).
   * @param text The text to parse
   * @param options Segmentation options
   * @returns SegmentedParsingResult with kanji grouped by segment
   */
  parseTextWithSegments(text: string, options: SegmentationOptions = {}): SegmentedParsingResult {
    const {segmentBySentence = true, segmentByPhrase = false, includeEmptySegments = false} = options;
    const baseResult = this.extractKanjiWithPositions(text, options);

    if (!text) {
      return {
        ...baseResult,
        isSegmented: false,
        segments: [],
        segmentCount: 0
      };
    }

    const rawSegments = this.segmentText(text, {segmentBySentence, segmentByPhrase});

    if (rawSegments.length === 0) {
      return {
        ...baseResult,
        isSegmented: false,
        segments: [],
        segmentCount: 0
      };
    }

    if (rawSegments.length === 1) {
      const rawSegment = rawSegments[0];
      const segmentKanji = this.extractKanji(rawSegment.text, options);
      const hasKanjiInSegment = segmentKanji.length > 0;

      if (!hasKanjiInSegment && !includeEmptySegments) {
        return {
          ...baseResult,
          isSegmented: false,
          segments: [],
          segmentCount: 0
        };
      }

      const kanjiPositions: KanjiPosition[] = segmentKanji.map(kanji => {
        const positionsInSegment: number[] = [];
        let firstPos = -1;

        for (let i = 0; i < rawSegment.text.length; i++) {
          if (rawSegment.text[i] === kanji) {
            const absolutePos = rawSegment.start + i;
            positionsInSegment.push(absolutePos);
            if (firstPos === -1) {
              firstPos = absolutePos;
            }
          }
        }

        return {
          kanji,
          positions: positionsInSegment,
          firstPosition: firstPos
        };
      });

      const singleSegment: TextSegment = {
        text: rawSegment.text,
        startPosition: rawSegment.start,
        endPosition: rawSegment.end,
        kanji: segmentKanji,
        kanjiPositions,
        segmentIndex: 0
      };

      return {
        ...baseResult,
        isSegmented: false,
        segments: [singleSegment],
        segmentCount: 1
      };
    }

    const segments: TextSegment[] = [];
    let segmentIndex = 0;

    for (const rawSegment of rawSegments) {
      const segmentText = rawSegment.text;
      const segmentKanji = this.extractKanji(segmentText, options);
      const hasKanjiInSegment = segmentKanji.length > 0;

      if (hasKanjiInSegment || includeEmptySegments) {
        const kanjiPositions: KanjiPosition[] = segmentKanji.map(kanji => {
          const positionsInSegment: number[] = [];
          let firstPos = -1;

          for (let i = 0; i < segmentText.length; i++) {
            if (segmentText[i] === kanji) {
              const absolutePos = rawSegment.start + i;
              positionsInSegment.push(absolutePos);
              if (firstPos === -1) {
                firstPos = absolutePos;
              }
            }
          }

          return {
            kanji,
            positions: positionsInSegment,
            firstPosition: firstPos
          };
        });

        segments.push({
          text: segmentText,
          startPosition: rawSegment.start,
          endPosition: rawSegment.end,
          kanji: segmentKanji,
          kanjiPositions,
          segmentIndex
        });

        segmentIndex++;
      }
    }

    return {
      ...baseResult,
      isSegmented: segments.length > 1,
      segments,
      segmentCount: segments.length
    };
  }

  /**
   * Splits text into segments based on Japanese punctuation.
   * @param text The text to split
   * @param options Segmentation options
   * @returns Array of raw text segments with positions
   */
  private segmentText(
    text: string,
    options: {segmentBySentence?: boolean; segmentByPhrase?: boolean}
  ): Array<{text: string; start: number; end: number}> {
    const {segmentBySentence = true, segmentByPhrase = false} = options;

    if (!text) {
      return [];
    }

    let delimiterPattern: RegExp;

    if (segmentBySentence && segmentByPhrase) {
      delimiterPattern = /[。！？\n、・\s]+/g;
    } else if (segmentByPhrase) {
      delimiterPattern = /[、・\s]+/g;
    } else if (segmentBySentence) {
      delimiterPattern = /[。！？\n]+/g;
    } else {
      return [{text, start: 0, end: text.length}];
    }

    const segments: Array<{text: string; start: number; end: number}> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = delimiterPattern.exec(text)) !== null) {
      const segmentText = text.slice(lastIndex, match.index);
      if (segmentText.length > 0) {
        segments.push({
          text: segmentText,
          start: lastIndex,
          end: match.index
        });
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText.length > 0) {
        segments.push({
          text: remainingText,
          start: lastIndex,
          end: text.length
        });
      }
    }

    return segments;
  }

  private buildKanjiPattern(includeRareKanji: boolean): RegExp {
    const ranges = [this.COMMON_KANJI_RANGE, this.COMPATIBILITY_KANJI_RANGE];

    if (includeRareKanji) {
      ranges.push(this.RARE_KANJI_RANGE);
    }

    return new RegExp(`[${ranges.join('')}]`, 'g');
  }
}
