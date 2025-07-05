import {AfterViewInit, Component, ElementRef, inject, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {GraphEdge, GraphNode} from '@jp-aid/shared-interfaces';
import Graph from 'graphology';
import Sigma from 'sigma';

import {MockData} from '../services/mock-data';

@Component({
  selector: 'kl-graph-visualization',
  standalone: true,
  templateUrl: './graph-visualization.html',
  styleUrls: ['./graph-visualization.scss']
})
export class GraphVisualization implements AfterViewInit, OnChanges {
  @ViewChild('graphContainer') graphContainer!: ElementRef;
  @Input() kanjiId?: string;

  private mockData = inject(MockData);
  private sigmaInstance?: Sigma;

  ngAfterViewInit(): void {
    this.renderGraph();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['kanjiId'] && !changes['kanjiId'].firstChange) {
      this.renderGraph();
    }
  }

  private renderGraph(): void {
    if (!this.kanjiId) {
      return;
    }
    const graphData = this.mockData.getGraphData(this.kanjiId);
    const graph = new Graph();

    graphData.nodes.forEach((node: GraphNode) => {
      graph.addNode(node.id, {...node});
    });
    graphData.edges.forEach((edge: GraphEdge) => {
      graph.addEdge(edge.source, edge.target, {...edge});
    });

    if (this.sigmaInstance) {
      this.sigmaInstance.setGraph(graph);
    } else if (this.graphContainer) {
      this.sigmaInstance = new Sigma(graph, this.graphContainer.nativeElement);
    }
  }
}
