import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadTimelineReportComponent } from './lead-timeline-report.component';

describe('LeadTimelineReportComponent', () => {
  let component: LeadTimelineReportComponent;
  let fixture: ComponentFixture<LeadTimelineReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadTimelineReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadTimelineReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
