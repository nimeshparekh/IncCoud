import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalMailFeedbackComponent } from './digital-mail-feedback.component';

describe('DigitalMailFeedbackComponent', () => {
  let component: DigitalMailFeedbackComponent;
  let fixture: ComponentFixture<DigitalMailFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalMailFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalMailFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
