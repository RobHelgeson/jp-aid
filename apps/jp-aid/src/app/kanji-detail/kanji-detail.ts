import {ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, Signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';
import {ExampleWord, Kanji} from '@jp-aid/shared-interfaces';
import {map} from 'rxjs';

import {MockData} from '../services/mock-data';

@Component({
  selector: 'kl-kanji-detail',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
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

  protected kanji = computed<Kanji | null>(() => {
    const id = this.kanjiId();
    if (!id) return null;

    const allKanji = this.mockData.getKanji();
    return allKanji.find(k => k.id === id) || null;
  });

  protected exampleWords = computed<ExampleWord[]>(() => {
    const currentKanji = this.kanji();
    if (!currentKanji) return [];

    return this.mockData.getExampleWords(currentKanji.id);
  });

  protected previousKanji = computed<Kanji | null>(() => {
    return this.mockData.getPreviousKanji();
  });

  protected nextKanji = computed<Kanji | null>(() => {
    return this.mockData.getNextKanji();
  });

  constructor() {
    // Update search results context when kanji ID changes
    effect(() => {
      const currentKanjiId = this.kanjiId();
      if (currentKanjiId) {
        this.mockData.updateCurrentKanji(currentKanjiId);
      }
    });
  }

  ngOnInit(): void {
    // Initialize search results context with a subset of kanji to simulate search results
    const allKanji = this.mockData.getKanji();
    const simulatedSearchResults = allKanji.slice(0, 10); // First 10 kanji as search results
    const currentKanjiId = this.kanjiId();

    if (currentKanjiId) {
      this.mockData.setSearchResults(simulatedSearchResults, currentKanjiId);
    }
  }

  /**
   * TrackBy function for meanings to optimize rendering performance
   */
  protected trackByMeaning = (index: number, meaning: string): string => meaning;

  /**
   * TrackBy function for readings to optimize rendering performance
   */
  protected trackByReading = (index: number, reading: string): string => reading;

  /**
   * TrackBy function for example words to optimize rendering performance
   */
  protected trackByExampleWord = (index: number, word: ExampleWord): string => word.kanji;

  /**
   * Check if there is a previous kanji available
   */
  protected hasPrevious(): boolean {
    return this.mockData.hasPreviousKanji();
  }

  /**
   * Check if there is a next kanji available
   */
  protected hasNext(): boolean {
    return this.mockData.hasNextKanji();
  }

  /**
   * Navigate to previous kanji in search results
   */
  protected navigateToPrevious(): void {
    const prevKanji = this.mockData.getPreviousKanji();
    if (prevKanji) {
      this.router.navigate(['/kanji', prevKanji.id], {queryParams: {q: this.searchQuery()}});
    }
  }

  /**
   * Navigate to next kanji in search results
   */
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
