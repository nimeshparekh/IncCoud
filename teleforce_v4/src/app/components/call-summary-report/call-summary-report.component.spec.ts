import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallSummaryReportComponent } from './call-summary-report.component';

describe('CallSummaryReportComponent', () => {
  let component: CallSummaryReportComponent;
  let fixture: ComponentFixture<CallSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
