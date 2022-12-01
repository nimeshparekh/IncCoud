import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadStageReportComponent } from './lead-stage-report.component';

describe('LeadStageReportComponent', () => {
  let component: LeadStageReportComponent;
  let fixture: ComponentFixture<LeadStageReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadStageReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadStageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
