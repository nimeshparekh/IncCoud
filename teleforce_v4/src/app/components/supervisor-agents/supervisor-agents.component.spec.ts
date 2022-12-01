import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorAgentsComponent } from './supervisor-agents.component';

describe('SupervisorAgentsComponent', () => {
  let component: SupervisorAgentsComponent;
  let fixture: ComponentFixture<SupervisorAgentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorAgentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
