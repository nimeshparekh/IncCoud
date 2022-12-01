import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentLeadFeedbackComponent } from './agent-lead-feedback.component';

describe('AgentLeadFeedbackComponent', () => {
  let component: AgentLeadFeedbackComponent;
  let fixture: ComponentFixture<AgentLeadFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentLeadFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentLeadFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
