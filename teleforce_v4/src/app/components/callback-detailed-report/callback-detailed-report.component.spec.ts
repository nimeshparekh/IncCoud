import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackDetailedReportComponent } from './callback-detailed-report.component';

describe('CallbackDetailedReportComponent', () => {
  let component: CallbackDetailedReportComponent;
  let fixture: ComponentFixture<CallbackDetailedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallbackDetailedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
