import {TestBed} from '@angular/core/testing';
import {kanjiFixture} from '@jp-aid/shared-interfaces/testing';

import {MockData} from './mock-data.service';

describe('MockData', () => {
  let service: MockData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getKanjiByIds', () => {
    it('should return empty array for empty ids array', () => {
      expect(service.getKanjiByIds([])).toEqual([]);
    });

    it('should return empty array for null/undefined input', () => {
      expect(service.getKanjiByIds(null as unknown as string[])).toEqual([]);
      expect(service.getKanjiByIds(undefined as unknown as string[])).toEqual([]);
    });

    it('should return matching kanji for valid ids', () => {
      const result = service.getKanjiByIds(['日', '本']);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('日');
      expect(result[1].id).toBe('本');
    });

    it('should preserve order of input ids', () => {
      const result = service.getKanjiByIds(['本', '日', '語']);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('本');
      expect(result[1].id).toBe('日');
      expect(result[2].id).toBe('語');
    });

    it('should filter out non-existent kanji ids', () => {
      const result = service.getKanjiByIds(['日', 'nonexistent', '本']);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('日');
      expect(result[1].id).toBe('本');
    });

    it('should return empty array when no ids match', () => {
      const result = service.getKanjiByIds(['a', 'b', 'c']);

      expect(result).toEqual([]);
    });

    it('should return all kanji when all ids match', () => {
      const allKanjiIds = service.getKanji().map(k => k.id);
      const result = service.getKanjiByIds(allKanjiIds);

      expect(result).toHaveLength(allKanjiIds.length);
    });

    it('should return single kanji for single id', () => {
      const result = service.getKanjiByIds(['水']);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('水');
      expect(result[0].meaning).toContain('water');
    });
  });

  describe('Order Preservation (Story 2.6 verification)', () => {
    it('should preserve order for typical search "日本語"', () => {
      const result = service.getKanjiByIds(['日', '本', '語']);

      expect(result).toHaveLength(3);
      expect(result.map(k => k.id)).toEqual(['日', '本', '語']);
    });

    it('should preserve order for reversed search "語本日"', () => {
      const result = service.getKanjiByIds(['語', '本', '日']);

      expect(result).toHaveLength(3);
      expect(result.map(k => k.id)).toEqual(['語', '本', '日']);
    });

    it('should preserve order when some kanji are not in database', () => {
      const result = service.getKanjiByIds(['日', '漢', '本', '字', '語']);

      expect(result).toHaveLength(3);
      expect(result.map(k => k.id)).toEqual(['日', '本', '語']);
    });

    it('should preserve order through setSearchResults and navigation', () => {
      const kanjiList = [
        kanjiFixture('日', ['day', 'sun'], ['ニチ', 'ジツ'], ['ひ', 'か'], 4),
        kanjiFixture('本', ['book', 'origin'], ['ホン'], ['もと'], 5),
        kanjiFixture('語', ['word', 'language'], ['ゴ'], ['かた'], 14)
      ];

      service.setSearchResults(kanjiList, '語');

      const results = service.getSearchResults();
      expect(results.map(k => k.id)).toEqual(['日', '本', '語']);
      expect(service.getCurrentKanjiIndex()).toBe(2);

      const prev1 = service.getPreviousKanji();
      expect(prev1?.id).toBe('本');

      service.updateCurrentKanji('本');
      const prev2 = service.getPreviousKanji();
      expect(prev2?.id).toBe('日');

      service.updateCurrentKanji('日');
      const next = service.getNextKanji();
      expect(next?.id).toBe('本');
    });

    it('should maintain consistent order when accessing results multiple times', () => {
      const kanjiList = [
        kanjiFixture('日', ['day'], [], [], 4),
        kanjiFixture('本', ['book'], [], [], 5),
        kanjiFixture('語', ['word'], [], [], 14)
      ];

      service.setSearchResults(kanjiList, '日');

      const results1 = service.getSearchResults();
      const results2 = service.getSearchResults();
      const results3 = service.getSearchResults();

      expect(results1.map(k => k.id)).toEqual(results2.map(k => k.id));
      expect(results2.map(k => k.id)).toEqual(results3.map(k => k.id));
      expect(results1.map(k => k.id)).toEqual(['日', '本', '語']);
    });
  });

  describe('getExampleWords', () => {
    it('should return example words for known kanji', () => {
      const exampleWords = service.getExampleWords('水');

      expect(exampleWords).toHaveLength(3);
      expect(exampleWords[0]).toEqual({
        kanji: '水曜日',
        reading: 'すいようび',
        meaning: 'Wednesday'
      });
    });

    it('should return empty array for unknown kanji', () => {
      const exampleWords = service.getExampleWords('unknown');

      expect(exampleWords).toEqual([]);
    });

    it('should return proper structure for all example words', () => {
      const exampleWords = service.getExampleWords('語');

      exampleWords.forEach(word => {
        expect(word).toHaveProperty('kanji');
        expect(word).toHaveProperty('reading');
        expect(word).toHaveProperty('meaning');
        expect(typeof word.kanji).toBe('string');
        expect(typeof word.reading).toBe('string');
        expect(typeof word.meaning).toBe('string');
      });
    });
  });

  describe('Search Results Navigation', () => {
    beforeEach(() => {
      // Set up test search results with known kanji
      const testKanji = [
        kanjiFixture('語', ['word', 'language'], ['ゴ'], ['かた(る)'], 14),
        kanjiFixture('日', ['day', 'sun'], ['ニチ', 'ジツ'], ['ひ', 'か'], 4),
        kanjiFixture('水', ['water'], ['スイ'], ['みず'], 4),
        kanjiFixture('火', ['fire'], ['カ'], ['ひ'], 4),
        kanjiFixture('人', ['person'], ['ジン', 'ニン'], ['ひと'], 2)
      ];
      service.setSearchResults(testKanji, '水'); // Set current kanji to 水 (index 2)
    });

    describe('setSearchResults', () => {
      it('should set search results and current kanji index', () => {
        const testKanji = [kanjiFixture('A', ['a'], ['A'], ['a'], 1), kanjiFixture('B', ['b'], ['B'], ['b'], 2)];

        service.setSearchResults(testKanji, 'B');

        expect(service.getSearchResults()).toEqual(testKanji);
        expect(service.getCurrentKanjiIndex()).toBe(1);
      });

      it('should set index to -1 when kanji is not found in search results', () => {
        const testKanji = [kanjiFixture('A', ['a'], ['A'], ['a'], 1), kanjiFixture('B', ['b'], ['B'], ['b'], 2)];

        service.setSearchResults(testKanji, 'C');

        expect(service.getCurrentKanjiIndex()).toBe(-1);
      });
    });

    describe('getSearchResults', () => {
      it('should return current search results', () => {
        const results = service.getSearchResults();

        expect(results).toHaveLength(5);
        expect(results[2].id).toBe('水');
      });
    });

    describe('getCurrentKanjiIndex', () => {
      it('should return current kanji index', () => {
        expect(service.getCurrentKanjiIndex()).toBe(2); // 水 is at index 2
      });
    });

    describe('getPreviousKanji', () => {
      it('should return previous kanji when available', () => {
        const previousKanji = service.getPreviousKanji();

        expect(previousKanji).toBeTruthy();
        expect(previousKanji?.id).toBe('日'); // Previous kanji at index 1
      });

      it('should return null when at beginning of search results', () => {
        service.updateCurrentKanji('語'); // First kanji (index 0)

        const previousKanji = service.getPreviousKanji();

        expect(previousKanji).toBeNull();
      });

      it('should return null when no search results exist', () => {
        service.setSearchResults([], '');

        const previousKanji = service.getPreviousKanji();

        expect(previousKanji).toBeNull();
      });
    });

    describe('getNextKanji', () => {
      it('should return next kanji when available', () => {
        const nextKanji = service.getNextKanji();

        expect(nextKanji).toBeTruthy();
        expect(nextKanji?.id).toBe('火'); // Next kanji at index 3
      });

      it('should return null when at end of search results', () => {
        service.updateCurrentKanji('人'); // Last kanji (index 4)

        const nextKanji = service.getNextKanji();

        expect(nextKanji).toBeNull();
      });

      it('should return null when no search results exist', () => {
        service.setSearchResults([], '');

        const nextKanji = service.getNextKanji();

        expect(nextKanji).toBeNull();
      });

      it('should return null when current index is -1', () => {
        service.setSearchResults([kanjiFixture('A', ['a'], ['A'], ['a'], 1)], 'nonexistent');

        const nextKanji = service.getNextKanji();

        expect(nextKanji).toBeNull();
      });
    });

    describe('hasPreviousKanji', () => {
      it('should return true when previous kanji is available', () => {
        expect(service.hasPreviousKanji()).toBe(true); // Current index is 2
      });

      it('should return false when at beginning of search results', () => {
        service.updateCurrentKanji('語'); // First kanji (index 0)

        expect(service.hasPreviousKanji()).toBe(false);
      });

      it('should return false when no search results exist', () => {
        service.setSearchResults([], '');

        expect(service.hasPreviousKanji()).toBe(false);
      });
    });

    describe('hasNextKanji', () => {
      it('should return true when next kanji is available', () => {
        expect(service.hasNextKanji()).toBe(true); // Current index is 2, total length is 5
      });

      it('should return false when at end of search results', () => {
        service.updateCurrentKanji('人'); // Last kanji (index 4)

        expect(service.hasNextKanji()).toBe(false);
      });

      it('should return false when no search results exist', () => {
        service.setSearchResults([], '');

        expect(service.hasNextKanji()).toBe(false);
      });

      it('should return false when current index is -1', () => {
        service.setSearchResults([kanjiFixture('A', ['a'], ['A'], ['a'], 1)], 'nonexistent');

        expect(service.hasNextKanji()).toBe(false);
      });
    });

    describe('updateCurrentKanji', () => {
      it('should update current kanji index when kanji exists in search results', () => {
        service.updateCurrentKanji('火'); // Index 3

        expect(service.getCurrentKanjiIndex()).toBe(3);
      });

      it('should set index to -1 when kanji does not exist in search results', () => {
        service.updateCurrentKanji('nonexistent');

        expect(service.getCurrentKanjiIndex()).toBe(-1);
      });

      it('should update navigation state correctly', () => {
        service.updateCurrentKanji('語'); // First kanji

        expect(service.hasPreviousKanji()).toBe(false);
        expect(service.hasNextKanji()).toBe(true);

        service.updateCurrentKanji('人'); // Last kanji

        expect(service.hasPreviousKanji()).toBe(true);
        expect(service.hasNextKanji()).toBe(false);
      });
    });

    describe('Navigation boundary conditions', () => {
      it('should handle single kanji search results', () => {
        const singleKanji = [kanjiFixture('A', ['a'], ['A'], ['a'], 1)];
        service.setSearchResults(singleKanji, 'A');

        expect(service.hasPreviousKanji()).toBe(false);
        expect(service.hasNextKanji()).toBe(false);
        expect(service.getPreviousKanji()).toBeNull();
        expect(service.getNextKanji()).toBeNull();
      });

      it('should handle navigation with two kanji', () => {
        const twoKanji = [kanjiFixture('A', ['a'], ['A'], ['a'], 1), kanjiFixture('B', ['b'], ['B'], ['b'], 2)];

        // Test first kanji
        service.setSearchResults(twoKanji, 'A');
        expect(service.hasPreviousKanji()).toBe(false);
        expect(service.hasNextKanji()).toBe(true);
        expect(service.getNextKanji()?.id).toBe('B');

        // Test second kanji
        service.setSearchResults(twoKanji, 'B');
        expect(service.hasPreviousKanji()).toBe(true);
        expect(service.hasNextKanji()).toBe(false);
        expect(service.getPreviousKanji()?.id).toBe('A');
      });
    });
  });
});
