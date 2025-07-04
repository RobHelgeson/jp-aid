import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {KanjiResults} from './kanji-results';

describe('KanjiResults', () => {
  let component: KanjiResults;
  let fixture: ComponentFixture<KanjiResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanjiResults]
    }).compileComponents();

    fixture = TestBed.createComponent(KanjiResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply .active class to clicked card', () => {
    component.all_kanji.set([
      {id: '水', meaning: ['water'], on_readings: [], kun_readings: [], stroke_count: 4},
      {id: '火', meaning: ['fire'], on_readings: [], kun_readings: [], stroke_count: 4}
    ]);
    fixture.detectChanges();

    expect(component.paginated_kanji()).toHaveLength(2);

    const cards = fixture.debugElement.queryAll(By.css('mat-card'));
    cards[0].nativeElement.click();
    fixture.detectChanges();
    expect(cards[0].nativeElement.classList).toContain('active');
    expect(cards[1].nativeElement.classList).not.toContain('active');

    cards[1].nativeElement.click();
    fixture.detectChanges();
    expect(cards[0].nativeElement.classList).not.toContain('active');
    expect(cards[1].nativeElement.classList).toContain('active');
  });
});
