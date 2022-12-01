import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallPluseReportComponent } from './call-pluse-report.component';

describe('CallPluseReportComponent', () => {
  let component: CallPluseReportComponent;
  let fixture: ComponentFixture<CallPluseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallPluseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallPluseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
