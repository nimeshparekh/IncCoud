import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentPerfomonceReportComponent } from './agent-perfomonce-report.component';

describe('AgentPerfomonceReportComponent', () => {
  let component: AgentPerfomonceReportComponent;
  let fixture: ComponentFixture<AgentPerfomonceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentPerfomonceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentPerfomonceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
