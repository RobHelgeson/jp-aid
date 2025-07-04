import {NgClass} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
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
export class KanjiResults implements OnChanges {
  private mockData = inject(MockData);

  @Input() search_text: string = '';

  all_kanji: Kanji[] = [];
  filtered_kanji: Kanji[] = [];
  paginated_kanji: Kanji[] = [];
  selectedKanjiId: string | null = null;

  constructor() {
    this.all_kanji = this.mockData.getKanji();
    this.filtered_kanji = this.all_kanji;
    this.paginated_kanji = this.filtered_kanji.slice(0, 10);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['search_text']) {
      this.filterKanji();
    }
  }

  filterKanji(): void {
    this.filtered_kanji = this.all_kanji.filter(
      kanji =>
        kanji.id.includes(this.search_text) ||
        kanji.meaning.some(meaning => meaning.includes(this.search_text)) ||
        kanji.on_readings.some(reading => reading.includes(this.search_text)) ||
        kanji.kun_readings.some(reading => reading.includes(this.search_text))
    );
    this.paginated_kanji = this.filtered_kanji.slice(0, 10);
  }

  onPageChange(event: PageEvent): void {
    const start_index = event.pageIndex * event.pageSize;
    const end_index = start_index + event.pageSize;
    this.paginated_kanji = this.filtered_kanji.slice(start_index, end_index);
  }

  selectKanji(kanjiId: string): void {
    this.selectedKanjiId = kanjiId;
  }

  isSelected(kanjiId: string): boolean {
    return this.selectedKanjiId === kanjiId;
  }
}
