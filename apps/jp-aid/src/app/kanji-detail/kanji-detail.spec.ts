import {signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {GraphEdge, GraphNode, Kanji, KanjiNode, NodeType, PrimitiveNode, RadicalNode} from '@jp-aid/shared-interfaces';
import {
  graphEdgeFixture,
  kanjiFixture,
  kanjiNodeFixture,
  primitiveNodeFixture,
  radicalNodeFixture
} from '@jp-aid/shared-interfaces/testing';
import {BehaviorSubject, Observable} from 'rxjs';

import {GraphService} from '../services/graph/graph.service';
import {MockData} from '../services/mock-data.service';
import {KanjiDetail} from './kanji-detail';

jest.mock('graphology', () => ({}));
jest.mock('sigma', () => ({}));
jest.mock('sigma/rendering', () => ({}));

describe('KanjiDetail', () => {
  let component: KanjiDetail;
  let fixture: ComponentFixture<KanjiDetail>;
  let mockActivatedRoute: {params: Observable<Params>; queryParams: Observable<Params>};
  let mockRouter: {navigate: jest.Mock};
  let mockData: {
    getKanji: jest.Mock;
    getGraphData: jest.Mock;
    getExampleWords: jest.Mock;
    setSearchResults: jest.Mock;
    getSearchResults: jest.Mock;
    updateCurrentKanji: jest.Mock;
    getPreviousKanji: jest.Mock;
    getNextKanji: jest.Mock;
    hasPreviousKanji: jest.Mock;
    hasNextKanji: jest.Mock;
  };
  let mockGraphService: Partial<GraphService>;
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
      getKanji: jest.fn(),
      getGraphData: jest.fn(),
      getExampleWords: jest.fn(),
      setSearchResults: jest.fn(),
      getSearchResults: jest.fn(),
      updateCurrentKanji: jest.fn(),
      getPreviousKanji: jest.fn(),
      getNextKanji: jest.fn(),
      hasPreviousKanji: jest.fn(),
      hasNextKanji: jest.fn()
    };
    mockGraphService = {
      initialize: jest.fn(),
      updateGraph: jest.fn(),
      zoomIn: jest.fn(),
      zoomOut: jest.fn(),
      resetGraph: jest.fn(),
      destroy: jest.fn(),
      nodeClicked: signal(null),
      resetToOrigin: jest.fn(),
      navigateToState: jest.fn(),
      navigateBack: jest.fn(),
      navigateForward: jest.fn(),
      canNavigateBack: jest.fn().mockReturnValue(false),
      canNavigateForward: jest.fn().mockReturnValue(false),
      getHistory: jest.fn().mockReturnValue([]),
      getNodeAttribute: jest.fn(),
      handleNodeTraversal: jest.fn(),
      nodeTraversed: {pipe: jest.fn().mockReturnValue({subscribe: jest.fn()})}
    };

    // Setup mock data
    mockData.getKanji.mockReturnValue([
      kanjiFixture('語', ['word', 'language'], ['ゴ'], ['かた(る)'], 14),
      kanjiFixture('日', ['day', 'sun'], ['ニチ', 'ジツ'], ['ひ', 'か'], 4),
      kanjiFixture('水', ['water'], ['スイ'], ['みず'], 4),
      kanjiFixture('火', ['fire'], ['カ'], ['ひ'], 4),
      kanjiFixture('人', ['person'], ['ジン', 'ニン'], ['ひと'], 2)
    ]);

    mockData.getGraphData.mockImplementation((kanjiId: string) => {
      const nodes: GraphNode[] = [];
      const edges: GraphEdge[] = [];

      const kanji = mockData.getKanji().find((k: Kanji) => k.id === kanjiId);
      if (!kanji) {
        return {nodes, edges};
      }

      const kanjiNode: KanjiNode = kanjiNodeFixture(
        kanji.id,
        kanji.id,
        0,
        0,
        20,
        '#FF0000',
        NodeType.Kanji,
        kanji.meaning.join(', '),
        kanji.onReadings,
        kanji.kunReadings,
        kanji.strokeCount
      );
      nodes.push(kanjiNode);

      // Mock radicals
      const radical1: RadicalNode = radicalNodeFixture('言', '言', -1, 1, 10, '#00FF00', NodeType.Radical, 7, ['speech']);
      nodes.push(radical1);
      edges.push(graphEdgeFixture(kanji.id, radical1.id, 2, '#0000FF', 'has radical'));

      // Mock primitives
      const primitive1: PrimitiveNode = primitiveNodeFixture('五', '五', 1, 1, 10, '#FFFF00', NodeType.Primitive, 'five');
      nodes.push(primitive1);
      edges.push(graphEdgeFixture(kanji.id, primitive1.id, 2, '#0000FF', 'has primitive'));

      const primitive2: PrimitiveNode = primitiveNodeFixture('口', '口', 1, -1, 10, '#FFFF00', NodeType.Primitive, 'mouth');
      nodes.push(primitive2);
      edges.push(graphEdgeFixture(kanji.id, primitive2.id, 2, '#0000FF', 'has primitive'));

      // Mock related Kanji
      const relatedKanji1 = mockData.getKanji().find((k: Kanji) => k.id === '日');
      if (relatedKanji1) {
        const relatedKanjiNode1: KanjiNode = kanjiNodeFixture(
          relatedKanji1.id,
          relatedKanji1.id,
          -2,
          0,
          15,
          '#FF0000',
          NodeType.Kanji,
          relatedKanji1.meaning.join(', '),
          relatedKanji1.onReadings,
          relatedKanji1.kunReadings,
          relatedKanji1.strokeCount
        );
        nodes.push(relatedKanjiNode1);
        edges.push(graphEdgeFixture(kanji.id, relatedKanjiNode1.id, 2, '#0000FF', 'related'));
      }

      return {nodes, edges};
    });

    // Setup example words mock
    mockData.getExampleWords.mockImplementation((kanjiId: string) => {
      const exampleWordsMap: Record<string, Array<{kanji: string; reading: string; meaning: string}>> = {
        水: [
          {kanji: '水曜日', reading: 'すいようび', meaning: 'Wednesday'},
          {kanji: '飲み物', reading: 'のみもの', meaning: 'beverage'},
          {kanji: '水道', reading: 'すいどう', meaning: 'water supply'}
        ],
        火: [
          {kanji: '火曜日', reading: 'かようび', meaning: 'Tuesday'},
          {kanji: '火事', reading: 'かじ', meaning: 'fire'},
          {kanji: '花火', reading: 'はなび', meaning: 'fireworks'}
        ]
      };
      return exampleWordsMap[kanjiId] || [];
    });

    // Setup navigation mocks
    mockData.getPreviousKanji.mockReturnValue(kanjiFixture('日', ['day', 'sun'], ['ニチ', 'ジツ'], ['ひ', 'か'], 4));
    mockData.getNextKanji.mockReturnValue(kanjiFixture('火', ['fire'], ['カ'], ['ひ'], 4));
    mockData.hasPreviousKanji.mockReturnValue(true);
    mockData.hasNextKanji.mockReturnValue(true);
    mockData.getSearchResults.mockReturnValue([]);

    await TestBed.configureTestingModule({
      imports: [KanjiDetail, NoopAnimationsModule],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: Router, useValue: mockRouter},
        {provide: MockData, useValue: mockData},
        {provide: GraphService, useValue: mockGraphService}
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

    // Check if stroke count is displayed in the display card title
    const subtitle = compiled.querySelector('.kanji-display-card mat-card-subtitle');
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
    const kanjiCharacters = compiled.querySelectorAll('.kanji-character');
    // Should have 3 font renderings
    expect(kanjiCharacters.length).toBe(3);
    kanjiCharacters.forEach((char: HTMLElement) => {
      expect(char.textContent).toContain('火');
    });

    const meanings = compiled.querySelectorAll('.meanings-section mat-chip');
    expect(meanings[0]?.textContent).toContain('fire');
  });

  describe('Navigation Controls', () => {
    it('should display navigation buttons with correct labels', () => {
      const compiled = fixture.nativeElement;

      const previousButton = compiled.querySelector('button[aria-label="Previous kanji"]');
      expect(previousButton).toBeTruthy();
      expect(previousButton.textContent).toContain('日'); // Previous kanji character

      const nextButton = compiled.querySelector('button[aria-label="Next kanji"]');
      expect(nextButton).toBeTruthy();
      expect(nextButton.textContent).toContain('火'); // Next kanji character
    });

    it('should disable previous button when no previous kanji is available', () => {
      // Reset the mocks to return appropriate values
      mockData.hasPreviousKanji.mockReturnValue(false);
      mockData.getPreviousKanji.mockReturnValue(null);

      // Create a fresh component instance with updated mocks
      const freshFixture = TestBed.createComponent(KanjiDetail);
      freshFixture.detectChanges();

      const previousButton = freshFixture.nativeElement.querySelector('button[aria-label="Previous kanji"]');
      expect(previousButton.disabled).toBe(true);
    });

    it('should disable next button when no next kanji is available', () => {
      // Reset the mocks to return appropriate values
      mockData.hasNextKanji.mockReturnValue(false);
      mockData.getNextKanji.mockReturnValue(null);

      // Create a fresh component instance with updated mocks
      const freshFixture = TestBed.createComponent(KanjiDetail);
      freshFixture.detectChanges();

      const nextButton = freshFixture.nativeElement.querySelector('button[aria-label="Next kanji"]');
      expect(nextButton.disabled).toBe(true);
    });

    it('should navigate to previous kanji when previous button is clicked', () => {
      const previousButton = fixture.nativeElement.querySelector('button[aria-label="Previous kanji"]');
      previousButton.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/kanji', '日'], {queryParams: {q: 'water'}});
    });

    it('should navigate to next kanji when next button is clicked', () => {
      const nextButton = fixture.nativeElement.querySelector('button[aria-label="Next kanji"]');
      nextButton.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/kanji', '火'], {queryParams: {q: 'water'}});
    });

    it('should not navigate when previous button is clicked and no previous kanji exists', () => {
      mockData.getPreviousKanji.mockReturnValue(null);
      mockData.hasPreviousKanji.mockReturnValue(false);
      fixture.detectChanges();

      const previousButton = fixture.nativeElement.querySelector('button[aria-label="Previous kanji"]');
      previousButton.click();

      // Should not navigate since there's no previous kanji
      expect(mockRouter.navigate).not.toHaveBeenCalledWith(['/kanji', null], expect.any(Object));
    });

    it('should not navigate when next button is clicked and no next kanji exists', () => {
      mockData.getNextKanji.mockReturnValue(null);
      mockData.hasNextKanji.mockReturnValue(false);
      fixture.detectChanges();

      const nextButton = fixture.nativeElement.querySelector('button[aria-label="Next kanji"]');
      nextButton.click();

      // Should not navigate since there's no next kanji
      expect(mockRouter.navigate).not.toHaveBeenCalledWith(['/kanji', null], expect.any(Object));
    });

    it('should preserve search query in navigation', () => {
      queryParamsSubject.next({q: 'custom search'});
      fixture.detectChanges();

      const nextButton = fixture.nativeElement.querySelector('button[aria-label="Next kanji"]');
      nextButton.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/kanji', '火'], {queryParams: {q: 'custom search'}});
    });

    it('should update search results context when kanji ID changes', () => {
      // Change route parameter
      paramsSubject.next(kanjiFixture('火', ['fire'], ['カ'], ['ひ'], 4));
      fixture.detectChanges();

      expect(mockData.updateCurrentKanji).toHaveBeenCalledWith('火');
    });

    it('should initialize search results on component load when no existing context', () => {
      // With no existing search results, should set minimal context with current kanji
      expect(mockData.getSearchResults).toHaveBeenCalled();
      expect(mockData.setSearchResults).toHaveBeenCalledWith(
        [expect.objectContaining({id: '水'})],
        '水'
      );
    });

    it('should not override existing search results when navigated from KanjiResults', () => {
      // Reset mocks and create new component with existing search results
      mockData.setSearchResults.mockClear();
      mockData.getSearchResults.mockReturnValue([
        kanjiFixture('日', ['day'], [], [], 4),
        kanjiFixture('本', ['book'], [], [], 5),
        kanjiFixture('水', ['water'], [], [], 4)
      ]);

      const freshFixture = TestBed.createComponent(KanjiDetail);
      freshFixture.detectChanges();

      expect(mockData.setSearchResults).not.toHaveBeenCalled();
    });
  });

  describe('Enhanced Display Features', () => {
    it('should display kanji prominently in multiple font renderings', () => {
      const compiled = fixture.nativeElement;

      // Check for three font renderings
      const fontRenderings = compiled.querySelectorAll('.font-rendering');
      expect(fontRenderings.length).toBe(3);

      // Check serif font rendering
      const serifFontRendering = compiled.querySelector('.serif-font .kanji-character');
      expect(serifFontRendering).toBeTruthy();
      expect(serifFontRendering?.textContent).toContain('水');

      // Check sans font rendering
      const sansFontRendering = compiled.querySelector('.sans-font .kanji-character');
      expect(sansFontRendering).toBeTruthy();
      expect(sansFontRendering?.textContent).toContain('水');

      // Check handwritten font rendering
      const handwrittenFontRendering = compiled.querySelector('.handwritten-font .kanji-character');
      expect(handwrittenFontRendering).toBeTruthy();
      expect(handwrittenFontRendering?.textContent).toContain('水');
    });

    it('should display font labels for each rendering', () => {
      const compiled = fixture.nativeElement;

      const fontLabels = compiled.querySelectorAll('.font-label');
      expect(fontLabels.length).toBe(3);

      expect(fontLabels[0]?.textContent).toContain('Serif');
      expect(fontLabels[1]?.textContent).toContain('Sans');
      expect(fontLabels[2]?.textContent).toContain('Handwritten');
    });

    it('should display example words when available', () => {
      const compiled = fixture.nativeElement;

      const exampleWordsSection = compiled.querySelector('.example-words-section');
      expect(exampleWordsSection).toBeTruthy();

      const exampleWords = compiled.querySelectorAll('.example-word');
      expect(exampleWords.length).toBeGreaterThan(0);

      // Check first example word structure
      const firstWord = exampleWords[0];
      expect(firstWord.querySelector('.word-kanji')).toBeTruthy();
      expect(firstWord.querySelector('.word-reading')).toBeTruthy();
      expect(firstWord.querySelector('.word-meaning')).toBeTruthy();
    });

    it('should implement responsive two-column layout', () => {
      const compiled = fixture.nativeElement;

      // Check for layout structure
      const kanjiLayout = compiled.querySelector('.kanji-layout');
      expect(kanjiLayout).toBeTruthy();

      const infoColumn = compiled.querySelector('.kanji-info-column');
      expect(infoColumn).toBeTruthy();

      const graphColumn = compiled.querySelector('.graph-column');
      expect(graphColumn).toBeTruthy();

      // Check that both display and data cards are present
      const displayCard = compiled.querySelector('.kanji-display-card');
      expect(displayCard).toBeTruthy();

      const dataCard = compiled.querySelector('.kanji-data-card');
      expect(dataCard).toBeTruthy();
    });

    it('should maintain accessibility attributes and semantic HTML', () => {
      const compiled = fixture.nativeElement;

      // Check for proper heading structure
      const headings = compiled.querySelectorAll('h3');
      expect(headings.length).toBeGreaterThan(0);

      // Check that font renderings have descriptive labels
      const fontLabels = compiled.querySelectorAll('.font-label');
      fontLabels.forEach((label: HTMLElement) => {
        expect(label.textContent?.trim()).toBeTruthy();
      });

      // Check for proper card structure
      const cards = compiled.querySelectorAll('mat-card');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should display graph in right column', () => {
      const compiled = fixture.nativeElement;

      const graph = compiled.querySelector('kl-graph-visualization');
      expect(graph).toBeTruthy();
    });

    it('should handle kanji without example words gracefully', () => {
      // Update mock data to include the test kanji
      mockData.getKanji.mockReturnValue([
        kanjiFixture('水', ['water'], ['スイ'], ['みず'], 4),
        kanjiFixture('火', ['fire'], ['カ'], ['ひ'], 4),
        kanjiFixture('虎', ['tiger'], ['コウ'], ['トラ'], 8)
      ]);

      // Change to a kanji that doesn't have example words in our mock data
      paramsSubject.next(kanjiFixture('虎', ['tiger'], ['コウ'], ['トラ'], 8));
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const exampleWords = compiled.querySelectorAll('.example-word');
      // Should show 0 example words but section should still exist
      expect(exampleWords.length).toBe(0);

      const exampleWordsSection = compiled.querySelector('.example-words-section');
      expect(exampleWordsSection).toBeTruthy();
    });

    it('should integrate with existing navigation functionality', () => {
      const compiled = fixture.nativeElement;

      // Check that return button is still present and functional
      const returnButton = compiled.querySelector('button[aria-label="Return to results"]');
      expect(returnButton).toBeTruthy();

      // Ensure new layout doesn't break navigation
      returnButton?.click();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/search'], {queryParams: {q: 'water'}});
    });
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
