import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackFormFillComponent } from './feedback-form-fill.component';

describe('FeedbackFormFillComponent', () => {
  let component: FeedbackFormFillComponent;
  let fixture: ComponentFixture<FeedbackFormFillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackFormFillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackFormFillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
