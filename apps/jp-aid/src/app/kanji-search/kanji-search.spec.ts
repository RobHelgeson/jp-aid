import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {KanjiSearch} from './kanji-search';

describe('KanjiSearch', () => {
  let component: KanjiSearch;
  let fixture: ComponentFixture<KanjiSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanjiSearch, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(KanjiSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
