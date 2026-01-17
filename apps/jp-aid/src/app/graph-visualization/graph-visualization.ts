import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  input,
  OnDestroy,
  Output,
  signal,
  ViewChild
} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {BreadcrumbItem, BreadcrumbNodeType, PropertyType} from '@jp-aid/shared-interfaces';

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
  @Output() nodeTraversed = new EventEmitter<{nodeId: string; type: BreadcrumbNodeType | undefined}>();
  @ViewChild('graphContainer') graphContainer!: ElementRef;
  kanjiId = input<string | undefined>(undefined);
  maxNodes = input<number>(50);
  maxEdges = input<number>(100);

  // Track expanded state for node limits
  private _expanded = false;

  // Loading state for traversal operations
  isLoading = signal<boolean>(false);

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
      // Use the new handleNodeTraversal method for proper traversal handling
      this.handleNodeClick(node);
    }
  });

  ngAfterViewInit(): void {
    if (this.graphContainer) {
      this.graphService.initialize(this.graphContainer.nativeElement);
      const kanjiId = this.kanjiId();
      if (kanjiId) {
        this.updateGraphAndBreadcrumbs(kanjiId, this.selectedPropertyType());
      }

      // Add keyboard navigation support
      this.graphContainer.nativeElement.addEventListener('keydown', this.onKeyDown.bind(this));
    }
  }

  ngOnDestroy(): void {
    if (this.graphContainer) {
      this.graphContainer.nativeElement.removeEventListener('keydown', this.onKeyDown.bind(this));
    }
    this.graphService.destroy();
  }

  private onKeyDown(event: KeyboardEvent): void {
    // Handle keyboard navigation for accessibility
    const kanjiId = this.kanjiId();
    if (!kanjiId) return;

    let history: {nodeId: string; property: PropertyType}[] | null = null;
    try {
      history = this.graphService.getHistory();
    } catch (e) {
      console.error('Error getting navigation history:', e);
    }

    switch (event.key) {
      case 'ArrowLeft':
        if (this.canNavigateBack()) {
          this.navigateBack();
          // Always update breadcrumbs to reflect current state
          this.updateBreadcrumbsFromHistory();
          event.preventDefault();
        }
        break;
      case 'ArrowRight':
        if (this.canNavigateForward()) {
          this.navigateForward();
          // Always update breadcrumbs to reflect current state
          this.updateBreadcrumbsFromHistory();
          event.preventDefault();
        }
        break;
      case 'Home':
        this.onResetNavigation();
        event.preventDefault();
        break;
      case 'Enter':
        // If a node is focused, traverse to it
        if (history && history.length > 0) {
          const currentState = history[history.length - 1];
          this.updateGraphAndBreadcrumbs(currentState.nodeId, currentState.property);
          event.preventDefault();
        }
        break;
      case ' ':
        // Spacebar can also trigger navigation
        if (this.canNavigateForward()) {
          this.navigateForward();
          this.updateBreadcrumbsFromHistory();
          event.preventDefault();
        }
        break;
    }
  }

  handleNodeClick(node: {id: string; type: BreadcrumbNodeType | undefined}): void {
    this.graphService.handleNodeTraversal(node.id, this.selectedPropertyType());
    this.nodeTraversed.emit({nodeId: node.id, type: node.type});
  }

  navigateBack(): void {
    this.graphService.navigateBack();
    this.updateBreadcrumbsFromHistory();
  }

  navigateForward(): void {
    this.graphService.navigateForward();
    this.updateBreadcrumbsFromHistory();
  }

  canNavigateBack(): boolean {
    return this.graphService.canNavigateBack();
  }

  canNavigateForward(): boolean {
    return this.graphService.canNavigateForward();
  }

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

  onExpand(): void {
    // Increase the node limit to show more connections
    const currentMaxNodes = this.maxNodes();
    const newLimit = Math.min(currentMaxNodes * 2, 500); // Double the limit up to a maximum of 500

    // Update the graph with expanded limits
    const kanjiId = this.kanjiId();
    if (kanjiId) {
      const property = this.selectedPropertyType();
      this.graphService.updateGraph(kanjiId, property, true, newLimit);
    }
  }

  onResetNavigation(): void {
    const kanjiId = this.kanjiId();
    if (kanjiId) {
      // Reset navigation to origin state
      const property = this.selectedPropertyType();
      this.graphService.resetToOrigin(kanjiId, property);
      this.updateBreadcrumbsFromHistory();
    }
  }

  private getEffectiveMaxNodes(): number {
    const baseLimit = this.maxNodes();
    return this._expanded ? Math.min(baseLimit * 2, 500) : baseLimit;
  }

  private updateGraphAndBreadcrumbs(nodeId: string, property: PropertyType, isNodeClick = false): void {
    // Update the graph and notify parent about node traversal if needed
    this.isLoading.set(true);
    try {
      this.graphService.updateGraph(nodeId, property);

      // Node traversal handling is now done in GraphService.handleNodeTraversal

      // Always update breadcrumbs to reflect current state
      this.updateBreadcrumbsFromHistory();
    } finally {
      this.isLoading.set(false);
    }
  }

  private updateBreadcrumbsFromHistory(): void {
    try {
      const history = this.graphService.getHistory();
      const breadcrumbs: BreadcrumbItem[] = history.map(state => ({
        nodeId: state.nodeId,
        label: this.graphService.getNodeAttribute(state.nodeId, 'label'),
        type: this.graphService.getNodeAttribute(state.nodeId, 'type'),
        property: state.property
      }));
      this.breadcrumbItems.set(breadcrumbs);
    } catch (e) {
      console.error('Error updating breadcrumbs:', e);
    }
  }

  zoomIn = (): Promise<void> | undefined => this.graphService.zoomIn();
  zoomOut = (): Promise<void> | undefined => this.graphService.zoomOut();
  resetGraph = (): Promise<void> | undefined => this.graphService.resetGraph();

  onNodeTraversed(event: {nodeId: string; type: BreadcrumbNodeType | undefined}): void {
    // This method is now called directly by GraphService.handleNodeTraversal
    const {nodeId, type} = event;
    if (type) {
      this.nodeTraversed.emit({nodeId, type});
    }
  }
}
