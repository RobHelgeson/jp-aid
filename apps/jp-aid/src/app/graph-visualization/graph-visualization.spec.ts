import {ComponentRef, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GraphService} from '../services/graph/graph.service';
import {GraphVisualization} from './graph-visualization';
import { BreadcrumbItem, PropertyType } from '@jp-aid/shared-interfaces';

jest.mock('graphology', () => ({}));
jest.mock('sigma', () => ({}));
jest.mock('sigma/rendering', () => ({}));

describe('GraphVisualization', () => {
  let component: GraphVisualization;
  let componentRef: ComponentRef<GraphVisualization>;
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
      nodeClicked: signal<string>(''),
      selectedPropertyType: signal<PropertyType | null>(null),
      breadcrumbHistory: signal<BreadcrumbItem[]>([]),
      resetToOrigin: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [GraphVisualization],
      providers: [{provide: GraphService, useValue: mockGraphService}]
    }).compileComponents();

    fixture = TestBed.createComponent(GraphVisualization);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize graph service on AfterViewInit', () => {
    componentRef.setInput('kanjiId', '語');
    fixture.detectChanges();
    expect(mockGraphService.initialize).toHaveBeenCalledWith(component.graphContainer.nativeElement);
    expect(mockGraphService.updateGraph).toHaveBeenCalledWith('語', 50, 100);
  });

  it('should update graph on kanjiId change', () => {
    componentRef.setInput('kanjiId', '語');
    fixture.detectChanges(); // Initial call
    jest.clearAllMocks(); // Clear mocks after initial call

    componentRef.setInput('kanjiId', '日');
    fixture.detectChanges();
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

  it('should call resetToOrigin on button click', () => {
    // Use Angular's TestBed utilities to trigger the click event
    const resetButton = fixture.nativeElement.querySelector('[aria-label="Reset to Origin"]');

    // Create a mock DOM event
    const event = new MouseEvent('click', { bubbles: true });

    // Dispatch the event on the button element
    resetButton.dispatchEvent(event);

    expect(mockGraphService.resetToOrigin).toHaveBeenCalled();
  });

  it('should destroy graph service on component destroy', () => {
    component.ngOnDestroy();
    expect(mockGraphService.destroy).toHaveBeenCalled();
  });

  it('should log clicked node from service', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    mockGraphService.nodeClicked?.set('testNodeId');
    fixture.detectChanges();
    expect(consoleSpy).toHaveBeenCalledWith('Clicked node from service:', 'testNodeId');
  });
});
