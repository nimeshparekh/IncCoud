import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UntouchLeadReportComponent } from './untouch-lead-report.component';

describe('UntouchLeadReportComponent', () => {
  let component: UntouchLeadReportComponent;
  let fixture: ComponentFixture<UntouchLeadReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UntouchLeadReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UntouchLeadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
