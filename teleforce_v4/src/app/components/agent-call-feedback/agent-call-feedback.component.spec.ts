import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCallFeedbackComponent } from './agent-call-feedback.component';

describe('AgentCallFeedbackComponent', () => {
  let component: AgentCallFeedbackComponent;
  let fixture: ComponentFixture<AgentCallFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentCallFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentCallFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
