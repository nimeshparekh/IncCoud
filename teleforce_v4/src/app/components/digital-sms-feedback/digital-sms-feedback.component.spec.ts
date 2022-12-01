import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalSmsFeedbackComponent } from './digital-sms-feedback.component';

describe('DigitalSmsFeedbackComponent', () => {
  let component: DigitalSmsFeedbackComponent;
  let fixture: ComponentFixture<DigitalSmsFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalSmsFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalSmsFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
