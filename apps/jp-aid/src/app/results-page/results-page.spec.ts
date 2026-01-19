import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {KanjiSearchStatus} from '@jp-aid/shared-interfaces';
import {kanjiFixture} from '@jp-aid/shared-interfaces/testing';
import {BehaviorSubject} from 'rxjs';

import {MockData} from '../services/mock-data.service';
import {TextParsingService} from '../services/text-parsing/text-parsing.service';
import {ResultsPage} from './results-page';

describe('ResultsPage', () => {
  let component: ResultsPage;
  let fixture: ComponentFixture<ResultsPage>;
  let mockRouter: Partial<Router>;
  let queryParamsSubject: BehaviorSubject<{q?: string}>;
  let mockData: {getKanji: jest.Mock; getKanjiByIds: jest.Mock};

  const testKanji = [
    kanjiFixture('日', ['day', 'sun'], ['ニチ', 'ジツ'], ['ひ', 'か'], 4),
    kanjiFixture('本', ['book', 'origin'], ['ホン'], ['もと'], 5),
    kanjiFixture('語', ['word', 'language'], ['ゴ'], ['かた'], 14),
    kanjiFixture('水', ['water'], ['スイ'], ['みず'], 4)
  ];

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    };
    queryParamsSubject = new BehaviorSubject<{q?: string}>({q: 'test-search'});
    mockData = {
      getKanji: jest.fn().mockReturnValue(testKanji),
      getKanjiByIds: jest.fn().mockImplementation((ids: string[]) =>
        testKanji.filter(k => ids.includes(k.id))
      )
    };

    await TestBed.configureTestingModule({
      imports: [ResultsPage, NoopAnimationsModule],
      providers: [
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: {queryParams: queryParamsSubject.asObservable()}},
        {provide: MockData, useValue: mockData},
        TextParsingService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract search query from route params', () => {
    expect(component.searchQuery()).toBe('test-search');
  });

  it('should show loading state initially', () => {
    expect(component.isLoading()).toBe(true);
  });

  describe('Text Parsing Integration', () => {
    it('should extract kanji from search query with Japanese text', () => {
      queryParamsSubject.next({q: '日本語'});
      fixture.detectChanges();

      expect(component.searchQuery()).toBe('日本語');
    });

    it('should detect results when kanji matches mock data', () => {
      queryParamsSubject.next({q: '日本語'});
      fixture.detectChanges();

      const textParsingService = TestBed.inject(TextParsingService);
      const extracted = textParsingService.extractKanji('日本語');
      expect(extracted).toEqual(['日', '本', '語']);
    });

    it('should not call getKanjiByIds for search with no kanji', () => {
      mockData.getKanjiByIds.mockClear();
      queryParamsSubject.next({q: 'あいうえお'});
      fixture.detectChanges();

      const textParsingService = TestBed.inject(TextParsingService);
      const extracted = textParsingService.extractKanji('あいうえお');
      expect(extracted).toEqual([]);
      expect(mockData.getKanjiByIds).not.toHaveBeenCalled();
    });

    it('should navigate back to search when query is empty', () => {
      queryParamsSubject.next({q: ''});
      fixture.detectChanges();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should handle mixed kanji and kana input', () => {
      const textParsingService = TestBed.inject(TextParsingService);
      const extracted = textParsingService.extractKanji('日本語を勉強する');
      expect(extracted).toEqual(['日', '本', '語', '勉', '強']);
    });

    it('should handle Latin characters mixed with kanji', () => {
      const textParsingService = TestBed.inject(TextParsingService);
      const extracted = textParsingService.extractKanji('Hello日本World');
      expect(extracted).toEqual(['日', '本']);
    });

    it('should remove duplicate kanji from extraction', () => {
      const textParsingService = TestBed.inject(TextParsingService);
      const extracted = textParsingService.extractKanji('日日本本語');
      expect(extracted).toEqual(['日', '本', '語']);
    });
  });

  describe('goBackToSearch', () => {
    it('should navigate to search page', () => {
      component.goBackToSearch();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Search Status Logic', () => {
    describe('searchStatus computed signal', () => {
      it('should return NO_KANJI_IN_INPUT for empty string', () => {
        queryParamsSubject.next({q: ''});
        fixture.detectChanges();

        expect((component as any).searchStatus()).toBe(KanjiSearchStatus.NO_KANJI_IN_INPUT);
      });

      it('should return NO_KANJI_IN_INPUT for whitespace-only input', () => {
        queryParamsSubject.next({q: '   '});
        fixture.detectChanges();

        expect((component as any).searchStatus()).toBe(KanjiSearchStatus.NO_KANJI_IN_INPUT);
      });

      it('should return NO_KANJI_IN_INPUT for hiragana-only input', () => {
        queryParamsSubject.next({q: 'あいうえお'});
        fixture.detectChanges();

        expect((component as any).searchStatus()).toBe(KanjiSearchStatus.NO_KANJI_IN_INPUT);
      });

      it('should return NO_KANJI_IN_INPUT for katakana-only input', () => {
        queryParamsSubject.next({q: 'カタカナ'});
        fixture.detectChanges();

        expect((component as any).searchStatus()).toBe(KanjiSearchStatus.NO_KANJI_IN_INPUT);
      });

      it('should return NO_KANJI_IN_INPUT for Latin-only input', () => {
        queryParamsSubject.next({q: 'hello world'});
        fixture.detectChanges();

        expect((component as any).searchStatus()).toBe(KanjiSearchStatus.NO_KANJI_IN_INPUT);
      });

      it('should return NO_KANJI_IN_INPUT for symbols-only input', () => {
        queryParamsSubject.next({q: '123!@#'});
        fixture.detectChanges();

        expect((component as any).searchStatus()).toBe(KanjiSearchStatus.NO_KANJI_IN_INPUT);
      });

      it('should return KANJI_NOT_IN_DATABASE for kanji not in mock data', () => {
        queryParamsSubject.next({q: '漢字'});
        fixture.detectChanges();

        expect((component as any).searchStatus()).toBe(KanjiSearchStatus.KANJI_NOT_IN_DATABASE);
      });

      it('should return KANJI_NOT_IN_DATABASE for multiple kanji none in database', () => {
        queryParamsSubject.next({q: '学習'});
        fixture.detectChanges();

        expect((component as any).searchStatus()).toBe(KanjiSearchStatus.KANJI_NOT_IN_DATABASE);
      });

      it('should return PARTIAL_MATCH when some kanji found', () => {
        queryParamsSubject.next({q: '日本漢字'});
        fixture.detectChanges();

        expect((component as any).searchStatus()).toBe(KanjiSearchStatus.PARTIAL_MATCH);
      });

      it('should return FOUND when all kanji found', () => {
        queryParamsSubject.next({q: '日本語'});
        fixture.detectChanges();

        expect((component as any).searchStatus()).toBe(KanjiSearchStatus.FOUND);
      });

      it('should return FOUND for single kanji in database', () => {
        queryParamsSubject.next({q: '水'});
        fixture.detectChanges();

        expect((component as any).searchStatus()).toBe(KanjiSearchStatus.FOUND);
      });

      it('should return FOUND for multiple kanji all in database', () => {
        queryParamsSubject.next({q: '水日本'});
        fixture.detectChanges();

        expect((component as any).searchStatus()).toBe(KanjiSearchStatus.FOUND);
      });
    });

    describe('missingKanji computed signal', () => {
      it('should return empty array when all kanji found', () => {
        queryParamsSubject.next({q: '日本語'});
        fixture.detectChanges();

        expect((component as any).missingKanji()).toEqual([]);
      });

      it('should return missing kanji when partial match', () => {
        queryParamsSubject.next({q: '日本漢字'});
        fixture.detectChanges();

        expect((component as any).missingKanji()).toEqual(['漢', '字']);
      });

      it('should return all kanji when none in database', () => {
        queryParamsSubject.next({q: '漢字'});
        fixture.detectChanges();

        expect((component as any).missingKanji()).toEqual(['漢', '字']);
      });

      it('should preserve order of first appearance for missing kanji', () => {
        queryParamsSubject.next({q: '字漢日'});
        fixture.detectChanges();

        expect((component as any).missingKanji()).toEqual(['字', '漢']);
      });
    });

    describe('foundKanjiCount computed signal', () => {
      it('should return 0 when no kanji in input', () => {
        queryParamsSubject.next({q: 'あいうえお'});
        fixture.detectChanges();

        expect((component as any).foundKanjiCount()).toBe(0);
      });

      it('should return 0 when no kanji in database', () => {
        queryParamsSubject.next({q: '漢字'});
        fixture.detectChanges();

        expect((component as any).foundKanjiCount()).toBe(0);
      });

      it('should return count of found kanji for partial match', () => {
        queryParamsSubject.next({q: '日本漢字'});
        fixture.detectChanges();

        expect((component as any).foundKanjiCount()).toBe(2);
      });

      it('should return full count when all kanji found', () => {
        queryParamsSubject.next({q: '日本語'});
        fixture.detectChanges();

        expect((component as any).foundKanjiCount()).toBe(3);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should correctly determine all status scenarios from text input', () => {
      const testCases = [
        {input: '', expected: KanjiSearchStatus.NO_KANJI_IN_INPUT, description: 'empty'},
        {input: 'あいうえお', expected: KanjiSearchStatus.NO_KANJI_IN_INPUT, description: 'hiragana'},
        {input: 'hello', expected: KanjiSearchStatus.NO_KANJI_IN_INPUT, description: 'latin'},
        {input: '漢字', expected: KanjiSearchStatus.KANJI_NOT_IN_DATABASE, description: 'unknown kanji'},
        {input: '日本漢', expected: KanjiSearchStatus.PARTIAL_MATCH, description: 'partial match'},
        {input: '日本語', expected: KanjiSearchStatus.FOUND, description: 'all found'}
      ];

      for (const tc of testCases) {
        queryParamsSubject.next({q: tc.input});
        fixture.detectChanges();
        expect((component as any).searchStatus()).toBe(tc.expected);
      }
    });

    it('should correctly calculate missing kanji for partial matches', () => {
      queryParamsSubject.next({q: '日本漢字学'});
      fixture.detectChanges();

      const missing = (component as any).missingKanji();
      expect(missing).toContain('漢');
      expect(missing).toContain('字');
      expect(missing).toContain('学');
      expect(missing).not.toContain('日');
      expect(missing).not.toContain('本');
    });

    it('should correctly count found kanji across different scenarios', () => {
      const testCases = [
        {input: 'あいうえお', expectedCount: 0},
        {input: '漢字', expectedCount: 0},
        {input: '日本漢字', expectedCount: 2},
        {input: '日本語', expectedCount: 3},
        {input: '水', expectedCount: 1}
      ];

      for (const tc of testCases) {
        queryParamsSubject.next({q: tc.input});
        fixture.detectChanges();
        expect((component as any).foundKanjiCount()).toBe(tc.expectedCount);
      }
    });
  });

  describe('Segmented Display', () => {
    describe('segmentedResult computed signal', () => {
      it('should return null for empty search query', () => {
        queryParamsSubject.next({q: ''});
        fixture.detectChanges();

        expect((component as any).segmentedResult()).toBeNull();
      });

      it('should return segmented result for text with segments', () => {
        queryParamsSubject.next({q: '日本。中国'});
        fixture.detectChanges();

        const result = (component as any).segmentedResult();
        expect(result).not.toBeNull();
        expect(result.isSegmented).toBe(true);
        expect(result.segments.length).toBe(2);
      });

      it('should return non-segmented result for single word', () => {
        queryParamsSubject.next({q: '日本語'});
        fixture.detectChanges();

        const result = (component as any).segmentedResult();
        expect(result).not.toBeNull();
        expect(result.isSegmented).toBe(false);
      });
    });

    describe('hasSegments computed signal', () => {
      it('should return false for empty query', () => {
        queryParamsSubject.next({q: ''});
        fixture.detectChanges();

        expect((component as any).hasSegments()).toBe(false);
      });

      it('should return false for single-word input', () => {
        queryParamsSubject.next({q: '日本語'});
        fixture.detectChanges();

        expect((component as any).hasSegments()).toBe(false);
      });

      it('should return true for multi-sentence input', () => {
        queryParamsSubject.next({q: '日本。中国'});
        fixture.detectChanges();

        expect((component as any).hasSegments()).toBe(true);
      });

      it('should return false for single sentence with trailing period', () => {
        queryParamsSubject.next({q: '日本語。'});
        fixture.detectChanges();

        expect((component as any).hasSegments()).toBe(false);
      });
    });

    describe('displayMode computed signal', () => {
      it('should return flat for single-word input', () => {
        queryParamsSubject.next({q: '日本語'});
        fixture.detectChanges();

        expect((component as any).displayMode()).toBe('flat');
      });

      it('should return grouped for multi-sentence input', () => {
        queryParamsSubject.next({q: '日本。中国'});
        fixture.detectChanges();

        expect((component as any).displayMode()).toBe('grouped');
      });

      it('should return flat when not segmented', () => {
        queryParamsSubject.next({q: '日本語。'});
        fixture.detectChanges();

        expect((component as any).displayMode()).toBe('flat');
      });
    });

    describe('segmented result content', () => {
      it('should correctly parse two sentences', () => {
        queryParamsSubject.next({q: '日本語。中国語。'});
        fixture.detectChanges();

        const result = (component as any).segmentedResult();
        expect(result.segments.length).toBe(2);
        expect(result.segments[0].text).toBe('日本語');
        expect(result.segments[0].kanji).toEqual(['日', '本', '語']);
        expect(result.segments[1].text).toBe('中国語');
        expect(result.segments[1].kanji).toEqual(['中', '国', '語']);
      });

      it('should handle mixed delimiters', () => {
        queryParamsSubject.next({q: '日本語！中国語？'});
        fixture.detectChanges();

        const result = (component as any).segmentedResult();
        expect(result.segments.length).toBe(2);
      });
    });
  });
});
