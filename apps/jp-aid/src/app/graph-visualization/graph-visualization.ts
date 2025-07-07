


import {AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, OnDestroy, ViewChild} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';

import {GraphService} from '../services/graph/graph.service';
import {BreadcrumbNavigationComponent} from '../breadcrumb-navigation/breadcrumb-navigation.component';
import {PropertyType} from '@jp-aid/shared-interfaces';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'kl-graph-visualization',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatSelectModule, MatOptionModule, BreadcrumbNavigationComponent, TitleCasePipe],
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

  // Property types for the dropdown selector
  propertyTypes: PropertyType[] = [
    PropertyType.Radical,
    PropertyType.Primitive,
    PropertyType.OnYomi,
    PropertyType.KunYomi
  ];

  // Reactive properties
  selectedPropertyType = this.graphService.selectedPropertyType;
  breadcrumbHistory = this.graphService.breadcrumbHistory;

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

  private onPropertyTypeChangeEffect = effect(() => {
    const propertyType = this.selectedPropertyType();
    if (propertyType) {
      this.graphService.filterGraphByProperty(propertyType);

      // Update breadcrumb history when property type changes
      const currentBreadcrumbs = this.breadcrumbHistory();
      this.breadcrumbHistory.set([
        ...currentBreadcrumbs,
        {
          label: `Filter: ${propertyType}`,
          type: 'feature',
          navigate: () => this.graphService.restoreGraphState()
        }
      ]);
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

  onPropertyTypeChange(propertyType: PropertyType): void {
    this.selectedPropertyType.set(propertyType);
  }

  resetToOrigin(): void {
    this.graphService.resetToOrigin();
  }
}


