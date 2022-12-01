import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallReviewFormComponent } from './call-review-form.component';

describe('CallReviewFormComponent', () => {
  let component: CallReviewFormComponent;
  let fixture: ComponentFixture<CallReviewFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallReviewFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
