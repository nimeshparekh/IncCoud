import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentLeadListComponent } from './agent-lead-list.component';

describe('AgentLeadListComponent', () => {
  let component: AgentLeadListComponent;
  let fixture: ComponentFixture<AgentLeadListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentLeadListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentLeadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
