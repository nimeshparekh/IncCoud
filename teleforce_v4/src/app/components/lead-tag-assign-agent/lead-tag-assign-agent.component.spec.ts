import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadTagAssignAgentComponent } from './lead-tag-assign-agent.component';

describe('LeadTagAssignAgentComponent', () => {
  let component: LeadTagAssignAgentComponent;
  let fixture: ComponentFixture<LeadTagAssignAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadTagAssignAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadTagAssignAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
