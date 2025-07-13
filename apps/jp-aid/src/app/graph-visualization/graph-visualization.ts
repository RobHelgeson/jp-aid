import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  ViewChild
} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {BreadcrumbItem, PropertyType} from '@jp-aid/shared-interfaces';

import {BreadcrumbNavigation} from '../breadcrumb-navigation/breadcrumb-navigation';
import {GraphService} from '../services/graph/graph.service';

@Component({
  selector: 'kl-graph-visualization',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, BreadcrumbNavigation],
  templateUrl: './graph-visualization.html',
  styleUrls: ['./graph-visualization.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphVisualization implements AfterViewInit, OnDestroy {
  @ViewChild('graphContainer') graphContainer!: ElementRef;
  kanjiId = input<string | undefined>(undefined);
  maxNodes = input<number>(50);
  maxEdges = input<number>(100);

  propertyTypes = Object.values(PropertyType);
  selectedPropertyType = signal<PropertyType>(PropertyType.ON_YOMI);
  breadcrumbItems = signal<BreadcrumbItem[]>([]);

  private graphService = inject(GraphService);

  private onKanjiIdChangeEffect = effect(() => {
    const kanjiId = this.kanjiId();
    if (kanjiId && this.graphContainer) {
      this.updateGraphAndBreadcrumbs(kanjiId, this.selectedPropertyType());
    }
  });

  private onNodeClickEffect = effect(() => {
    const node = this.graphService.nodeClicked();
    if (node) {
      this.updateGraphAndBreadcrumbs(node.id, this.selectedPropertyType(), true);
    }
  });

  ngAfterViewInit(): void {
    if (this.graphContainer) {
      this.graphService.initialize(this.graphContainer.nativeElement);
      const kanjiId = this.kanjiId();
      if (kanjiId) {
        this.updateGraphAndBreadcrumbs(kanjiId, this.selectedPropertyType());
      }
    }
  }

  ngOnDestroy = (): void => this.graphService.destroy();

  onPropertyTypeChange(propertyType: PropertyType): void {
    this.selectedPropertyType.set(propertyType);
    const kanjiId = this.kanjiId();
    if (kanjiId) {
      this.updateGraphAndBreadcrumbs(kanjiId, propertyType);
    }
  }

  onBreadcrumbClick(item: BreadcrumbItem): void {
    this.graphService.navigateToState(item.nodeId);
    this.updateBreadcrumbsFromHistory();
  }

  onReset(): void {
    const kanjiId = this.kanjiId();
    if (kanjiId) {
      this.graphService.resetToOrigin(kanjiId, this.selectedPropertyType());
      this.updateBreadcrumbsFromHistory();
    }
  }

  private updateGraphAndBreadcrumbs(nodeId: string, property: PropertyType, isNodeClick = false): void {
    if (isNodeClick) {
      this.graphService.updateGraph(nodeId, property);
    } else {
      this.graphService.resetToOrigin(nodeId, property);
    }
    this.updateBreadcrumbsFromHistory();
  }

  private updateBreadcrumbsFromHistory(): void {
    const history = this.graphService.getHistory();
    const breadcrumbs: BreadcrumbItem[] = history.map(state => ({
      nodeId: state.nodeId,
      label: this.graphService.getNodeAttribute(state.nodeId, 'label'),
      type: this.graphService.getNodeAttribute(state.nodeId, 'type'),
      property: state.property
    }));
    this.breadcrumbItems.set(breadcrumbs);
  }

  zoomIn = (): Promise<void> | undefined => this.graphService.zoomIn();
  zoomOut = (): Promise<void> | undefined => this.graphService.zoomOut();
  resetGraph = (): Promise<void> | undefined => this.graphService.resetGraph();
}
