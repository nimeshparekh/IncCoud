import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorAssignAgentComponent } from './supervisor-assign-agent.component';

describe('SupervisorAssignAgentComponent', () => {
  let component: SupervisorAssignAgentComponent;
  let fixture: ComponentFixture<SupervisorAssignAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorAssignAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorAssignAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
