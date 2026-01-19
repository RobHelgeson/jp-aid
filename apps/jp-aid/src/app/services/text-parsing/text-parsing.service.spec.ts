import {TestBed} from '@angular/core/testing';

import {TextParsingService} from './text-parsing.service';

describe('TextParsingService', () => {
  let service: TextParsingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextParsingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('extractKanji', () => {
    it('should return empty array for empty string', () => {
      expect(service.extractKanji('')).toEqual([]);
    });

    it('should return empty array for null/undefined input', () => {
      expect(service.extractKanji(null as unknown as string)).toEqual([]);
      expect(service.extractKanji(undefined as unknown as string)).toEqual([]);
    });

    it('should return empty array for hiragana-only input', () => {
      expect(service.extractKanji('あいうえお')).toEqual([]);
      expect(service.extractKanji('ひらがな')).toEqual([]);
    });

    it('should return empty array for katakana-only input', () => {
      expect(service.extractKanji('アイウエオ')).toEqual([]);
      expect(service.extractKanji('カタカナ')).toEqual([]);
    });

    it('should extract kanji from kanji-only input', () => {
      expect(service.extractKanji('漢字')).toEqual(['漢', '字']);
    });

    it('should extract kanji from mixed kanji/kana input', () => {
      expect(service.extractKanji('日本語を勉強する')).toEqual(['日', '本', '語', '勉', '強']);
    });

    it('should extract kanji from mixed Latin/kanji input', () => {
      expect(service.extractKanji('Hello世界World')).toEqual(['世', '界']);
    });

    it('should remove duplicate kanji while preserving first occurrence order', () => {
      expect(service.extractKanji('日日日本')).toEqual(['日', '本']);
    });

    it('should return empty array for symbols and numbers', () => {
      expect(service.extractKanji('123!@#$%')).toEqual([]);
    });

    it('should handle punctuation and duplicates in mixed content', () => {
      expect(service.extractKanji('日本語、日本語！')).toEqual(['日', '本', '語']);
    });

    it('should handle complex sentence with various character types', () => {
      const input = '私は毎日、日本語を勉強しています。English too!';
      const result = service.extractKanji(input);
      expect(result).toEqual(['私', '毎', '日', '本', '語', '勉', '強']);
    });

    it('should preserve order of first appearance by default', () => {
      const result = service.extractKanji('水火水木金水');
      expect(result).toEqual(['水', '火', '木', '金']);
    });

    describe('with options', () => {
      it('should include duplicates when removeDuplicates is false', () => {
        const result = service.extractKanji('日日本', {removeDuplicates: false});
        expect(result).toEqual(['日', '日', '本']);
      });

      it('should exclude rare kanji when includeRareKanji is false', () => {
        const commonKanjiText = '日本語';
        const result = service.extractKanji(commonKanjiText, {includeRareKanji: false});
        expect(result).toEqual(['日', '本', '語']);
      });
    });
  });

  describe('isKanji', () => {
    it('should return true for common kanji characters', () => {
      expect(service.isKanji('日')).toBe(true);
      expect(service.isKanji('本')).toBe(true);
      expect(service.isKanji('語')).toBe(true);
      expect(service.isKanji('漢')).toBe(true);
      expect(service.isKanji('字')).toBe(true);
    });

    it('should return false for hiragana', () => {
      expect(service.isKanji('あ')).toBe(false);
      expect(service.isKanji('ひ')).toBe(false);
    });

    it('should return false for katakana', () => {
      expect(service.isKanji('ア')).toBe(false);
      expect(service.isKanji('カ')).toBe(false);
    });

    it('should return false for Latin characters', () => {
      expect(service.isKanji('A')).toBe(false);
      expect(service.isKanji('z')).toBe(false);
    });

    it('should return false for numbers', () => {
      expect(service.isKanji('1')).toBe(false);
      expect(service.isKanji('9')).toBe(false);
    });

    it('should return false for punctuation and symbols', () => {
      expect(service.isKanji('!')).toBe(false);
      expect(service.isKanji('、')).toBe(false);
      expect(service.isKanji('。')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(service.isKanji('')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(service.isKanji(null as unknown as string)).toBe(false);
      expect(service.isKanji(undefined as unknown as string)).toBe(false);
    });

    it('should return false for multiple characters', () => {
      expect(service.isKanji('日本')).toBe(false);
      expect(service.isKanji('ab')).toBe(false);
    });
  });

  describe('containsKanji', () => {
    it('should return true for text containing kanji', () => {
      expect(service.containsKanji('日本語')).toBe(true);
      expect(service.containsKanji('Hello日本World')).toBe(true);
      expect(service.containsKanji('あいう漢字えお')).toBe(true);
    });

    it('should return false for text without kanji', () => {
      expect(service.containsKanji('あいうえお')).toBe(false);
      expect(service.containsKanji('アイウエオ')).toBe(false);
      expect(service.containsKanji('Hello World')).toBe(false);
      expect(service.containsKanji('123!@#')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(service.containsKanji('')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(service.containsKanji(null as unknown as string)).toBe(false);
      expect(service.containsKanji(undefined as unknown as string)).toBe(false);
    });

    it('should handle text with only punctuation', () => {
      expect(service.containsKanji('、。！？')).toBe(false);
    });
  });

  describe('parseText', () => {
    it('should return complete parsing result for text with kanji', () => {
      const result = service.parseText('日本語を勉強する');

      expect(result).toEqual({
        originalText: '日本語を勉強する',
        extractedKanji: ['日', '本', '語', '勉', '強'],
        kanjiCount: 5,
        hasKanji: true
      });
    });

    it('should return empty result for text without kanji', () => {
      const result = service.parseText('あいうえお');

      expect(result).toEqual({
        originalText: 'あいうえお',
        extractedKanji: [],
        kanjiCount: 0,
        hasKanji: false
      });
    });

    it('should return empty result for empty string', () => {
      const result = service.parseText('');

      expect(result).toEqual({
        originalText: '',
        extractedKanji: [],
        kanjiCount: 0,
        hasKanji: false
      });
    });

    it('should handle mixed content correctly', () => {
      const result = service.parseText('Hello世界123');

      expect(result).toEqual({
        originalText: 'Hello世界123',
        extractedKanji: ['世', '界'],
        kanjiCount: 2,
        hasKanji: true
      });
    });

    it('should handle duplicates correctly', () => {
      const result = service.parseText('日日本本語');

      expect(result).toEqual({
        originalText: '日日本本語',
        extractedKanji: ['日', '本', '語'],
        kanjiCount: 3,
        hasKanji: true
      });
    });

    it('should respect extraction options', () => {
      const result = service.parseText('日日本', {removeDuplicates: false});

      expect(result.extractedKanji).toEqual(['日', '日', '本']);
      expect(result.kanjiCount).toBe(3);
    });
  });

  describe('Unicode range coverage', () => {
    it('should detect common kanji (CJK Unified Ideographs: U+4E00-U+9FFF)', () => {
      expect(service.isKanji('一')).toBe(true); // U+4E00 (start of range)
      expect(service.isKanji('龯')).toBe(true); // Near end of common range
      expect(service.isKanji('日')).toBe(true); // Common kanji
    });

    it('should detect CJK compatibility ideographs (U+F900-U+FAFF)', () => {
      expect(service.isKanji('豈')).toBe(true); // U+F900 (start of compatibility range)
    });
  });

  describe('Order Preservation (Story 2.6 verification)', () => {
    it('should preserve first-appearance order for "日本語"', () => {
      const result = service.extractKanji('日本語');
      expect(result).toEqual(['日', '本', '語']);
    });

    it('should preserve first-appearance order for complex sentence', () => {
      const result = service.extractKanji('語日本語日');
      expect(result).toEqual(['語', '日', '本']);
    });

    it('should preserve order when kanji appear with hiragana between them', () => {
      const result = service.extractKanji('日がある本がある語');
      expect(result).toEqual(['日', '本', '語']);
    });

    it('should preserve order for multi-sentence input', () => {
      const result = service.extractKanji('日本語。中国語。');
      expect(result).toEqual(['日', '本', '語', '中', '国']);
    });

    it('should maintain stable order across repeated calls', () => {
      const input = '日本語';
      const result1 = service.extractKanji(input);
      const result2 = service.extractKanji(input);
      const result3 = service.extractKanji(input);

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      expect(result1).toEqual(['日', '本', '語']);
    });
  });

  describe('edge cases', () => {
    it('should handle whitespace', () => {
      expect(service.extractKanji('  日  本  ')).toEqual(['日', '本']);
    });

    it('should handle newlines', () => {
      expect(service.extractKanji('日\n本\n語')).toEqual(['日', '本', '語']);
    });

    it('should handle tabs', () => {
      expect(service.extractKanji('日\t本\t語')).toEqual(['日', '本', '語']);
    });

    it('should handle single kanji character', () => {
      expect(service.extractKanji('日')).toEqual(['日']);
    });

    it('should handle very long text', () => {
      const longText = '日本語'.repeat(1000);
      const result = service.extractKanji(longText);
      expect(result).toEqual(['日', '本', '語']);
    });
  });

  describe('extractKanjiWithPositions', () => {
    it('should return empty kanjiPositions array for empty string', () => {
      const result = service.extractKanjiWithPositions('');

      expect(result.kanjiPositions).toEqual([]);
      expect(result.extractedKanji).toEqual([]);
      expect(result.originalText).toBe('');
      expect(result.hasKanji).toBe(false);
    });

    it('should return empty kanjiPositions array for null/undefined input', () => {
      const nullResult = service.extractKanjiWithPositions(null as unknown as string);
      const undefinedResult = service.extractKanjiWithPositions(undefined as unknown as string);

      expect(nullResult.kanjiPositions).toEqual([]);
      expect(undefinedResult.kanjiPositions).toEqual([]);
    });

    it('should return empty kanjiPositions array for hiragana-only input', () => {
      const result = service.extractKanjiWithPositions('あいうえお');

      expect(result.kanjiPositions).toEqual([]);
      expect(result.hasKanji).toBe(false);
    });

    it('should return correct position for single kanji', () => {
      const result = service.extractKanjiWithPositions('日');

      expect(result.kanjiPositions).toEqual([
        {kanji: '日', positions: [0], firstPosition: 0}
      ]);
    });

    it('should return correct positions for two consecutive kanji', () => {
      const result = service.extractKanjiWithPositions('日本');

      expect(result.kanjiPositions).toEqual([
        {kanji: '日', positions: [0], firstPosition: 0},
        {kanji: '本', positions: [1], firstPosition: 1}
      ]);
    });

    it('should track all occurrence positions for repeated kanji', () => {
      const result = service.extractKanjiWithPositions('日本日');

      expect(result.kanjiPositions).toEqual([
        {kanji: '日', positions: [0, 2], firstPosition: 0},
        {kanji: '本', positions: [1], firstPosition: 1}
      ]);
    });

    it('should correctly map positions for kanji in mixed content', () => {
      const result = service.extractKanjiWithPositions('あ日い本う');

      expect(result.kanjiPositions).toEqual([
        {kanji: '日', positions: [1], firstPosition: 1},
        {kanji: '本', positions: [3], firstPosition: 3}
      ]);
    });

    it('should correctly map positions across multi-sentence input', () => {
      const result = service.extractKanjiWithPositions('日本語。日本人。');

      expect(result.kanjiPositions).toEqual([
        {kanji: '日', positions: [0, 4], firstPosition: 0},
        {kanji: '本', positions: [1, 5], firstPosition: 1},
        {kanji: '語', positions: [2], firstPosition: 2},
        {kanji: '人', positions: [6], firstPosition: 6}
      ]);
    });

    it('should correctly map positions for kanji mixed with Latin text', () => {
      const result = service.extractKanjiWithPositions('Hello日World本');

      expect(result.kanjiPositions).toEqual([
        {kanji: '日', positions: [5], firstPosition: 5},
        {kanji: '本', positions: [11], firstPosition: 11}
      ]);
    });

    it('should preserve first occurrence ordering', () => {
      const result = service.extractKanjiWithPositions('本日本日語');

      expect(result.kanjiPositions[0].kanji).toBe('本');
      expect(result.kanjiPositions[0].firstPosition).toBe(0);
      expect(result.kanjiPositions[1].kanji).toBe('日');
      expect(result.kanjiPositions[1].firstPosition).toBe(1);
      expect(result.kanjiPositions[2].kanji).toBe('語');
      expect(result.kanjiPositions[2].firstPosition).toBe(4);
    });

    it('should track multiple occurrences across a complex sentence', () => {
      const result = service.extractKanjiWithPositions('日本語を勉強する');

      expect(result.kanjiPositions).toEqual([
        {kanji: '日', positions: [0], firstPosition: 0},
        {kanji: '本', positions: [1], firstPosition: 1},
        {kanji: '語', positions: [2], firstPosition: 2},
        {kanji: '勉', positions: [4], firstPosition: 4},
        {kanji: '強', positions: [5], firstPosition: 5}
      ]);
      expect(result.extractedKanji).toEqual(['日', '本', '語', '勉', '強']);
    });

    it('should handle multiple identical kanji spread throughout text', () => {
      const result = service.extractKanjiWithPositions('日日本');

      expect(result.kanjiPositions).toEqual([
        {kanji: '日', positions: [0, 1], firstPosition: 0},
        {kanji: '本', positions: [2], firstPosition: 2}
      ]);
    });

    it('should include all base TextParsingResult properties', () => {
      const result = service.extractKanjiWithPositions('日本語');

      expect(result.originalText).toBe('日本語');
      expect(result.extractedKanji).toEqual(['日', '本', '語']);
      expect(result.kanjiCount).toBe(3);
      expect(result.hasKanji).toBe(true);
      expect(result.kanjiPositions.length).toBe(3);
    });

    it('should handle whitespace and special characters correctly', () => {
      const result = service.extractKanjiWithPositions('  日  本  ');

      expect(result.kanjiPositions).toEqual([
        {kanji: '日', positions: [2], firstPosition: 2},
        {kanji: '本', positions: [5], firstPosition: 5}
      ]);
    });

    it('should handle newlines correctly', () => {
      const result = service.extractKanjiWithPositions('日\n本');

      expect(result.kanjiPositions).toEqual([
        {kanji: '日', positions: [0], firstPosition: 0},
        {kanji: '本', positions: [2], firstPosition: 2}
      ]);
    });

    it('should handle text with numbers and symbols', () => {
      const result = service.extractKanjiWithPositions('123日456本789');

      expect(result.kanjiPositions).toEqual([
        {kanji: '日', positions: [3], firstPosition: 3},
        {kanji: '本', positions: [7], firstPosition: 7}
      ]);
    });

    it('should handle complex multi-sentence text with many repeated kanji', () => {
      const result = service.extractKanjiWithPositions('私は毎日、日本語を勉強しています。');
      // Character positions: 私(0)は(1)毎(2)日(3)、(4)日(5)本(6)語(7)を(8)勉(9)強(10)...

      const nichi = result.kanjiPositions.find(p => p.kanji === '日');
      expect(nichi?.positions).toEqual([3, 5]);
      expect(nichi?.firstPosition).toBe(3);

      expect(result.kanjiPositions[0].kanji).toBe('私');
      expect(result.kanjiPositions[0].firstPosition).toBe(0);
    });

    describe('with options', () => {
      it('should respect includeRareKanji option', () => {
        const result = service.extractKanjiWithPositions('日本語', {includeRareKanji: false});

        expect(result.kanjiPositions.length).toBe(3);
        expect(result.extractedKanji).toEqual(['日', '本', '語']);
      });
    });
  });

  describe('parseTextWithSegments', () => {
    describe('empty and single-segment cases', () => {
      it('should return empty segments array for empty string', () => {
        const result = service.parseTextWithSegments('');

        expect(result.segments).toEqual([]);
        expect(result.segmentCount).toBe(0);
        expect(result.isSegmented).toBe(false);
        expect(result.hasKanji).toBe(false);
      });

      it('should return empty segments array for null/undefined input', () => {
        const nullResult = service.parseTextWithSegments(null as unknown as string);
        const undefinedResult = service.parseTextWithSegments(undefined as unknown as string);

        expect(nullResult.segments).toEqual([]);
        expect(nullResult.segmentCount).toBe(0);
        expect(undefinedResult.segments).toEqual([]);
        expect(undefinedResult.segmentCount).toBe(0);
      });

      it('should return single segment for text without delimiters', () => {
        const result = service.parseTextWithSegments('日本語');

        expect(result.isSegmented).toBe(false);
        expect(result.segmentCount).toBe(1);
        expect(result.segments.length).toBe(1);
        expect(result.segments[0]).toEqual({
          text: '日本語',
          startPosition: 0,
          endPosition: 3,
          kanji: ['日', '本', '語'],
          kanjiPositions: [
            {kanji: '日', positions: [0], firstPosition: 0},
            {kanji: '本', positions: [1], firstPosition: 1},
            {kanji: '語', positions: [2], firstPosition: 2}
          ],
          segmentIndex: 0
        });
      });

      it('should return empty segments for hiragana-only input', () => {
        const result = service.parseTextWithSegments('あいうえお');

        expect(result.segments).toEqual([]);
        expect(result.segmentCount).toBe(0);
        expect(result.isSegmented).toBe(false);
        expect(result.hasKanji).toBe(false);
      });
    });

    describe('sentence segmentation on 。', () => {
      it('should segment text on Japanese period', () => {
        const result = service.parseTextWithSegments('日本。中国');

        expect(result.isSegmented).toBe(true);
        expect(result.segmentCount).toBe(2);
        expect(result.segments[0].text).toBe('日本');
        expect(result.segments[0].kanji).toEqual(['日', '本']);
        expect(result.segments[1].text).toBe('中国');
        expect(result.segments[1].kanji).toEqual(['中', '国']);
      });

      it('should handle trailing period correctly', () => {
        const result = service.parseTextWithSegments('日本語。');

        expect(result.isSegmented).toBe(false);
        expect(result.segmentCount).toBe(1);
        expect(result.segments[0].text).toBe('日本語');
        expect(result.segments[0].kanji).toEqual(['日', '本', '語']);
      });

      it('should handle multiple consecutive periods', () => {
        const result = service.parseTextWithSegments('日本。。。中国');

        expect(result.isSegmented).toBe(true);
        expect(result.segmentCount).toBe(2);
        expect(result.segments[0].text).toBe('日本');
        expect(result.segments[1].text).toBe('中国');
      });
    });

    describe('sentence segmentation on ！ and ？', () => {
      it('should segment on exclamation mark', () => {
        const result = service.parseTextWithSegments('日本語！中国語');

        expect(result.isSegmented).toBe(true);
        expect(result.segments.length).toBe(2);
        expect(result.segments[0].text).toBe('日本語');
        expect(result.segments[1].text).toBe('中国語');
      });

      it('should segment on question mark', () => {
        const result = service.parseTextWithSegments('日本語？中国語');

        expect(result.isSegmented).toBe(true);
        expect(result.segments.length).toBe(2);
        expect(result.segments[0].text).toBe('日本語');
        expect(result.segments[1].text).toBe('中国語');
      });

      it('should segment on mixed delimiters', () => {
        const result = service.parseTextWithSegments('日本語！中国語？韓国語');

        expect(result.isSegmented).toBe(true);
        expect(result.segmentCount).toBe(3);
        expect(result.segments[0].text).toBe('日本語');
        expect(result.segments[1].text).toBe('中国語');
        expect(result.segments[2].text).toBe('韓国語');
      });

      it('should handle combined delimiters like !?', () => {
        const result = service.parseTextWithSegments('日本！？中国');

        expect(result.isSegmented).toBe(true);
        expect(result.segmentCount).toBe(2);
      });
    });

    describe('sentence segmentation on newline', () => {
      it('should segment on newline character', () => {
        const result = service.parseTextWithSegments('日本語\n中国語');

        expect(result.isSegmented).toBe(true);
        expect(result.segmentCount).toBe(2);
        expect(result.segments[0].text).toBe('日本語');
        expect(result.segments[1].text).toBe('中国語');
      });
    });

    describe('phrase segmentation on 、', () => {
      it('should NOT segment on comma by default', () => {
        const result = service.parseTextWithSegments('東京、大阪、京都');

        expect(result.isSegmented).toBe(false);
        expect(result.segmentCount).toBe(1);
        expect(result.segments[0].text).toBe('東京、大阪、京都');
      });

      it('should segment on comma when segmentByPhrase is true', () => {
        const result = service.parseTextWithSegments('東京、大阪、京都', {segmentByPhrase: true});

        expect(result.isSegmented).toBe(true);
        expect(result.segmentCount).toBe(3);
        expect(result.segments[0].text).toBe('東京');
        expect(result.segments[1].text).toBe('大阪');
        expect(result.segments[2].text).toBe('京都');
      });
    });

    describe('position tracking', () => {
      it('should track correct absolute positions across segments', () => {
        const result = service.parseTextWithSegments('日本。中国');
        // 日(0)本(1)。(2)中(3)国(4)

        expect(result.segments[0].startPosition).toBe(0);
        expect(result.segments[0].endPosition).toBe(2);
        expect(result.segments[0].kanjiPositions[0]).toEqual({
          kanji: '日',
          positions: [0],
          firstPosition: 0
        });

        expect(result.segments[1].startPosition).toBe(3);
        expect(result.segments[1].endPosition).toBe(5);
        expect(result.segments[1].kanjiPositions[0]).toEqual({
          kanji: '中',
          positions: [3],
          firstPosition: 3
        });
      });

      it('should track repeated kanji positions within segments', () => {
        const result = service.parseTextWithSegments('日日本。中中国');
        // 日(0)日(1)本(2)。(3)中(4)中(5)国(6)

        expect(result.segments[0].kanjiPositions[0]).toEqual({
          kanji: '日',
          positions: [0, 1],
          firstPosition: 0
        });

        expect(result.segments[1].kanjiPositions[0]).toEqual({
          kanji: '中',
          positions: [4, 5],
          firstPosition: 4
        });
      });
    });

    describe('isSegmented flag', () => {
      it('should be false for single word', () => {
        const result = service.parseTextWithSegments('日本語');
        expect(result.isSegmented).toBe(false);
      });

      it('should be false for single sentence with trailing period', () => {
        const result = service.parseTextWithSegments('日本語。');
        expect(result.isSegmented).toBe(false);
      });

      it('should be true for two sentences', () => {
        const result = service.parseTextWithSegments('日本語。中国語。');
        expect(result.isSegmented).toBe(true);
      });

      it('should be false when only one segment has kanji', () => {
        const result = service.parseTextWithSegments('あいう。日本語');
        // First segment has no kanji, second has kanji
        expect(result.isSegmented).toBe(false);
        expect(result.segmentCount).toBe(1);
        expect(result.segments[0].text).toBe('日本語');
      });
    });

    describe('empty segment handling', () => {
      it('should skip segments without kanji by default', () => {
        const result = service.parseTextWithSegments('あいうえお。かきくけこ。');

        expect(result.segments).toEqual([]);
        expect(result.segmentCount).toBe(0);
      });

      it('should include empty segments when includeEmptySegments is true', () => {
        const result = service.parseTextWithSegments('あいう。日本語', {includeEmptySegments: true});

        expect(result.segmentCount).toBe(2);
        expect(result.segments[0].text).toBe('あいう');
        expect(result.segments[0].kanji).toEqual([]);
        expect(result.segments[1].text).toBe('日本語');
        expect(result.segments[1].kanji).toEqual(['日', '本', '語']);
      });
    });

    describe('base result properties', () => {
      it('should include all base TextParsingResultWithPositions properties', () => {
        const result = service.parseTextWithSegments('日本。中国');

        expect(result.originalText).toBe('日本。中国');
        expect(result.extractedKanji).toEqual(['日', '本', '中', '国']);
        expect(result.kanjiCount).toBe(4);
        expect(result.hasKanji).toBe(true);
        expect(result.kanjiPositions.length).toBe(4);
      });
    });

    describe('complex scenarios', () => {
      it('should handle multi-sentence input correctly', () => {
        const result = service.parseTextWithSegments('日本語を勉強する。中国語も勉強したい。');

        expect(result.isSegmented).toBe(true);
        expect(result.segmentCount).toBe(2);

        expect(result.segments[0].text).toBe('日本語を勉強する');
        expect(result.segments[0].kanji).toEqual(['日', '本', '語', '勉', '強']);

        expect(result.segments[1].text).toBe('中国語も勉強したい');
        expect(result.segments[1].kanji).toEqual(['中', '国', '語', '勉', '強']);
      });

      it('should handle mixed content with Latin text', () => {
        const result = service.parseTextWithSegments('Hello日本World。Test中国End');

        expect(result.isSegmented).toBe(true);
        expect(result.segments[0].text).toBe('Hello日本World');
        expect(result.segments[0].kanji).toEqual(['日', '本']);
        expect(result.segments[1].text).toBe('Test中国End');
        expect(result.segments[1].kanji).toEqual(['中', '国']);
      });

      it('should handle segment index correctly', () => {
        const result = service.parseTextWithSegments('日本。中国。韓国');

        expect(result.segments[0].segmentIndex).toBe(0);
        expect(result.segments[1].segmentIndex).toBe(1);
        expect(result.segments[2].segmentIndex).toBe(2);
      });

      it('should skip empty segments at beginning', () => {
        const result = service.parseTextWithSegments('。日本。中国');

        expect(result.segmentCount).toBe(2);
        expect(result.segments[0].text).toBe('日本');
        expect(result.segments[1].text).toBe('中国');
      });
    });

    describe('test cases from story spec', () => {
      it('should handle single word - no segmentation', () => {
        const result = service.parseTextWithSegments('日本語');

        expect(result.isSegmented).toBe(false);
        expect(result.segments.length).toBe(1);
        expect(result.segments[0].kanji).toEqual(['日', '本', '語']);
      });

      it('should handle two sentences', () => {
        const result = service.parseTextWithSegments('日本。中国');

        expect(result.isSegmented).toBe(true);
        expect(result.segments.length).toBe(2);
        expect(result.segments[0]).toMatchObject({text: '日本', kanji: ['日', '本']});
        expect(result.segments[1]).toMatchObject({text: '中国', kanji: ['中', '国']});
      });

      it('should handle single sentence with trailing period', () => {
        const result = service.parseTextWithSegments('日本語を勉強する。');

        expect(result.isSegmented).toBe(false);
        expect(result.segments.length).toBe(1);
        expect(result.segments[0].kanji).toEqual(['日', '本', '語', '勉', '強']);
      });

      it('should not segment on comma without phrase segmentation', () => {
        const result = service.parseTextWithSegments('東京、大阪');

        expect(result.isSegmented).toBe(false);
        expect(result.segments[0].kanji).toEqual(['東', '京', '大', '阪']);
      });

      it('should return empty segments for no kanji in any segment', () => {
        const result = service.parseTextWithSegments('あいうえお。かきくけこ。');

        expect(result.segments).toEqual([]);
        expect(result.hasKanji).toBe(false);
      });

      it('should handle different sentence delimiters', () => {
        const result = service.parseTextWithSegments('日本語！中国語？');

        expect(result.isSegmented).toBe(true);
        expect(result.segments.length).toBe(2);
        expect(result.segments[0].kanji).toEqual(['日', '本', '語']);
        expect(result.segments[1].kanji).toEqual(['中', '国', '語']);
      });
    });
  });
});
