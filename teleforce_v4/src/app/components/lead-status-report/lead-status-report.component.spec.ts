import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadStatusReportComponent } from './lead-status-report.component';

describe('LeadStatusReportComponent', () => {
  let component: LeadStatusReportComponent;
  let fixture: ComponentFixture<LeadStatusReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadStatusReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
