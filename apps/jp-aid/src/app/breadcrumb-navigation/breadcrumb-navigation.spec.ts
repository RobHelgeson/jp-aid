import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {BreadcrumbItem, BreadcrumbNodeType} from '@jp-aid/shared-interfaces';

import {BreadcrumbNavigation} from './breadcrumb-navigation';

describe('BreadcrumbNavigation', () => {
  let component: BreadcrumbNavigation;
  let fixture: ComponentFixture<BreadcrumbNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbNavigation, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbNavigation);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display breadcrumb items', () => {
    const items: BreadcrumbItem[] = [
      {nodeId: '1', label: 'Home', type: BreadcrumbNodeType.KANJI},
      {nodeId: '2', label: 'Category', type: BreadcrumbNodeType.FEATURE}
    ];
    component.items = items;
    fixture.detectChanges();

    const breadcrumbButtons = fixture.nativeElement.querySelectorAll('button[mat-button]');
    expect(breadcrumbButtons.length).toBe(2);
    expect(breadcrumbButtons[0].textContent).toContain('Home');
    expect(breadcrumbButtons[1].textContent).toContain('Category');
  });

  it('should emit breadcrumbClick event when an item is clicked', () => {
    const emitSpy = jest.spyOn(component.breadcrumbClick, 'emit');
    // Need at least 2 items - first one is clickable, last one is disabled
    const items: BreadcrumbItem[] = [
      {nodeId: '1', label: 'Home', type: BreadcrumbNodeType.KANJI},
      {nodeId: '2', label: 'Current', type: BreadcrumbNodeType.FEATURE}
    ];
    component.items = items;
    fixture.detectChanges();

    // Get all mat-button elements (excluding icon-button which is the reset button)
    const breadcrumbButtons = fixture.nativeElement.querySelectorAll('button[mat-button]:not([mat-icon-button])');
    // First button should not be disabled
    expect(breadcrumbButtons[0].disabled).toBe(false);
    breadcrumbButtons[0].click();
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith(items[0]);
  });

  it('should emit reset event when reset button is clicked', () => {
    jest.spyOn(component.resetNavigation, 'emit');
    fixture.detectChanges();

    const resetButton = fixture.nativeElement.querySelector('button[aria-label="Reset to origin"]');
    resetButton.click();

    expect(component.resetNavigation.emit).toHaveBeenCalled();
  });

  it('should disable the last breadcrumb item', () => {
    const items: BreadcrumbItem[] = [
      {nodeId: '1', label: 'Home', type: BreadcrumbNodeType.KANJI},
      {nodeId: '2', label: 'Category', type: BreadcrumbNodeType.FEATURE}
    ];
    component.items = items;
    fixture.detectChanges();

    const breadcrumbButtons = fixture.nativeElement.querySelectorAll('button[mat-button]');
    expect(breadcrumbButtons[0].disabled).toBe(false);
    expect(breadcrumbButtons[1].disabled).toBe(true);
  });
});
