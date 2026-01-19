import {ChangeDetectionStrategy, Component, computed, effect, inject, Signal, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';
import {KanjiSearchStatus, SegmentedParsingResult} from '@jp-aid/shared-interfaces';
import {delay, map, of} from 'rxjs';

import {slideUpIn} from '../animations/page-transitions';
import {KanjiResults} from '../kanji-results/kanji-results';
import {LoadingSpinner} from '../loading-spinner/loading-spinner';
import {MockData} from '../services/mock-data.service';
import {TextParsingService} from '../services/text-parsing/text-parsing.service';

@Component({
  selector: 'kl-results-page',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, KanjiResults, LoadingSpinner],
  templateUrl: './results-page.html',
  styleUrl: './results-page.scss',
  animations: [slideUpIn],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private textParsingService = inject(TextParsingService);
  private mockData = inject(MockData);

  searchQuery: Signal<string> = toSignal(this.route.queryParams.pipe(map(params => params['q'] || '')), {initialValue: ''});
  private onSearchQueryChange = effect(() => {
    if (this.searchQuery()) {
      this.performSearch();
    } else {
      this.router.navigate(['/']);
    }
  });

  isLoading = signal<boolean>(true);

  protected extractedKanji = computed(() => {
    return this.textParsingService.extractKanji(this.searchQuery());
  });

  protected searchStatus = computed((): KanjiSearchStatus => {
    const searchText = this.searchQuery().trim();
    if (!searchText) {
      return KanjiSearchStatus.NO_KANJI_IN_INPUT;
    }

    const extracted = this.extractedKanji();
    if (extracted.length === 0) {
      return KanjiSearchStatus.NO_KANJI_IN_INPUT;
    }

    const matchingKanji = this.mockData.getKanjiByIds(extracted);
    if (matchingKanji.length === 0) {
      return KanjiSearchStatus.KANJI_NOT_IN_DATABASE;
    }

    if (matchingKanji.length < extracted.length) {
      return KanjiSearchStatus.PARTIAL_MATCH;
    }

    return KanjiSearchStatus.FOUND;
  });

  protected missingKanji = computed((): string[] => {
    const extracted = this.extractedKanji();
    const found = this.mockData.getKanjiByIds(extracted);
    const foundIds = new Set(found.map(k => k.id));
    return extracted.filter(k => !foundIds.has(k));
  });

  protected foundKanjiCount = computed((): number => {
    const extracted = this.extractedKanji();
    const found = this.mockData.getKanjiByIds(extracted);
    return found.length;
  });

  protected segmentedResult = computed((): SegmentedParsingResult | null => {
    const query = this.searchQuery();
    if (!query) return null;
    return this.textParsingService.parseTextWithSegments(query);
  });

  protected hasSegments = computed((): boolean => {
    const result = this.segmentedResult();
    return result?.isSegmented ?? false;
  });

  protected displayMode = computed((): 'grouped' | 'flat' => {
    return this.hasSegments() ? 'grouped' : 'flat';
  });

  private performSearch(): void {
    this.isLoading.set(true);

    of(true)
      .pipe(delay(300))
      .subscribe(() => {
        this.isLoading.set(false);
      });
  }

  goBackToSearch(): void {
    this.router.navigate(['/']);
  }
}
