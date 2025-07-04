import {NgClass} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {Kanji} from '@jp-aid/shared-interfaces';

import {MockData} from '../services/mock-data';

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

  readonly search_text = input<string>('');

  private all_kanji = signal<Kanji[]>([]);
  private selectedKanjiId = signal<string | null>(null);
  private pageIndex = signal(0);
  private pageSize = signal(10);

  protected filtered_kanji = computed(() => {
    const searchText = this.search_text();
    if (!searchText) {
      return this.all_kanji();
    }

    return this.all_kanji().filter(
      kanji =>
        kanji.id.includes(searchText) ||
        kanji.meaning.some(meaning => meaning.includes(searchText)) ||
        kanji.on_readings.some(reading => reading.includes(searchText)) ||
        kanji.kun_readings.some(reading => reading.includes(searchText))
    );
  });

  protected paginated_kanji = computed(() => {
    const filtered = this.filtered_kanji();
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return filtered.slice(startIndex, endIndex);
  });

  constructor() {
    this.all_kanji.set(this.mockData.getKanji());
  }

  protected onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  protected selectKanji(kanjiId: string): void {
    this.selectedKanjiId.set(kanjiId);
  }

  protected isSelected(kanjiId: string): boolean {
    return this.selectedKanjiId() === kanjiId;
  }
}
