import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDialerComponent } from './agent-dialer.component';

describe('AgentDialerComponent', () => {
  let component: AgentDialerComponent;
  let fixture: ComponentFixture<AgentDialerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentDialerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentDialerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
