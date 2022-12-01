import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveCallComponent } from './live-call.component';

describe('LiveCallComponent', () => {
  let component: LiveCallComponent;
  let fixture: ComponentFixture<LiveCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
