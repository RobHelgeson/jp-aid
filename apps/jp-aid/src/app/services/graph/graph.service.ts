import {inject, Injectable, signal} from '@angular/core';
import {GraphEdge, GraphNode, NodeType} from '@jp-aid/shared-interfaces';
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

  public nodeClicked = signal<string>('');

  initialize(container: HTMLElement): void {
    this.graphologyInstance = new Graphology();
    this.sigmaInstance = new Sigma(this.graphologyInstance, container, {
      nodeProgramClasses: {
        [NodeType.Kanji]: NodeCircleProgram,
        [NodeType.Radical]: NodeCircleProgram,
        [NodeType.Primitive]: NodeCircleProgram
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

    this.sigmaInstance.on('clickNode', e => this.nodeClicked.set(e.node));
  }

  updateGraph(kanjiId: string, maxNodes: number, maxEdges: number): void {
    if (!this.graphologyInstance || !this.sigmaInstance) {
      console.error('GraphService not initialized.');
      return;
    }

    this.graphologyInstance.clear();

    const graphData = this.mockData.getGraphData(kanjiId);

    // Apply limits to nodes and edges
    const limitedNodes = graphData.nodes.slice(0, maxNodes);
    const limitedEdges = graphData.edges.slice(0, maxEdges);

    limitedNodes.forEach((node: GraphNode) => this.graphologyInstance?.addNode(node.id, {...node}));
    limitedEdges.forEach((edge: GraphEdge) => this.graphologyInstance?.addEdge(edge.source, edge.target, {...edge}));

    this.sigmaInstance.refresh();
  }

  zoomIn = (): Promise<void> | undefined => this.camera?.animatedZoom({duration: 500});

  zoomOut = (): Promise<void> | undefined => this.camera?.animatedUnzoom({duration: 500});

  resetGraph = (): Promise<void> | undefined => this.camera?.animate({x: 0.5, y: 0.5, ratio: 1, angle: 0}, {duration: 500});

  destroy(): void {
    this.sigmaInstance?.kill();
    this.graphologyInstance?.clear();
  }
}
