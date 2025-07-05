import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraphVisualization } from './graph-visualization';

jest.mock('sigma', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        setGraph: jest.fn(),
        kill: jest.fn(),
      };
    }),
  };
});

describe('GraphVisualization', () => {
  let component: GraphVisualization;
  let fixture: ComponentFixture<GraphVisualization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphVisualization],
    }).compileComponents();

    fixture = TestBed.createComponent(GraphVisualization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
