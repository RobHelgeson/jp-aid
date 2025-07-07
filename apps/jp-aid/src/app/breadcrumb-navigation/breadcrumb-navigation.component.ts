import { ChangeDetectionStrategy, Component, input} from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbItem } from '@jp-aid/shared-interfaces';

@Component({
  selector: 'kl-breadcrumb-navigation',
  standalone: true,
  imports: [MatIconModule, NgClass],
  templateUrl: './breadcrumb-navigation.component.html',
  styleUrls: ['./breadcrumb-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbNavigationComponent {
  breadcrumbs = input<BreadcrumbItem[]>([]);
}