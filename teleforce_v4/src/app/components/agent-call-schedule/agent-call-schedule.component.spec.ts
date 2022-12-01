import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCallScheduleComponent } from './agent-call-schedule.component';

describe('AgentCallScheduleComponent', () => {
  let component: AgentCallScheduleComponent;
  let fixture: ComponentFixture<AgentCallScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentCallScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentCallScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
