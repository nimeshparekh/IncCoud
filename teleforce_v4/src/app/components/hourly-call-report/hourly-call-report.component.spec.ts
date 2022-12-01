import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyCallReportComponent } from './hourly-call-report.component';

describe('HourlyCallReportComponent', () => {
  let component: HourlyCallReportComponent;
  let fixture: ComponentFixture<HourlyCallReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HourlyCallReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourlyCallReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
