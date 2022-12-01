import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsBalanceReportComponent } from './sms-balance-report.component';

describe('SmsBalanceReportComponent', () => {
  let component: SmsBalanceReportComponent;
  let fixture: ComponentFixture<SmsBalanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsBalanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsBalanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
