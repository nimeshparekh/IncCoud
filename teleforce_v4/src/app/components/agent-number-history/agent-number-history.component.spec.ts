import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentNumberHistoryComponent } from './agent-number-history.component';

describe('AgentNumberHistoryComponent', () => {
  let component: AgentNumberHistoryComponent;
  let fixture: ComponentFixture<AgentNumberHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentNumberHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentNumberHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
