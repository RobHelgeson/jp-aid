import {TestBed} from '@angular/core/testing';

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
});
