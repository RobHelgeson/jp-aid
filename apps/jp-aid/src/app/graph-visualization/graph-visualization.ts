import {AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, OnDestroy, ViewChild} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import {GraphService} from '../services/graph/graph.service';

@Component({
  selector: 'kl-graph-visualization',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './graph-visualization.html',
  styleUrls: ['./graph-visualization.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphVisualization implements AfterViewInit, OnDestroy {
  @ViewChild('graphContainer') graphContainer!: ElementRef;
  kanjiId = input<string | undefined>(undefined);
  maxNodes = input<number>(50); // Default limit for nodes
  maxEdges = input<number>(100); // Default limit for edges

  private graphService = inject(GraphService);
  private nodeClicked = toSignal(this.graphService.nodeClicked$);

  // Effect to handle kanjiId changes
  private onKanjiIdChangeEffect = effect(() => {
    const kanjiId = this.kanjiId();
    const maxNodes = this.maxNodes();
    const maxEdges = this.maxEdges();

    if (kanjiId && this.graphContainer) {
      this.graphService.updateGraph(kanjiId, maxNodes, maxEdges);
    }
  });

  // Effect to handle node clicks
  private onNodeClickEffect = effect(() => {
    const nodeId = this.nodeClicked();
    if (nodeId) {
      console.log('Clicked node from service:', nodeId);
      // Handle node click, e.g., emit an output event or navigate
    }
  });

  ngAfterViewInit(): void {
    if (this.graphContainer) {
      this.graphService.initialize(this.graphContainer.nativeElement);

      // Trigger initial graph update if kanjiId is already set
      const kanjiId = this.kanjiId();
      if (kanjiId) {
        this.graphService.updateGraph(kanjiId, this.maxNodes(), this.maxEdges());
      }
    }
  }

  ngOnDestroy = (): void => this.graphService.destroy();

  zoomIn = (): void => this.graphService.zoomIn();
  zoomOut = (): void => this.graphService.zoomOut();
  resetGraph = (): void => this.graphService.resetGraph();
}
