import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {BreadcrumbItem} from '@jp-aid/shared-interfaces';

@Component({
  selector: 'kl-breadcrumb-navigation',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './breadcrumb-navigation.html',
  styleUrls: ['./breadcrumb-navigation.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class BreadcrumbNavigation {
  @Input() items: BreadcrumbItem[] = [];
  @Output() breadcrumbClick = new EventEmitter<BreadcrumbItem>();
  @Output() resetNavigation = new EventEmitter<void>();
  @Output() expandRequest = new EventEmitter<void>();

  onBreadcrumbClick(item: BreadcrumbItem): void {
    this.breadcrumbClick.emit(item);
  }

  onReset(): void {
    this.resetNavigation.emit();
  }

  onExpand(): void {
    this.expandRequest.emit();
  }
}
