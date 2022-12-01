import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignDispositionReportComponent } from './campaign-disposition-report.component';

describe('CampaignDispositionReportComponent', () => {
  let component: CampaignDispositionReportComponent;
  let fixture: ComponentFixture<CampaignDispositionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignDispositionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignDispositionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
