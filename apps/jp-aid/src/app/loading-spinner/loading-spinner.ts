import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {spinnerSlideUp} from '../animations/page-transitions';

@Component({
  selector: 'kl-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss',
  animations: [spinnerSlideUp],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinner {
  readonly message = input<string>('Loading...');
  readonly size = input<number>(300);
}
