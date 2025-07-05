import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Subject} from 'rxjs';

import {GraphService} from '../services/graph/graph.service';
import {GraphVisualization} from './graph-visualization';

jest.mock('graphology', () => ({}));
jest.mock('sigma', () => ({}));
jest.mock('sigma/rendering', () => ({}));

describe('GraphVisualization', () => {
  let component: GraphVisualization;
  let fixture: ComponentFixture<GraphVisualization>;
  let mockGraphService: Partial<GraphService>;

  beforeEach(async () => {
    mockGraphService = {
      initialize: jest.fn(),
      updateGraph: jest.fn(),
      zoomIn: jest.fn(),
      zoomOut: jest.fn(),
      resetGraph: jest.fn(),
      destroy: jest.fn(),
      nodeClicked$: new Subject<string>()
    };

    await TestBed.configureTestingModule({
      imports: [GraphVisualization],
      providers: [{provide: GraphService, useValue: mockGraphService}]
    }).compileComponents();

    fixture = TestBed.createComponent(GraphVisualization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize graph service on AfterViewInit', () => {
    component.kanjiId = '語';
    fixture.detectChanges();
    expect(mockGraphService.initialize).toHaveBeenCalledWith(component.graphContainer.nativeElement);
    expect(mockGraphService.updateGraph).toHaveBeenCalledWith('語', 50, 100);
  });

  it('should update graph on kanjiId change', () => {
    component.kanjiId = '語';
    fixture.detectChanges(); // Initial call
    jest.clearAllMocks(); // Clear mocks after initial call

    component.kanjiId = '日';
    fixture.detectChanges();
    component.ngAfterViewInit();
    expect(mockGraphService.updateGraph).toHaveBeenCalledWith('日', 50, 100);
  });

  it('should call zoomIn on button click', () => {
    const zoomButton = fixture.nativeElement.querySelector('[aria-label="Zoom In"]');
    zoomButton.click();
    expect(mockGraphService.zoomIn).toHaveBeenCalled();
  });

  it('should call zoomOut on button click', () => {
    const zoomOutButton = fixture.nativeElement.querySelector('[aria-label="Zoom Out"]');
    zoomOutButton.click();
    expect(mockGraphService.zoomOut).toHaveBeenCalled();
  });

  it('should call resetGraph on button click', () => {
    const resetButton = fixture.nativeElement.querySelector('[aria-label="Reset Graph View"]');
    resetButton.click();
    expect(mockGraphService.resetGraph).toHaveBeenCalled();
  });

  it('should destroy graph service on component destroy', () => {
    component.ngOnDestroy();
    expect(mockGraphService.destroy).toHaveBeenCalled();
  });

  it('should log clicked node from service', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    mockGraphService.nodeClicked$?.next('testNodeId');
    expect(consoleSpy).toHaveBeenCalledWith('Clicked node from service:', 'testNodeId');
  });
});
