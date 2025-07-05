import {ChangeDetectionStrategy, Component, effect, inject, Signal, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';
import {delay, map, of} from 'rxjs';

import {slideUpIn} from '../animations/page-transitions';
import {KanjiResults} from '../kanji-results/kanji-results';
import {LoadingSpinner} from '../loading-spinner/loading-spinner';

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

  searchQuery: Signal<string> = toSignal(this.route.queryParams.pipe(map(params => params['q'] || '')), {initialValue: ''});
  private onSearchQueryChange = effect(() => {
    if (this.searchQuery()) {
      this.performSearch();
    } else {
      this.router.navigate(['/']);
    }
  });

  isLoading = signal<boolean>(true);
  protected hasResults = signal<boolean>(false);

  private performSearch(): void {
    this.isLoading.set(true);

    // Simulate API call with loading delay
    // In real implementation, this would be a service call
    of(true)
      .pipe(
        delay(1500) // Simulate network delay for demonstration
      )
      .subscribe(() => {
        this.hasResults.set(this.searchQuery().trim().length > 0);
        this.isLoading.set(false);
      });
  }

  goBackToSearch(): void {
    this.router.navigate(['/']);
  }
}
