import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BreadcrumbNavigationComponent } from './breadcrumb-navigation.component';

describe('BreadcrumbNavigationComponent', () => {
  let component: BreadcrumbNavigationComponent;
  let fixture: ComponentFixture<BreadcrumbNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbNavigationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display breadcrumbs', () => {
    const testBreadcrumbs = [
      { label: 'Home', type: 'kanji' },
      { label: 'Feature A', type: 'feature' }
    ];
    fixture.componentRef.setInput('breadcrumbs', testBreadcrumbs);
    fixture.detectChanges();

    const breadcrumbItems = fixture.debugElement.queryAll(By.css('.breadcrumb-item'));
    expect(breadcrumbItems.length).toBe(2);

    expect(breadcrumbItems[0].nativeElement.textContent.trim()).toContain('Home');
    expect(breadcrumbItems[1].nativeElement.textContent.trim()).toContain('Feature A');
  });

  it('should call navigate function when clicked', () => {
    let navigateCalled = false;
    const testBreadcrumbs = [
      { label: 'Home', type: 'kanji', navigate: () => { navigateCalled = true; } }
    ];
    fixture.componentRef.setInput('breadcrumbs', testBreadcrumbs);
    fixture.detectChanges();

    const breadcrumbItem = fixture.debugElement.query(By.css('.breadcrumb-item'));
    breadcrumbItem.triggerEventHandler('click', null);

    expect(navigateCalled).toBe(true);
  });
});