import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewRateReportComponent } from './review-rate-report.component';

describe('ReviewRateReportComponent', () => {
  let component: ReviewRateReportComponent;
  let fixture: ComponentFixture<ReviewRateReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewRateReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewRateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
