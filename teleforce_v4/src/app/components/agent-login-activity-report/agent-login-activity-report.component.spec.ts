import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentLoginActivityReportComponent } from './agent-login-activity-report.component';

describe('AgentLoginActivityReportComponent', () => {
  let component: AgentLoginActivityReportComponent;
  let fixture: ComponentFixture<AgentLoginActivityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentLoginActivityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentLoginActivityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
