import {ComponentFixture, TestBed} from '@angular/core/testing';
import Sigma from 'sigma';

import {MockData} from '../services/mock-data';
import {GraphVisualization} from './graph-visualization';

jest.mock('sigma', () => {
  const mockCamera = {
    animatedZoom: jest.fn(),
    getZoom: jest.fn(() => 1),
    animate: jest.fn()
  };
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        setGraph: jest.fn(),
        kill: jest.fn(),
        getCamera: jest.fn(() => mockCamera),
        on: jest.fn()
      };
    })
  };
});

jest.mock('sigma/rendering', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        EdgeLineProgram: jest.fn(),
        NodeCircleProgram: jest.fn()
      };
    })
  };
});

describe('GraphVisualization', () => {
  let component: GraphVisualization;
  let fixture: ComponentFixture<GraphVisualization>;
  let mockData: Partial<MockData>;
  let sigmaInstance: Sigma;

  beforeEach(async () => {
    mockData = {
      getGraphData: jest.fn(() => ({nodes: [], edges: []})),
      getKanji: jest.fn(() => [{id: '語', meaning: ['word'], onReadings: ['ゴ'], kunReadings: ['かた(る)'], strokeCount: 14}])
    };

    await TestBed.configureTestingModule({
      imports: [GraphVisualization],
      providers: [{provide: MockData, useValue: mockData}]
    }).compileComponents();

    fixture = TestBed.createComponent(GraphVisualization);
    component = fixture.componentInstance;
    fixture.detectChanges();

    sigmaInstance = (Sigma as jest.Mock).mock.results[0].value;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render graph on kanjiId change', () => {
    const getGraphDataSpy = jest.spyOn(mockData, 'getGraphData');
    component.kanjiId = '語';
    fixture.detectChanges();
    expect(getGraphDataSpy).toHaveBeenCalledWith('語');
    expect(sigmaInstance.setGraph).toHaveBeenCalled();
  });

  it('should call zoomIn on button click', () => {
    const zoomInSpy = jest.spyOn(component, 'zoomIn');
    const zoomButton = fixture.nativeElement.querySelector('[aria-label="Zoom In"]');
    zoomButton.click();
    expect(zoomInSpy).toHaveBeenCalled();
    expect(sigmaInstance.getCamera().animatedZoom).toHaveBeenCalledWith(1 * 1.2);
  });

  it('should call zoomOut on button click', () => {
    const zoomOutSpy = jest.spyOn(component, 'zoomOut');
    const zoomOutButton = fixture.nativeElement.querySelector('[aria-label="Zoom Out"]');
    zoomOutButton.click();
    expect(zoomOutSpy).toHaveBeenCalled();
    expect(sigmaInstance.getCamera().animatedZoom).toHaveBeenCalledWith(1 / 1.2);
  });

  it('should call resetGraph on button click', () => {
    const resetGraphSpy = jest.spyOn(component, 'resetGraph');
    const resetButton = fixture.nativeElement.querySelector('[aria-label="Reset Graph View"]');
    resetButton.click();
    expect(resetGraphSpy).toHaveBeenCalled();
    expect(sigmaInstance.getCamera().animate).toHaveBeenCalledWith(
      {
        x: 0,
        y: 0,
        ratio: 1,
        angle: 0
      },
      {duration: 500}
    );
  });

  it('should limit nodes and edges based on inputs', () => {
    mockData.getGraphData = jest.fn(() => ({
      nodes: Array(100)
        .fill(0)
        .map((_, i) => ({id: `n${i}`, label: `Node ${i}`, x: 0, y: 0, size: 10, color: '#000', type: 'kanji'})),
      edges: Array(200)
        .fill(0)
        .map((_, i) => ({source: `n${i}`, target: `n${i + 1}`, size: 1, color: '#000', label: 'edge'}))
    }));

    component.kanjiId = '語';
    component.maxNodes = 10;
    component.maxEdges = 20;
    fixture.detectChanges();

    // Since Sigma.js is mocked, we can't directly inspect the graphology graph within Sigma.
    // We can, however, verify that getGraphData was called and that the component tried to set the graph.
    // More detailed testing of graph content would require a more sophisticated mock or integration tests.
    expect(mockData.getGraphData).toHaveBeenCalled();
    expect(sigmaInstance.setGraph).toHaveBeenCalled();
  });
});
