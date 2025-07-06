import {AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, OnDestroy, ViewChild} from '@angular/core';
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
  maxNodes = input<number>(50);
  maxEdges = input<number>(100);

  private graphService = inject(GraphService);

  private onKanjiIdChangeEffect = effect(() => {
    const kanjiId = this.kanjiId();
    const maxNodes = this.maxNodes();
    const maxEdges = this.maxEdges();

    if (kanjiId && this.graphContainer) {
      this.graphService.updateGraph(kanjiId, maxNodes, maxEdges);
    }
  });

  private onNodeClickEffect = effect(() => {
    const nodeId = this.graphService.nodeClicked();
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

  zoomIn = (): Promise<void> | undefined => this.graphService.zoomIn();
  zoomOut = (): Promise<void> | undefined => this.graphService.zoomOut();
  resetGraph = (): Promise<void> | undefined => this.graphService.resetGraph();
}
