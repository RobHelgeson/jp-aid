import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {Router} from '@angular/router';
import {kanjiFixture} from '@jp-aid/shared-interfaces/testing';

import {MockData} from '../services/mock-data.service';
import {KanjiResults} from './kanji-results';

describe('KanjiResults', () => {
  let component: KanjiResults;
  let fixture: ComponentFixture<KanjiResults>;
  let mockRouter: {navigate: jest.Mock};
  let mockData: {getKanji: jest.Mock};

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    };
    mockData = {
      getKanji: jest.fn()
    };

    // Setup default mock data
    mockData.getKanji.mockReturnValue([
      kanjiFixture('水', ['water'], ['スイ'], ['みず'], 4),
      kanjiFixture('火', ['fire'], ['カ'], ['ひ'], 4)
    ]);

    await TestBed.configureTestingModule({
      imports: [KanjiResults, NoopAnimationsModule],
      providers: [
        {provide: Router, useValue: mockRouter},
        {provide: MockData, useValue: mockData}
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

  describe('Filtering', () => {
    beforeEach(() => {
      component.allKanji.set([
        kanjiFixture('日', ['day', 'sun'], ['ニチ', 'ジツ'], ['ひ', 'か'], 4),
        kanjiFixture('本', ['book', 'origin'], ['ホン'], ['もと'], 5),
        kanjiFixture('語', ['word', 'language'], ['ゴ'], ['かた'], 14),
        kanjiFixture('水', ['water'], ['スイ'], ['みず'], 4)
      ]);
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

      // Should only find the kanji that exist in mock data (日, 本)
      expect(component.paginatedKanji()).toHaveLength(2);
      const ids = component.paginatedKanji().map(k => k.id);
      expect(ids).toContain('日');
      expect(ids).toContain('本');
    });
  });
});
