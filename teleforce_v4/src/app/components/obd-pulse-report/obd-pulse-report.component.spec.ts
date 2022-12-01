import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObdPulseReportComponent } from './obd-pulse-report.component';

describe('ObdPulseReportComponent', () => {
  let component: ObdPulseReportComponent;
  let fixture: ComponentFixture<ObdPulseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObdPulseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObdPulseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
