import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveChannel2Component } from './live-channel2.component';

describe('LiveChannel2Component', () => {
  let component: LiveChannel2Component;
  let fixture: ComponentFixture<LiveChannel2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveChannel2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveChannel2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
