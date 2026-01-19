import {NgClass} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {Router} from '@angular/router';
import {Kanji} from '@jp-aid/shared-interfaces';

import {MockData} from '../services/mock-data.service';
import {TextParsingService} from '../services/text-parsing/text-parsing.service';

@Component({
  selector: 'kl-kanji-results',
  standalone: true,
  imports: [MatCardModule, MatGridListModule, MatPaginatorModule, NgClass],
  templateUrl: './kanji-results.html',
  styleUrl: './kanji-results.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KanjiResults {
  private mockData = inject(MockData);
  private textParsingService = inject(TextParsingService);
  private router = inject(Router);

  readonly searchText = input<string>('');

  allKanji = signal<Kanji[]>([]);
  private selectedKanjiId = signal<string | null>(null);
  private pageIndex = signal(0);
  private pageSize = signal(10);

  protected filteredKanji = computed(() => {
    const searchText = this.searchText();
    if (!searchText) {
      return this.allKanji();
    }

    const extractedKanji = this.textParsingService.extractKanji(searchText);

    if (extractedKanji.length > 0) {
      return this.mockData.getKanjiByIds(extractedKanji);
    }

    const searchLower = searchText.toLowerCase();
    return this.allKanji().filter(
      kanji =>
        kanji.meaning.some(meaning => meaning.toLowerCase().includes(searchLower)) ||
        kanji.onReadings.some(reading => reading.includes(searchText)) ||
        kanji.kunReadings.some(reading => reading.includes(searchText))
    );
  });

  paginatedKanji = computed(() => {
    const filtered = this.filteredKanji();
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return filtered.slice(startIndex, endIndex);
  });

  constructor() {
    this.allKanji.set(this.mockData.getKanji());
  }

  protected onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  protected selectKanji(kanjiId: string): void {
    this.selectedKanjiId.set(kanjiId);
    this.mockData.setSearchResults(this.filteredKanji(), kanjiId);
    this.router.navigate(['/kanji', kanjiId], {queryParams: {q: this.searchText()}});
  }

  protected isSelected(kanjiId: string): boolean {
    return this.selectedKanjiId() === kanjiId;
  }
}
