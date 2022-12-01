import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadSourceReportComponent } from './lead-source-report.component';

describe('LeadSourceReportComponent', () => {
  let component: LeadSourceReportComponent;
  let fixture: ComponentFixture<LeadSourceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadSourceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadSourceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
