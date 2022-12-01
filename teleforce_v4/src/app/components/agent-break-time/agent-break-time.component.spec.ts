import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentBreakTimeComponent } from './agent-break-time.component';

describe('AgentBreakTimeComponent', () => {
  let component: AgentBreakTimeComponent;
  let fixture: ComponentFixture<AgentBreakTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentBreakTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentBreakTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
