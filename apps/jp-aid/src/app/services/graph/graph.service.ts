import {EventEmitter, inject, Injectable, signal} from '@angular/core';
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

  // Loading state for graph operations
  public isLoading = signal<boolean>(false);

  public nodeClicked = signal<{id: string; type: BreadcrumbNodeType} | null>(null);
  public currentNodeId = signal<string | undefined>(undefined);

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
      const nodeId = e.node;
      const type = this.getNodeAttribute(nodeId, 'type') as BreadcrumbNodeType | undefined;
      if (nodeId && type) {
        this.currentNodeId.set(nodeId);
        this.nodeClicked.set({id: nodeId, type});
      } else {
        console.warn(`Node ${nodeId} has no valid type attribute`);
      }
    });
  }

  /**
   * Update the graph based on node traversal
   * @param nodeId The ID of the node to focus on
   * @param property The property type to filter by
   * @param isNodeClick Whether this update is from a node click (vs reset)
   * @param maxNodes Optional override for maximum nodes to display
   */
  updateGraph(nodeId: string, property: PropertyType, isNodeClick = false, maxNodes?: number): void {
    if (!this.graphologyInstance || !this.sigmaInstance) {
      console.error('GraphService not initialized.');
      return;
    }

    // Clear the graph and get new data
    this.graphologyInstance.clear();
    // Get graph data with optional node limit override
    let graphData;
    if (maxNodes) {
      // Create a temporary mock data service that respects the node limit
      const tempMockData = new MockData();
      Object.setPrototypeOf(tempMockData, this.mockData); // Inherit methods

      // Limit nodes by filtering after getting all data
      const fullData = this.mockData.getGraphData(nodeId, property);
      if (fullData.nodes.length > maxNodes) {
        // Filter edges to only include those connected to the selected nodes
        const selectedNodeIds = new Set(fullData.nodes.slice(0, maxNodes).map(node => node.id));
        const filteredEdges = fullData.edges.filter(edge => selectedNodeIds.has(edge.source) || selectedNodeIds.has(edge.target));
        graphData = {
          nodes: fullData.nodes.slice(0, maxNodes),
          edges: filteredEdges
        };
      } else {
        graphData = fullData;
      }
    } else {
      graphData = this.mockData.getGraphData(nodeId, property);
    }

    // Add nodes and edges to the graph
    graphData.nodes.forEach(node => this.graphologyInstance?.addNode(node.id, {...node}));
    graphData.edges.forEach(edge => this.graphologyInstance?.addEdge(edge.source, edge.target, {...edge}));

    // Update history and current state
    const newState = {nodeId, property};
    this.history.update(currentHistory => [...currentHistory, newState]);

    if (isNodeClick) {
      const nodeType = this.getNodeAttribute(nodeId, 'type') as BreadcrumbNodeType | undefined;
      // When clicking a node, update the current focus and notify about traversal
      this.currentNodeId.set(nodeId);
      // Center on the clicked node with appropriate zoom based on type
      const centerPromise = this.centerOnNode(nodeId, nodeType);
      if (centerPromise) {
        centerPromise.then(() => {
          // After centering, refresh the graph to ensure proper rendering
          this.sigmaInstance?.refresh();
        });
      } else {
        // If centering fails, still refresh the graph
        this.sigmaInstance?.refresh();
      }
    } else {
      // For reset operations, just refresh the graph
      this.sigmaInstance?.refresh();
      this.resetGraph();
    }
  }

  /**
   * Reset to a specific node and property as the origin state
   * @param nodeId The ID of the node to focus on
   * @param property The property type to filter by
   */
  resetToOrigin(nodeId: string, property: PropertyType): void {
    this.history.set([]);
    this.updateGraph(nodeId, property);
  }

  navigateToState(nodeId: string): void {
    const history = this.history();
    const index = history.findIndex(state => state.nodeId === nodeId);
    if (index !== -1) {
      const newHistory = history.slice(0, index + 1); // Include the target state
      this.history.set(newHistory);
      const state = history[index];
      this.updateGraph(state.nodeId, state.property);
    }
  }

  navigateBack(): void {
    const history = this.history();
    if (history.length > 1) {
      // Go back to previous state
      const newHistory = history.slice(0, -1); // Remove the last state
      this.history.set(newHistory);
      const previousState = history[history.length - 2];
      this.updateGraph(previousState.nodeId, previousState.property);
    }
  }

  navigateForward(): void {
    const history = this.history();
    if (history.length > 1) {
      // Go forward to next state
      const currentIndex = history.length - 2; // Previous index in history
      if (currentIndex >= 0 && currentIndex < history.length - 1) {
        // If we have a valid next state
        const newHistory = history.slice(0, currentIndex + 2); // Include the next state
        this.history.set(newHistory);
        const nextState = history[currentIndex + 1];
        this.updateGraph(nextState.nodeId, nextState.property);
      }
    }
  }

  canNavigateBack(): boolean {
    return this.history().length > 1;
  }

  canNavigateForward(): boolean {
    const history = this.history();
    return history.length > 2 && history.length - 2 < history.length - 1;
  }

  getHistory(): NavigationState[] {
    return this.history();
  }

  getNodeAttribute(nodeId: string, attribute: string): BreadcrumbNodeType | any {
    return this.graphologyInstance?.getNodeAttribute(nodeId, attribute);
  }

  zoomIn = (): Promise<void> | undefined => this.camera?.animatedZoom({duration: 500});

  zoomOut = (): Promise<void> | undefined => this.camera?.animatedUnzoom({duration: 500});

  /**
   * Center the graph on a specific node with appropriate zoom based on type
   * @param nodeId The ID of the node to center on
   * @param nodeType Optional node type for proper zoom level calculation
   */
  centerOnNode(nodeId: string, nodeType?: BreadcrumbNodeType): Promise<void> | undefined {
    if (!this.graphologyInstance || !this.camera) return;

    const node = this.graphologyInstance.getNodeAttributes(nodeId);
    if (node) {
      // Center on the node's position with appropriate zoom based on node type
      let zoomRatio = 1.5; // Default zoom

      // Adjust zoom level based on node type for better visibility
      if (nodeType === BreadcrumbNodeType.KANJI) {
        zoomRatio = 2.0; // Zoom in more for kanji nodes to show details
      } else if (nodeType === BreadcrumbNodeType.FEATURE) {
        zoomRatio = 1.5; // Slightly less zoom for feature nodes
      }

      return this.camera.animate(
        {
          x: node['x'] || 0.5, // Default to center if no position available
          y: node['y'] || 0.5,
          ratio: zoomRatio,
          angle: 0
        },
        {duration: 500}
      );
    }
    return undefined;
  }

  resetGraph = (): Promise<void> | undefined => this.camera?.animate({x: 0.5, y: 0.5, ratio: 1, angle: 0}, {duration: 500});

  /**
   * Get the type of node (kanji or feature) for proper handling
   * @param nodeId The ID of the node to check
   * @returns The node type if available, otherwise undefined
   */
  getNodeType(nodeId: string): BreadcrumbNodeType | undefined {
    return this.getNodeAttribute(nodeId, 'type') as BreadcrumbNodeType;
  }

  /**
   * Handle node traversal with proper context updates and breadcrumb integration
   * @param nodeId The ID of the node to traverse to
   * @param property The current property type being viewed
   */
  handleNodeTraversal(nodeId: string, property: PropertyType): void {
    // Update graph focus on the clicked node
    this.updateGraph(nodeId, property, true);

    // Emit event for parent components to handle navigation updates
    const nodeType = this.getNodeAttribute(nodeId, 'type') as BreadcrumbNodeType | undefined;
    if (nodeType) {
      this.nodeTraversed.emit({nodeId, type: nodeType});
    } else {
      console.warn(`Node ${nodeId} has no valid type attribute`);
    }

    // Additional handling for detail screen update
    this.updateDetailScreen(nodeId, nodeType);
  }

  private updateDetailScreen(nodeId: string, nodeType: BreadcrumbNodeType | undefined): void {
    if (nodeType === BreadcrumbNodeType.KANJI) {
      // Update kanji detail screen
      console.log(`Updating kanji detail screen for node ${nodeId}`);
    } else if (nodeType === BreadcrumbNodeType.FEATURE) {
      // Update feature detail screen
      console.log(`Updating feature detail screen for node ${nodeId}`);
    }
  }

  /**
   * Event emitter for node traversal events
   */
  private _nodeTraversed = new EventEmitter<{nodeId: string; type: BreadcrumbNodeType | undefined}>();
  get nodeTraversed(): EventEmitter<{nodeId: string; type: BreadcrumbNodeType | undefined}> {
    return this._nodeTraversed;
  }

  destroy(): void {
    this.sigmaInstance?.kill();
    this.graphologyInstance?.clear();
    this.history.set([]);
  }
}
