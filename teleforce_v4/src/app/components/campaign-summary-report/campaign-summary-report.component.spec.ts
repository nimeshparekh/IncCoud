import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignSummaryReportComponent } from './campaign-summary-report.component';

describe('CampaignSummaryReportComponent', () => {
  let component: CampaignSummaryReportComponent;
  let fixture: ComponentFixture<CampaignSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
