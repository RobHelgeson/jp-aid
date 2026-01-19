import {ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, OnInit, Signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbNodeType, ExampleWord, Kanji} from '@jp-aid/shared-interfaces';
import {filter, map, Subscription} from 'rxjs';

import {GraphVisualization} from '../graph-visualization/graph-visualization';
import {GraphService} from '../services/graph/graph.service';
import {MockData} from '../services/mock-data.service';

@Component({
  selector: 'kl-kanji-detail',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, GraphVisualization],
  templateUrl: './kanji-detail.html',
  styleUrl: './kanji-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KanjiDetail implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private mockData = inject(MockData);
  private graphService = inject(GraphService);

  // Subscription to GraphService node traversal events
  private nodeTraversalSubscription?: Subscription;

  private kanjiId = toSignal(this.activatedRoute.params.pipe(map(params => params['id'] || '')), {initialValue: ''});
  private searchQuery: Signal<string> = toSignal(this.activatedRoute.queryParams.pipe(map(params => params['q'] || '')), {
    initialValue: ''
  });

  private onKanjiIdChangeEffect = effect(() => {
    const currentKanjiId = this.kanjiId();
    if (currentKanjiId) {
      this.mockData.updateCurrentKanji(currentKanjiId);
    }
  });

  // Track the current node type (kanji or feature) for proper display
  private _currentNodeType: BreadcrumbNodeType | undefined = undefined;

  protected kanji = computed<Kanji | null>(() => {
    const kanjiId = this.kanjiId();
    if (this._currentNodeType === BreadcrumbNodeType.KANJI || !this._currentNodeType) {
      return this.mockData.getKanji().find(k => k.id === kanjiId) || null;
    }
    return null; // For feature nodes, don't show kanji details
  });

  protected exampleWords = computed<ExampleWord[]>(() => this.mockData.getExampleWords(this.kanji()?.id || ''));

  protected previousKanji = computed<Kanji | null>(() => this.mockData.getPreviousKanji());

  protected nextKanji = computed<Kanji | null>(() => this.mockData.getNextKanji());

  ngOnInit(): void {
    const currentKanjiId = this.kanjiId();

    if (currentKanjiId) {
      // Only set search results if accessed directly without context from KanjiResults
      // When navigating from KanjiResults, setSearchResults is called there with the actual ordered results
      const existingResults = this.mockData.getSearchResults();
      if (existingResults.length === 0) {
        // Direct URL access - create minimal context with just this kanji
        const currentKanji = this.mockData.getKanji().find(k => k.id === currentKanjiId);
        if (currentKanji) {
          this.mockData.setSearchResults([currentKanji], currentKanjiId);
        }
      }

      // Set up subscription to GraphService node traversal events
      this.nodeTraversalSubscription = this.graphService.nodeTraversed
        .pipe(
          filter(event => !!event.type) // Only handle events with valid types
        )
        .subscribe(event => {
          this.onNodeTraversed(event);
        });
    }
  }

  protected trackByMeaning = (index: number, meaning: string): string => meaning;
  protected trackByReading = (index: number, reading: string): string => reading;
  protected trackByExampleWord = (index: number, word: ExampleWord): string => word.kanji;

  protected hasPrevious = (): boolean => this.mockData.hasPreviousKanji();
  protected hasNext = (): boolean => this.mockData.hasNextKanji();

  protected navigateToPrevious(): void {
    const prevKanji = this.mockData.getPreviousKanji();
    if (prevKanji) {
      this.router.navigate(['/kanji', prevKanji.id], {queryParams: {q: this.searchQuery()}});
    }
  }

  protected navigateToNext(): void {
    const nextKanji = this.mockData.getNextKanji();
    if (nextKanji) {
      this.router.navigate(['/kanji', nextKanji.id], {queryParams: {q: this.searchQuery()}});
    }
  }

  /**
   * Handle node traversal events from the graph visualization or GraphService
   * @param event Node traversal event with ID and type
   */
  onNodeTraversed(event: {nodeId: string; type: BreadcrumbNodeType | undefined}): void {
    const {nodeId, type} = event;
    // Update the current node type
    this._currentNodeType = type;

    // Update the current kanji based on traversal
    if (this._currentNodeType === BreadcrumbNodeType.KANJI) {
      this.router.navigate(['/kanji', nodeId], {queryParams: {q: this.searchQuery()}});
    }
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.nodeTraversalSubscription) {
      this.nodeTraversalSubscription.unsubscribe();
    }
  }

  protected goBack(): void {
    this.router.navigate(['/search'], {queryParams: {q: this.searchQuery()}});
  }
}
