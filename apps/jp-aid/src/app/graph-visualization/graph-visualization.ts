import {AfterViewInit, Component, ElementRef, inject, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {GraphEdge, GraphNode, NodeType} from '@jp-aid/shared-interfaces';
import Graph from 'graphology';
import Sigma from 'sigma';
import {EdgeLineProgram, NodeCircleProgram} from 'sigma/rendering';

import {MockData} from '../services/mock-data';

@Component({
  selector: 'kl-graph-visualization',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './graph-visualization.html',
  styleUrls: ['./graph-visualization.scss']
})
export class GraphVisualization implements AfterViewInit, OnChanges {
  @ViewChild('graphContainer') graphContainer!: ElementRef;
  @Input() kanjiId?: string;
  @Input() maxNodes = 50; // Default limit for nodes
  @Input() maxEdges = 100; // Default limit for edges

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

  zoomIn(): void {
    this.sigmaInstance?.getCamera().animatedZoom(this.sigmaInstance.getCamera().ratio * 1.2);
  }

  zoomOut(): void {
    this.sigmaInstance?.getCamera().animatedZoom(this.sigmaInstance.getCamera().ratio / 1.2);
  }

  resetGraph(): void {
    this.sigmaInstance?.getCamera().animate({x: 0, y: 0, ratio: 1, angle: 0}, {duration: 500});
  }

  private renderGraph(): void {
    if (!this.kanjiId) {
      return;
    }
    const graphData = this.mockData.getGraphData(this.kanjiId);
    const graph = new Graph();

    // Apply limits to nodes and edges
    const limitedNodes = graphData.nodes.slice(0, this.maxNodes);
    const limitedEdges = graphData.edges.slice(0, this.maxEdges);

    limitedNodes.forEach((node: GraphNode) => {
      graph.addNode(node.id, {...node});
    });
    limitedEdges.forEach((edge: GraphEdge) => {
      graph.addEdge(edge.source, edge.target, {...edge});
    });

    if (this.sigmaInstance) {
      this.sigmaInstance.setGraph(graph);
    } else if (this.graphContainer) {
      this.sigmaInstance = new Sigma(graph, this.graphContainer.nativeElement, {
        nodeProgramClasses: {
          [NodeType.Kanji]: NodeCircleProgram,
          [NodeType.Radical]: NodeCircleProgram,
          [NodeType.Primitive]: NodeCircleProgram
        },
        edgeProgramClasses: {
          default: EdgeLineProgram
        }
      });

      this.sigmaInstance.on('clickNode', e => {
        console.log('Clicked node:', e.node);
      });
    }
  }
}
