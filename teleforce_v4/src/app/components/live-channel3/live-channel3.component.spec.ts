import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveChannel3Component } from './live-channel3.component';

describe('LiveChannel3Component', () => {
  let component: LiveChannel3Component;
  let fixture: ComponentFixture<LiveChannel3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveChannel3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveChannel3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
