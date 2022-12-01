import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCallHistoryComponent } from './agent-call-history.component';

describe('AgentCallHistoryComponent', () => {
  let component: AgentCallHistoryComponent;
  let fixture: ComponentFixture<AgentCallHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentCallHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentCallHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
