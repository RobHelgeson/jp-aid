import {ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, Signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';
import {ExampleWord, Kanji} from '@jp-aid/shared-interfaces';
import {map} from 'rxjs';

import {GraphVisualization} from '../graph-visualization/graph-visualization';
import {MockData} from '../services/mock-data.service';

@Component({
  selector: 'kl-kanji-detail',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, GraphVisualization],
  templateUrl: './kanji-detail.html',
  styleUrl: './kanji-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KanjiDetail implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private mockData = inject(MockData);

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

  protected kanji = computed<Kanji | null>(() => this.mockData.getKanji().find(k => k.id === this.kanjiId()) || null);

  protected exampleWords = computed<ExampleWord[]>(() => this.mockData.getExampleWords(this.kanji()?.id || ''));

  protected previousKanji = computed<Kanji | null>(() => this.mockData.getPreviousKanji());

  protected nextKanji = computed<Kanji | null>(() => this.mockData.getNextKanji());

  ngOnInit(): void {
    // Initialize search results context with a subset of kanji to simulate search results
    const allKanji = this.mockData.getKanji();
    const simulatedSearchResults = allKanji.slice(0, 10); // First 10 kanji as search results
    const currentKanjiId = this.kanjiId();

    if (currentKanjiId) {
      this.mockData.setSearchResults(simulatedSearchResults, currentKanjiId);
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

  protected goBack(): void {
    this.router.navigate(['/search'], {queryParams: {q: this.searchQuery()}});
  }
}
