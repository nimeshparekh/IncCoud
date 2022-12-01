import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCallDurationTalktimeReportComponent } from './agent-call-duration-talktime-report.component';

describe('AgentCallDurationTalktimeReportComponent', () => {
  let component: AgentCallDurationTalktimeReportComponent;
  let fixture: ComponentFixture<AgentCallDurationTalktimeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentCallDurationTalktimeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentCallDurationTalktimeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
