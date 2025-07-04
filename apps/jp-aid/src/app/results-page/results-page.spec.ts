import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {of} from 'rxjs';

import {ResultsPage} from './results-page';

describe('ResultsPage', () => {
  let component: ResultsPage;
  let fixture: ComponentFixture<ResultsPage>;
  let mockRouter: Partial<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    };
    mockActivatedRoute = {
      queryParams: of({q: 'test-search'})
    };

    await TestBed.configureTestingModule({
      imports: [ResultsPage, NoopAnimationsModule],
      providers: [
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: mockActivatedRoute}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract search query from route params', () => {
    expect(component.searchQuery()).toBe('test-search');
  });

  it('should show loading state initially', () => {
    expect(component.isLoading()).toBe(true);
  });
});
