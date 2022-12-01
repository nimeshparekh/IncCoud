import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentMissedCallReportComponent } from './agent-missed-call-report.component';

describe('AgentMissedCallReportComponent', () => {
  let component: AgentMissedCallReportComponent;
  let fixture: ComponentFixture<AgentMissedCallReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentMissedCallReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentMissedCallReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
