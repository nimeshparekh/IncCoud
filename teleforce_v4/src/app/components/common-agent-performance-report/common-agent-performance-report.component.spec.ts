import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonAgentPerformanceReportComponent } from './common-agent-performance-report.component';

describe('CommonAgentPerformanceReportComponent', () => {
  let component: CommonAgentPerformanceReportComponent;
  let fixture: ComponentFixture<CommonAgentPerformanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonAgentPerformanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonAgentPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
