import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalFeedbackComponent } from './digital-feedback.component';

describe('DigitalFeedbackComponent', () => {
  let component: DigitalFeedbackComponent;
  let fixture: ComponentFixture<DigitalFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
