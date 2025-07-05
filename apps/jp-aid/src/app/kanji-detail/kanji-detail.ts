import {ChangeDetectionStrategy, Component, computed, inject, Signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';
import {Kanji} from '@jp-aid/shared-interfaces';
import {map} from 'rxjs';

import {MockData} from '../services/mock-data';

@Component({
  selector: 'kl-kanji-detail',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './kanji-detail.html',
  styleUrl: './kanji-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KanjiDetail {
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

  protected goBack(): void {
    this.router.navigate(['/search'], {queryParams: {q: this.searchQuery()}});
  }
}
