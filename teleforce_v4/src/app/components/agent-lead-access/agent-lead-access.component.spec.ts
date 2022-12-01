import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentLeadAccessComponent } from './agent-lead-access.component';

describe('AgentLeadAccessComponent', () => {
  let component: AgentLeadAccessComponent;
  let fixture: ComponentFixture<AgentLeadAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentLeadAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentLeadAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
