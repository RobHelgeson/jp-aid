import {TestBed} from '@angular/core/testing';
import {kanjiFixture} from '@jp-aid/shared-interfaces';

import {MockData} from './mock-data';

describe('MockData', () => {
  let service: MockData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
