import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCalldurationReportComponent } from './agent-callduration-report.component';

describe('AgentCalldurationReportComponent', () => {
  let component: AgentCalldurationReportComponent;
  let fixture: ComponentFixture<AgentCalldurationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentCalldurationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentCalldurationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
