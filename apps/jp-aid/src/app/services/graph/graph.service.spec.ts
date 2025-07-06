import {TestBed} from '@angular/core/testing';
import Graphology from 'graphology';
import Sigma, {Camera} from 'sigma';

import {MockData} from '../mock-data.service';
import {GraphService} from './graph.service';

jest.mock('graphology', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      addNode: jest.fn(),
      addEdge: jest.fn(),
      clear: jest.fn()
    }))
  };
});

jest.mock('sigma', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      setGraph: jest.fn(),
      kill: jest.fn(),
      getCamera: jest.fn(),
      on: jest.fn(),
      refresh: jest.fn(),
      clickNode: jest.fn()
    }))
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
  let container: HTMLElement;
  let service: GraphService;
  let mockMockData: Partial<MockData>;
  let sigmaInstance: Partial<Sigma>;
  let graphologyInstance: Graphology;
  let camera: Camera;

  beforeEach(() => {
    mockMockData = {
      getGraphData: jest.fn(() => ({nodes: [], edges: []}))
    };

    TestBed.configureTestingModule({
      providers: [GraphService, {provide: MockData, useValue: mockMockData}]
    });
    service = TestBed.inject(GraphService);

    container = document.createElement('div');
    graphologyInstance = new Graphology();
    sigmaInstance = new Sigma(graphologyInstance, container, {});
    camera = {
      animatedZoom: jest.fn(),
      animatedUnzoom: jest.fn(),
      animate: jest.fn()
    } as unknown as Camera;

    sigmaInstance.getCamera = jest.fn(() => camera);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize Sigma and Graphology', () => {
    jest.clearAllMocks();
    service.initialize(container);

    expect(Graphology).toHaveBeenCalled();
    expect(Sigma).toHaveBeenCalledWith(service['graphologyInstance'], container, expect.any(Object));
  });

  it('should update graph', () => {
    service.initialize(container);
    // @ts-expect-error - we need to spy on the graphologyInstance
    service.graphologyInstance = graphologyInstance;
    // @ts-expect-error - we need to spy on the sigmaInstance
    service.sigmaInstance = sigmaInstance;
    service.updateGraph('testKanjiId', 10, 20);

    expect(graphologyInstance.clear).toHaveBeenCalled();
    expect(mockMockData.getGraphData).toHaveBeenCalledWith('testKanjiId');
    expect(sigmaInstance.refresh).toHaveBeenCalled();
  });

  it('should call zoomIn', () => {
    service.initialize(container);
    // @ts-expect-error - we need to spy on the camera
    service.camera = camera;

    service.zoomIn();

    expect(camera.animatedZoom).toHaveBeenCalled();
  });

  it('should call zoomOut', () => {
    service.initialize(container);
    // @ts-expect-error - we need to spy on the camera
    service.camera = camera;

    service.zoomOut();

    expect(camera.animatedUnzoom).toHaveBeenCalled();
  });

  it('should call resetGraph', () => {
    service.initialize(container);
    // @ts-expect-error - we need to spy on the camera
    service.camera = camera;
    service.resetGraph();
    expect(camera.animate).toHaveBeenCalled();
  });

  it('should destroy Sigma and Graphology instances', () => {
    service.initialize(container);
    // @ts-expect-error - we need to spy on the graphologyInstance
    service.graphologyInstance = graphologyInstance;
    // @ts-expect-error - we need to spy on the sigmaInstance
    service.sigmaInstance = sigmaInstance;
    service.destroy();
    expect(sigmaInstance.kill).toHaveBeenCalled();
    expect(graphologyInstance.clear).toHaveBeenCalled();
  });

  it('should emit nodeClicked event on clickNode', () => {
    service.initialize(container);
    // @ts-expect-error - we need to spy on the sigmaInstance
    sigmaInstance = service.sigmaInstance;
    // @ts-expect-error - we need to find the clickNode handler
    const clickNodeHandler = sigmaInstance?.on.mock.calls.find(call => call[0] === 'clickNode');

    const spy = jest.spyOn(service.nodeClicked, 'set');

    clickNodeHandler?.[1]({node: 'clickedNodeId'});

    expect(spy).toHaveBeenCalledWith('clickedNodeId');
  });
});
