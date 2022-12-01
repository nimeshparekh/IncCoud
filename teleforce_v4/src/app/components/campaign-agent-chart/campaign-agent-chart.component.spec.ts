import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignAgentChartComponent } from './campaign-agent-chart.component';

describe('CampaignAgentChartComponent', () => {
  let component: CampaignAgentChartComponent;
  let fixture: ComponentFixture<CampaignAgentChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignAgentChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignAgentChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
