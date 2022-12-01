import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentShiftBreakComponent } from './agent-shift-break.component';

describe('AgentShiftBreakComponent', () => {
  let component: AgentShiftBreakComponent;
  let fixture: ComponentFixture<AgentShiftBreakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentShiftBreakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentShiftBreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
