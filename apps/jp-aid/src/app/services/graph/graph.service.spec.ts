import {TestBed} from '@angular/core/testing';
import Graphology from 'graphology';
import Sigma from 'sigma';

import {MockData} from '../mock-data.service';
import {GraphService} from './graph.service';

jest.mock('graphology', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        addNode: jest.fn(),
        addEdge: jest.fn(),
        clear: jest.fn()
      };
    })
  };
});

jest.mock('sigma', () => {
  const mockCamera = {
    animatedZoom: jest.fn(),
    getZoom: jest.fn(() => 1),
    animate: jest.fn()
  };
  const mockSigmaInstance = {
    setGraph: jest.fn(),
    kill: jest.fn(),
    getCamera: jest.fn(() => mockCamera),
    on: jest.fn(),
    refresh: jest.fn()
  };
  return {
    __esModule: true,
    default: jest.fn(() => mockSigmaInstance)
  };
});

jest.mock('sigma/rendering', () => {
  return {
    __esModule: true,
    EdgeLineProgram: jest.fn(),
    NodeCircleProgram: jest.fn()
  };
});

describe('GraphService', () => {
  let service: GraphService;
  let mockMockData: Partial<MockData>;
  let sigmaInstance: Sigma;
  let graphologyInstance: Graphology;

  beforeEach(() => {
    mockMockData = {
      getGraphData: jest.fn(() => ({nodes: [], edges: []}))
    };

    TestBed.configureTestingModule({
      providers: [GraphService, {provide: MockData, useValue: mockMockData}]
    });
    service = TestBed.inject(GraphService);

    sigmaInstance = (Sigma as jest.Mock).mock.results[0].value;
    graphologyInstance = (Graphology as jest.Mock).mock.results[0].value;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize Sigma and Graphology', () => {
    const container = document.createElement('div');
    service.initialize(container);
    expect(Graphology).toHaveBeenCalled();
    expect(Sigma).toHaveBeenCalledWith(graphologyInstance, container, expect.any(Object));
  });

  it('should update graph', () => {
    const container = document.createElement('div');
    service.initialize(container);
    service.updateGraph('testKanjiId', 10, 20);
    expect(graphologyInstance.clear).toHaveBeenCalled();
    expect(mockMockData.getGraphData).toHaveBeenCalledWith('testKanjiId');
    expect(sigmaInstance.refresh).toHaveBeenCalled();
  });

  it('should call zoomIn', () => {
    const container = document.createElement('div');
    service.initialize(container);
    service.zoomIn();
    expect(sigmaInstance.getCamera().animatedZoom).toHaveBeenCalled();
  });

  it('should call zoomOut', () => {
    const container = document.createElement('div');
    service.initialize(container);
    service.zoomOut();
    expect(sigmaInstance.getCamera().animatedZoom).toHaveBeenCalled();
  });

  it('should call resetGraph', () => {
    const container = document.createElement('div');
    service.initialize(container);
    service.resetGraph();
    expect(sigmaInstance.getCamera().animate).toHaveBeenCalled();
  });

  it('should destroy Sigma and Graphology instances', () => {
    const container = document.createElement('div');
    service.initialize(container);
    service.destroy();
    expect(sigmaInstance.kill).toHaveBeenCalled();
    expect(graphologyInstance.clear).toHaveBeenCalled();
  });

  it('should emit nodeClicked$ event on clickNode', () => {
    const container = document.createElement('div');
    service.initialize(container);
    const spy = jest.spyOn(service.nodeClicked$, 'next');
    (sigmaInstance.on as jest.Mock).mock.calls[0][1]({
      node: 'clickedNodeId'
    });
    expect(spy).toHaveBeenCalledWith('clickedNodeId');
  });
});
