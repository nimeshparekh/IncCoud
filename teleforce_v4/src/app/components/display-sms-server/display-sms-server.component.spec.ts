import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySmsServerComponent } from './display-sms-server.component';

describe('DisplaySmsServerComponent', () => {
  let component: DisplaySmsServerComponent;
  let fixture: ComponentFixture<DisplaySmsServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaySmsServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaySmsServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
