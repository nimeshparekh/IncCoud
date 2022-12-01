import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerLeadChartComponent } from './answer-lead-chart.component';

describe('AnswerLeadChartComponent', () => {
  let component: AnswerLeadChartComponent;
  let fixture: ComponentFixture<AnswerLeadChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerLeadChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerLeadChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
