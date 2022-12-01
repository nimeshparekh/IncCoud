import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyAgentChartComponent } from './hourly-agent-chart.component';

describe('HourlyAgentChartComponent', () => {
  let component: HourlyAgentChartComponent;
  let fixture: ComponentFixture<HourlyAgentChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HourlyAgentChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourlyAgentChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
