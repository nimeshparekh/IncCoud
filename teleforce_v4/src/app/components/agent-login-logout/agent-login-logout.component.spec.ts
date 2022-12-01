import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentLoginLogoutComponent } from './agent-login-logout.component';

describe('AgentLoginLogoutComponent', () => {
  let component: AgentLoginLogoutComponent;
  let fixture: ComponentFixture<AgentLoginLogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentLoginLogoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentLoginLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
