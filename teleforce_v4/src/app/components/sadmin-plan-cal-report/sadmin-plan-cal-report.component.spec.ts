import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SadminPlanCalReportComponent } from './sadmin-plan-cal-report.component';

describe('SadminPlanCalReportComponent', () => {
  let component: SadminPlanCalReportComponent;
  let fixture: ComponentFixture<SadminPlanCalReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SadminPlanCalReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SadminPlanCalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
