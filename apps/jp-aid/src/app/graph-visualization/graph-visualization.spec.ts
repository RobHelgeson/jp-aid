import {signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {BreadcrumbItem, BreadcrumbNodeType, PropertyType} from '@jp-aid/shared-interfaces';

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
      resetToOrigin: jest.fn(),
      navigateToState: jest.fn(),
      navigateBack: jest.fn(),
      navigateForward: jest.fn(),
      canNavigateBack: jest.fn().mockReturnValue(false),
      canNavigateForward: jest.fn().mockReturnValue(false),
      getHistory: jest.fn().mockReturnValue([]),
      getNodeAttribute: jest.fn(),
      zoomIn: jest.fn(),
      zoomOut: jest.fn(),
      resetGraph: jest.fn(),
      destroy: jest.fn(),
      nodeClicked: signal(null),
      handleNodeTraversal: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [GraphVisualization, NoopAnimationsModule],
      providers: [{provide: GraphService, useValue: mockGraphService}]
    }).compileComponents();

    fixture = TestBed.createComponent(GraphVisualization);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize graph service on AfterViewInit', () => {
    fixture.componentRef.setInput('kanjiId', '語');
    fixture.detectChanges();
    component.ngAfterViewInit();
    expect(mockGraphService.initialize).toHaveBeenCalledWith(component.graphContainer.nativeElement);
    // The component calls updateGraph (via updateGraphAndBreadcrumbs), not resetToOrigin directly
    expect(mockGraphService.updateGraph).toHaveBeenCalledWith('語', PropertyType.ON_YOMI);
  });

  it('should change property type and update graph', () => {
    fixture.componentRef.setInput('kanjiId', '語');
    fixture.detectChanges();
    jest.clearAllMocks();
    component.onPropertyTypeChange(PropertyType.RADICAL);
    fixture.detectChanges();
    expect(component.selectedPropertyType()).toBe(PropertyType.RADICAL);
    // The component calls updateGraphAndBreadcrumbs which calls updateGraph
    expect(mockGraphService.updateGraph).toHaveBeenCalledWith('語', PropertyType.RADICAL);
  });

  it('should handle breadcrumb click', () => {
    const breadcrumbItem: BreadcrumbItem = {
      nodeId: '日',
      label: '日',
      type: BreadcrumbNodeType.KANJI
    };
    component.onBreadcrumbClick(breadcrumbItem);
    expect(mockGraphService.navigateToState).toHaveBeenCalledWith('日');
  });

  it('should handle reset', () => {
    fixture.componentRef.setInput('kanjiId', '語');
    fixture.detectChanges();
    component.onResetNavigation();
    expect(mockGraphService.resetToOrigin).toHaveBeenCalledWith('語', PropertyType.ON_YOMI);
  });
});
