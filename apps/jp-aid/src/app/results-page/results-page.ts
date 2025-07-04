import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, Router} from '@angular/router';
import {delay, of} from 'rxjs';

import {slideUpIn} from '../animations/page-transitions';
import {KanjiResults} from '../kanji-results/kanji-results';
import {LoadingSpinner} from '../loading-spinner/loading-spinner';

@Component({
  selector: 'kl-results-page',
  standalone: true,
  imports: [MatButtonModule, KanjiResults, LoadingSpinner],
  templateUrl: './results-page.html',
  styleUrl: './results-page.scss',
  animations: [slideUpIn],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  searchQuery: string = '';
  isLoading = signal(true);
  hasResults: boolean = false;

  constructor() {
    // Extract query parameter from route
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      this.searchQuery = params['q'] || '';
      if (this.searchQuery) {
        this.performSearch();
      } else {
        // If no query, redirect back to search page
        this.router.navigate(['/']);
      }
    });
  }

  private performSearch(): void {
    this.isLoading.set(true);

    // Simulate API call with loading delay
    // In real implementation, this would be a service call
    of(true)
      .pipe(
        delay(1500) // Simulate network delay for demonstration
      )
      .subscribe(() => {
        this.hasResults = this.searchQuery.trim().length > 0;
        this.isLoading.set(false);
      });
  }

  goBackToSearch(): void {
    this.router.navigate(['/']);
  }
}
