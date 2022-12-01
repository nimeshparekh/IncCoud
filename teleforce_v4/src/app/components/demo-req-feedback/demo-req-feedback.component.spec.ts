import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoReqFeedbackComponent } from './demo-req-feedback.component';

describe('DemoReqFeedbackComponent', () => {
  let component: DemoReqFeedbackComponent;
  let fixture: ComponentFixture<DemoReqFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoReqFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoReqFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
