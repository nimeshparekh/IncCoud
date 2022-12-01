import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadOpportunityamountReportComponent } from './lead-opportunityamount-report.component';

describe('LeadOpportunityamountReportComponent', () => {
  let component: LeadOpportunityamountReportComponent;
  let fixture: ComponentFixture<LeadOpportunityamountReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadOpportunityamountReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadOpportunityamountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
