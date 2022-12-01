import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentLiveStatusComponent } from './agent-live-status.component';

describe('AgentLiveStatusComponent', () => {
  let component: AgentLiveStatusComponent;
  let fixture: ComponentFixture<AgentLiveStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentLiveStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentLiveStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
