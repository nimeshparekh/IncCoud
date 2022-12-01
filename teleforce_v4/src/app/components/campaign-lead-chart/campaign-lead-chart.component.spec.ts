import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignLeadChartComponent } from './campaign-lead-chart.component';

describe('CampaignLeadChartComponent', () => {
  let component: CampaignLeadChartComponent;
  let fixture: ComponentFixture<CampaignLeadChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignLeadChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignLeadChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
