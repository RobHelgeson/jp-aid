import {inject, Injectable, signal} from '@angular/core';
import {BreadcrumbNodeType, NavigationState, PropertyType} from '@jp-aid/shared-interfaces';
import Graphology from 'graphology';
import Sigma, {Camera} from 'sigma';
import {EdgeLineProgram, NodeCircleProgram} from 'sigma/rendering';

import {MockData} from '../mock-data.service';

@Injectable({providedIn: 'root'})
export class GraphService {
  private sigmaInstance?: Sigma;
  private graphologyInstance?: Graphology;
  private camera?: Camera;
  private mockData = inject(MockData);
  private history = signal<NavigationState[]>([]);

  public nodeClicked = signal<{id: string; type: BreadcrumbNodeType} | null>(null);

  initialize(container: HTMLElement): void {
    this.graphologyInstance = new Graphology();
    this.sigmaInstance = new Sigma(this.graphologyInstance, container, {
      nodeProgramClasses: {
        [BreadcrumbNodeType.KANJI]: NodeCircleProgram,
        [BreadcrumbNodeType.FEATURE]: NodeCircleProgram
      },
      edgeProgramClasses: {
        default: EdgeLineProgram
      },
      labelColor: {
        attribute: 'color',
        color: '#000000'
      }
    });

    this.camera = this.sigmaInstance.getCamera();

    this.sigmaInstance.on('clickNode', e => {
      const type = this.getNodeAttribute(e.node, 'type');
      this.nodeClicked.set({id: e.node, type});
    });
  }

  updateGraph(nodeId: string, property: PropertyType): void {
    if (!this.graphologyInstance || !this.sigmaInstance) {
      console.error('GraphService not initialized.');
      return;
    }

    this.graphologyInstance.clear();
    const graphData = this.mockData.getGraphData(nodeId, property);

    graphData.nodes.forEach(node => this.graphologyInstance?.addNode(node.id, {...node}));
    graphData.edges.forEach(edge => this.graphologyInstance?.addEdge(edge.source, edge.target, {...edge}));

    this.history.update(currentHistory => [...currentHistory, {nodeId, property}]);

    this.sigmaInstance.refresh();
    this.resetGraph();
  }

  resetToOrigin(nodeId: string, property: PropertyType): void {
    this.history.set([]);
    this.updateGraph(nodeId, property);
  }

  navigateToState(nodeId: string): void {
    const history = this.history();
    const index = history.findIndex(state => state.nodeId === nodeId);
    if (index !== -1) {
      const newHistory = history.slice(0, index);
      this.history.set(newHistory);
      const state = history[index];
      this.updateGraph(state.nodeId, state.property);
    }
  }

  getHistory(): NavigationState[] {
    return this.history();
  }

  getNodeAttribute(nodeId: string, attribute: string): BreadcrumbNodeType {
    return this.graphologyInstance?.getNodeAttribute(nodeId, attribute);
  }

  zoomIn = (): Promise<void> | undefined => this.camera?.animatedZoom({duration: 500});

  zoomOut = (): Promise<void> | undefined => this.camera?.animatedUnzoom({duration: 500});

  resetGraph = (): Promise<void> | undefined => this.camera?.animate({x: 0.5, y: 0.5, ratio: 1, angle: 0}, {duration: 500});

  destroy(): void {
    this.sigmaInstance?.kill();
    this.graphologyInstance?.clear();
    this.history.set([]);
  }
}
