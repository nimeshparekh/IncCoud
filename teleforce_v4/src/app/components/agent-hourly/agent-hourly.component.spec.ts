import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentHourlyComponent } from './agent-hourly.component';

describe('AgentHourlyComponent', () => {
  let component: AgentHourlyComponent;
  let fixture: ComponentFixture<AgentHourlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentHourlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentHourlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
