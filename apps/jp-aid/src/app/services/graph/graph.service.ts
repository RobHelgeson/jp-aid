

import {inject, Injectable, signal} from '@angular/core';
import {GraphEdge, GraphNode, NodeType, BreadcrumbItem, PropertyType} from '@jp-aid/shared-interfaces';
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
  public selectedPropertyType = signal<PropertyType | null>(null);
  public breadcrumbHistory = signal<BreadcrumbItem[]>([]);
  public currentGraphState = signal<any>(null);

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

    // Save current state before updating
    this.saveCurrentState();

    this.graphologyInstance.clear();

    const graphData = this.mockData.getGraphData(kanjiId);

    // Apply limits to nodes and edges
    const limitedNodes = graphData.nodes.slice(0, maxNodes);
    const limitedEdges = graphData.edges.slice(0, maxEdges);

    limitedNodes.forEach((node: GraphNode) => this.graphologyInstance?.addNode(node.id, {...node}));
    limitedEdges.forEach((edge: GraphEdge) => this.graphologyInstance?.addEdge(edge.source, edge.target, {...edge}));

    this.sigmaInstance.refresh();
  }

  filterGraphByProperty(propertyType: PropertyType): void {
    if (!this.sigmaInstance || !this.graphologyInstance || !this.selectedPropertyType) {
      console.error('GraphService not initialized.');
      return;
    }

    // Save current state before filtering
    this.saveCurrentState();

    // Update the selected property type
    this.selectedPropertyType.set(propertyType);

    const graphData = this.mockData.getGraphDataByProperty(propertyType);
    this.graphologyInstance.clear();

    // Apply limits to nodes and edges
    const limitedNodes = graphData.nodes.slice(0, 20); // Adjust limit as needed
    const limitedEdges = graphData.edges.slice(0, 50); // Adjust limit as needed

    limitedNodes.forEach((node: GraphNode) => this.graphologyInstance?.addNode(node.id, {...node}));
    limitedEdges.forEach((edge: GraphEdge) => this.graphologyInstance?.addEdge(edge.source, edge.target, {...edge}));

    this.sigmaInstance.refresh();
  }

  saveCurrentState(): void {
    if (this.graphologyInstance && this.camera) {
      const state = {
        nodes: Array.from(this.graphologyInstance.nodes()),
        edges: Array.from(this.graphologyInstance.edges()),
        camera: { ...this.camera }
      };
      this.currentGraphState.set(state);
    }
  }

  restoreGraphState(): void {
    if (!this.currentGraphState || !this.graphologyInstance || !this.sigmaInstance) {
      console.error('No graph state to restore.');
      return;
    }

    const { nodes, edges, camera } = this.currentGraphState();

    // Clear and repopulate the graph
    this.graphologyInstance.clear();
    nodes.forEach(nodeId => {
      const node = this.mockData.getNodeById(nodeId);
      if (node) {
        this.graphologyInstance.addNode(node.id, { ...node });
      }
    });

    edges.forEach(edge => {
      const [source, target] = edge;
      const edgeData = this.mockData.getEdgeData(source, target);
      if (edgeData) {
        this.graphologyInstance.addEdge(source, target, { ...edgeData });
      }
    });

    // Restore camera position
    if (camera && this.camera) {
      this.camera.animate(camera, { duration: 500 });
    }

    this.sigmaInstance.refresh();
  }

  resetToOrigin(): void {
    if (!this.graphologyInstance || !this.sigmaInstance) {
      console.error('GraphService not initialized.');
      return;
    }

    // Clear history and reset to initial state
    this.breadcrumbHistory.set([]);
    this.selectedPropertyType.set(null);

    const graphData = this.mockData.getInitialGraphData();
    this.graphologyInstance.clear();

    // Apply limits to nodes and edges
    const limitedNodes = graphData.nodes.slice(0, 20); // Adjust limit as needed
    const limitedEdges = graphData.edges.slice(0, 50); // Adjust limit as needed

    limitedNodes.forEach((node: GraphNode) => this.graphologyInstance?.addNode(node.id, {...node}));
    limitedEdges.forEach((edge: GraphEdge) => this.graphologyInstance?.addEdge(edge.source, edge.target, {...edge}));

    // Reset camera
    if (this.camera) {
      this.camera.animate({ x: 0.5, y: 0.5, ratio: 1, angle: 0 }, { duration: 500 });
    }

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

