import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAgentLocationComponent } from './live-agent-location.component';

describe('LiveAgentLocationComponent', () => {
  let component: LiveAgentLocationComponent;
  let fixture: ComponentFixture<LiveAgentLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveAgentLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveAgentLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
