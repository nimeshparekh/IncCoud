import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackSummaryReportComponent } from './callback-summary-report.component';

describe('CallbackSummaryReportComponent', () => {
  let component: CallbackSummaryReportComponent;
  let fixture: ComponentFixture<CallbackSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallbackSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
