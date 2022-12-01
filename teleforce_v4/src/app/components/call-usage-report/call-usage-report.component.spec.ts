import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallUsageReportComponent } from './call-usage-report.component';

describe('CallUsageReportComponent', () => {
  let component: CallUsageReportComponent;
  let fixture: ComponentFixture<CallUsageReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallUsageReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallUsageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
