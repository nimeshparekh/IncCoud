import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateScheduleReportComponent } from './create-schedule-report.component';

describe('CreateScheduleReportComponent', () => {
  let component: CreateScheduleReportComponent;
  let fixture: ComponentFixture<CreateScheduleReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateScheduleReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateScheduleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
