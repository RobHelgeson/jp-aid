import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Kanji, kanjiFixture} from '@jp-aid/shared-interfaces';
import {BehaviorSubject, Observable} from 'rxjs';

import {MockData} from '../services/mock-data';
import {KanjiDetail} from './kanji-detail';

describe('KanjiDetail', () => {
  let component: KanjiDetail;
  let fixture: ComponentFixture<KanjiDetail>;
  let mockActivatedRoute: {params: Observable<Params>; queryParams: Observable<Params>};
  let mockRouter: {navigate: jest.Mock};
  let mockData: {getKanji: jest.Mock};
  let paramsSubject: BehaviorSubject<Kanji>;
  let queryParamsSubject: BehaviorSubject<Params>;

  beforeEach(async () => {
    // Create spies for dependencies
    paramsSubject = new BehaviorSubject<Kanji>(kanjiFixture('水', ['water'], ['スイ'], ['みず'], 4));
    queryParamsSubject = new BehaviorSubject<Params>({q: 'water'});
    mockActivatedRoute = {
      params: paramsSubject.asObservable(),
      queryParams: queryParamsSubject.asObservable()
    };
    mockRouter = {
      navigate: jest.fn()
    };
    mockData = {
      getKanji: jest.fn()
    };

    // Setup mock data
    mockData.getKanji.mockReturnValue([
      kanjiFixture('水', ['water'], ['スイ'], ['みず'], 4),
      kanjiFixture('火', ['fire'], ['カ'], ['ひ'], 4)
    ]);

    await TestBed.configureTestingModule({
      imports: [KanjiDetail, NoopAnimationsModule],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: Router, useValue: mockRouter},
        {provide: MockData, useValue: mockData}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(KanjiDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract kanji ID from route parameters', () => {
    expect(component['kanjiId']()).toBe('水');
  });

  it('should display kanji information when kanji is found', () => {
    const compiled = fixture.nativeElement;

    // Check if kanji character is displayed
    const kanjiCharacter = compiled.querySelector('.kanji-character');
    expect(kanjiCharacter?.textContent).toContain('水');

    // Check if stroke count is displayed
    const subtitle = compiled.querySelector('mat-card-subtitle');
    expect(subtitle?.textContent).toContain('4 strokes');

    // Check if meanings are displayed
    const meanings = compiled.querySelectorAll('.meanings-section mat-chip');
    expect(meanings.length).toBe(1);
    expect(meanings[0]?.textContent).toContain('water');

    // Check if on readings are displayed
    const onReadings = compiled.querySelectorAll('.readings-section:nth-of-type(2) mat-chip');
    expect(onReadings.length).toBe(1);
    expect(onReadings[0]?.textContent).toContain('スイ');

    // Check if kun readings are displayed
    const kunReadings = compiled.querySelectorAll('.readings-section:nth-of-type(3) mat-chip');
    expect(kunReadings.length).toBe(1);
    expect(kunReadings[0]?.textContent).toContain('みず');
  });

  it('should display "not found" message when kanji is not found', () => {
    // Change route parameter to non-existent kanji
    paramsSubject.next(kanjiFixture('非存在', ['non-existent'], ['非存在'], ['非存在'], 0));
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const notFoundMessage = compiled.querySelector('.not-found p');
    expect(notFoundMessage?.textContent).toContain('Kanji not found');
  });

  it('should navigate back to search when goBack is called', () => {
    const backButton = fixture.nativeElement.querySelector('button[aria-label="Return to results"]');
    backButton.click();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/search'], {queryParams: {q: 'water'}});
  });

  it('should navigate back to search when "Back to Search" button is clicked in not found state', () => {
    // Change route parameter to non-existent kanji
    paramsSubject.next(kanjiFixture('非存在', ['non-existent'], ['非存在'], ['非存在'], 0));
    fixture.detectChanges();

    const backButton = fixture.nativeElement.querySelector('.not-found button');
    backButton.click();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/search'], {queryParams: {q: 'water'}});
  });

  it('should update displayed kanji when route parameter changes', () => {
    // Change route parameter to different kanji
    paramsSubject.next(kanjiFixture('火', ['fire'], ['カ'], ['ひ'], 4));
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const kanjiCharacter = compiled.querySelector('.kanji-character');
    expect(kanjiCharacter?.textContent).toContain('火');

    const meanings = compiled.querySelectorAll('.meanings-section mat-chip');
    expect(meanings[0]?.textContent).toContain('fire');
  });

  describe('Return Navigation Tests', () => {
    it('should render return button with correct text and accessibility attributes', () => {
      const returnButton = fixture.nativeElement.querySelector('button[aria-label="Return to results"]');

      expect(returnButton).toBeTruthy();
      expect(returnButton.textContent).toContain('Return to Results');
      expect(returnButton.getAttribute('aria-label')).toBe('Return to results');
    });

    it('should preserve search query when navigating back to results', () => {
      // Set different query parameter
      queryParamsSubject.next({q: 'fire'});
      fixture.detectChanges();

      const returnButton = fixture.nativeElement.querySelector('button[aria-label="Return to results"]');
      returnButton.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/search'], {queryParams: {q: 'fire'}});
    });

    it('should handle empty search query when navigating back', () => {
      // Set empty query parameter
      queryParamsSubject.next({});
      fixture.detectChanges();

      const returnButton = fixture.nativeElement.querySelector('button[aria-label="Return to results"]');
      returnButton.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/search'], {queryParams: {q: ''}});
    });

    it('should handle direct URL access with no previous search state', () => {
      // Simulate direct URL access with no query params
      queryParamsSubject.next({});
      fixture.detectChanges();

      expect(component['searchQuery']()).toBe('');

      const returnButton = fixture.nativeElement.querySelector('button[aria-label="Return to results"]');
      expect(returnButton).toBeTruthy();
    });

    it('should trigger change detection when return button is clicked', () => {
      const returnButton = fixture.nativeElement.querySelector('button[aria-label="Return to results"]');

      returnButton.click();
      fixture.detectChanges();

      expect(mockRouter.navigate).toHaveBeenCalled();
    });
  });
});
