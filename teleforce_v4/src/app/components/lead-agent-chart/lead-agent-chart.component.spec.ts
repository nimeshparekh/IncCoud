import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadAgentChartComponent } from './lead-agent-chart.component';

describe('LeadAgentChartComponent', () => {
  let component: LeadAgentChartComponent;
  let fixture: ComponentFixture<LeadAgentChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadAgentChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadAgentChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
