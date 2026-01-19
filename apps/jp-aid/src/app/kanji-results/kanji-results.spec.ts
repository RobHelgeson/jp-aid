import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {Router} from '@angular/router';
import {kanjiFixture} from '@jp-aid/shared-interfaces/testing';

import {MockData} from '../services/mock-data.service';
import {TextParsingService} from '../services/text-parsing/text-parsing.service';
import {KanjiResults} from './kanji-results';

describe('KanjiResults', () => {
  let component: KanjiResults;
  let fixture: ComponentFixture<KanjiResults>;
  let mockRouter: {navigate: jest.Mock};
  let mockData: {getKanji: jest.Mock; getKanjiByIds: jest.Mock; setSearchResults: jest.Mock};

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    };
    mockData = {
      getKanji: jest.fn(),
      getKanjiByIds: jest.fn(),
      setSearchResults: jest.fn()
    };

    // Setup default mock data
    const defaultKanji = [
      kanjiFixture('水', ['water'], ['スイ'], ['みず'], 4),
      kanjiFixture('火', ['fire'], ['カ'], ['ひ'], 4)
    ];
    mockData.getKanji.mockReturnValue(defaultKanji);
    mockData.getKanjiByIds.mockImplementation((ids: string[]) =>
      defaultKanji.filter(k => ids.includes(k.id))
    );

    await TestBed.configureTestingModule({
      imports: [KanjiResults, NoopAnimationsModule],
      providers: [
        {provide: Router, useValue: mockRouter},
        {provide: MockData, useValue: mockData},
        TextParsingService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(KanjiResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply .active class to clicked card', () => {
    component.allKanji.set([kanjiFixture('水', ['water'], [], [], 4), kanjiFixture('火', ['fire'], [], [], 4)]);
    fixture.detectChanges();

    expect(component.paginatedKanji()).toHaveLength(2);

    const cards = fixture.debugElement.queryAll(By.css('mat-card'));
    cards[0].nativeElement.click();
    fixture.detectChanges();
    expect(cards[0].nativeElement.classList).toContain('active');
    expect(cards[1].nativeElement.classList).not.toContain('active');

    cards[1].nativeElement.click();
    fixture.detectChanges();
    expect(cards[0].nativeElement.classList).not.toContain('active');
    expect(cards[1].nativeElement.classList).toContain('active');
  });

  it('should navigate to kanji detail page when kanji is clicked', () => {
    component.allKanji.set([kanjiFixture('水', ['water'], [], [], 4), kanjiFixture('火', ['fire'], [], [], 4)]);
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('mat-card'));

    // Click on first kanji
    cards[0].nativeElement.click();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/kanji', '水'], {queryParams: {q: ''}});

    // Click on second kanji
    cards[1].nativeElement.click();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/kanji', '火'], {queryParams: {q: ''}});
  });

  it('should set selected kanji when card is clicked', () => {
    component.allKanji.set([kanjiFixture('水', ['water'], [], [], 4)]);
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('mat-card'));
    card.nativeElement.click();
    fixture.detectChanges(); // Trigger change detection after click

    // Verify the card becomes active (which indicates selection)
    expect(card.nativeElement.classList).toContain('active');
  });

  it('should call setSearchResults with ordered kanji when navigating to detail', () => {
    const testKanji = [
      kanjiFixture('日', ['day', 'sun'], ['ニチ', 'ジツ'], ['ひ', 'か'], 4),
      kanjiFixture('本', ['book', 'origin'], ['ホン'], ['もと'], 5),
      kanjiFixture('語', ['word', 'language'], ['ゴ'], ['かた'], 14)
    ];
    mockData.getKanjiByIds.mockImplementation((ids: string[]) =>
      testKanji.filter(k => ids.includes(k.id))
    );
    component.allKanji.set(testKanji);

    fixture.componentRef.setInput('searchText', '日本語');
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('mat-card'));
    cards[1].nativeElement.click();
    fixture.detectChanges();

    expect(mockData.setSearchResults).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({id: '日'}),
        expect.objectContaining({id: '本'}),
        expect.objectContaining({id: '語'})
      ]),
      '本'
    );
    const callArgs = mockData.setSearchResults.mock.calls[0];
    expect(callArgs[0].map((k: {id: string}) => k.id)).toEqual(['日', '本', '語']);
  });

  describe('Order Preservation (Story 2.6 verification)', () => {
    const testKanji = [
      kanjiFixture('日', ['day', 'sun'], ['ニチ', 'ジツ'], ['ひ', 'か'], 4),
      kanjiFixture('本', ['book', 'origin'], ['ホン'], ['もと'], 5),
      kanjiFixture('語', ['word', 'language'], ['ゴ'], ['かた'], 14),
      kanjiFixture('水', ['water'], ['スイ'], ['みず'], 4)
    ];

    beforeEach(() => {
      mockData.getKanjiByIds.mockImplementation((ids: string[]) => {
        const kanjiMap = new Map(testKanji.map(k => [k.id, k]));
        return ids.map(id => kanjiMap.get(id)).filter((k): k is typeof testKanji[0] => k !== undefined);
      });
      component.allKanji.set(testKanji);
    });

    it('should preserve order for "日本語" search - kanji should appear in extraction order', () => {
      fixture.componentRef.setInput('searchText', '日本語');
      fixture.detectChanges();

      const ids = component.paginatedKanji().map(k => k.id);
      expect(ids).toEqual(['日', '本', '語']);
    });

    it('should preserve order for "語本日" search - reversed extraction order', () => {
      fixture.componentRef.setInput('searchText', '語本日');
      fixture.detectChanges();

      const ids = component.paginatedKanji().map(k => k.id);
      expect(ids).toEqual(['語', '本', '日']);
    });

    it('should preserve order when mixed with hiragana "日がある本がある語"', () => {
      fixture.componentRef.setInput('searchText', '日がある本がある語');
      fixture.detectChanges();

      const ids = component.paginatedKanji().map(k => k.id);
      expect(ids).toEqual(['日', '本', '語']);
    });

    it('should pass ordered kanji array to setSearchResults when selecting', () => {
      fixture.componentRef.setInput('searchText', '日本語');
      fixture.detectChanges();

      const cards = fixture.debugElement.queryAll(By.css('mat-card'));
      cards[1].nativeElement.click();
      fixture.detectChanges();

      const callArgs = mockData.setSearchResults.mock.calls[0];
      expect(callArgs[0].map((k: {id: string}) => k.id)).toEqual(['日', '本', '語']);
      expect(callArgs[1]).toBe('本');
    });

    it('should preserve order for multi-kanji search with repeated characters', () => {
      fixture.componentRef.setInput('searchText', '日日本本語');
      fixture.detectChanges();

      const ids = component.paginatedKanji().map(k => k.id);
      expect(ids).toEqual(['日', '本', '語']);
    });
  });

  describe('Filtering', () => {
    const testKanji = [
      kanjiFixture('日', ['day', 'sun'], ['ニチ', 'ジツ'], ['ひ', 'か'], 4),
      kanjiFixture('本', ['book', 'origin'], ['ホン'], ['もと'], 5),
      kanjiFixture('語', ['word', 'language'], ['ゴ'], ['かた'], 14),
      kanjiFixture('水', ['water'], ['スイ'], ['みず'], 4)
    ];

    beforeEach(() => {
      mockData.getKanjiByIds.mockImplementation((ids: string[]) =>
        testKanji.filter(k => ids.includes(k.id))
      );
      component.allKanji.set(testKanji);
    });

    it('should filter by single kanji character', () => {
      fixture.componentRef.setInput('searchText', '日');
      fixture.detectChanges();

      expect(component.paginatedKanji()).toHaveLength(1);
      expect(component.paginatedKanji()[0].id).toBe('日');
    });

    it('should extract multiple kanji from search text', () => {
      fixture.componentRef.setInput('searchText', '日本語');
      fixture.detectChanges();

      expect(component.paginatedKanji()).toHaveLength(3);
      const ids = component.paginatedKanji().map(k => k.id);
      expect(ids).toContain('日');
      expect(ids).toContain('本');
      expect(ids).toContain('語');
    });

    it('should filter by meaning when no kanji in search text', () => {
      fixture.componentRef.setInput('searchText', 'water');
      fixture.detectChanges();

      expect(component.paginatedKanji()).toHaveLength(1);
      expect(component.paginatedKanji()[0].id).toBe('水');
    });

    it('should filter by on-reading (kana)', () => {
      fixture.componentRef.setInput('searchText', 'スイ');
      fixture.detectChanges();

      expect(component.paginatedKanji()).toHaveLength(1);
      expect(component.paginatedKanji()[0].id).toBe('水');
    });

    it('should filter by kun-reading (kana)', () => {
      fixture.componentRef.setInput('searchText', 'みず');
      fixture.detectChanges();

      expect(component.paginatedKanji()).toHaveLength(1);
      expect(component.paginatedKanji()[0].id).toBe('水');
    });

    it('should return all kanji when search text is empty', () => {
      fixture.componentRef.setInput('searchText', '');
      fixture.detectChanges();

      expect(component.paginatedKanji()).toHaveLength(4);
    });

    it('should handle mixed kanji and non-kanji search text', () => {
      fixture.componentRef.setInput('searchText', '日本は良い');
      fixture.detectChanges();

      expect(component.paginatedKanji()).toHaveLength(2);
      const ids = component.paginatedKanji().map(k => k.id);
      expect(ids).toContain('日');
      expect(ids).toContain('本');
    });
  });
});
