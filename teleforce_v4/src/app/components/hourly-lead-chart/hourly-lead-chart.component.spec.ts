import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyLeadChartComponent } from './hourly-lead-chart.component';

describe('HourlyLeadChartComponent', () => {
  let component: HourlyLeadChartComponent;
  let fixture: ComponentFixture<HourlyLeadChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HourlyLeadChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourlyLeadChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
