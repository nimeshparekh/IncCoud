import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcwReportComponent } from './acw-report.component';

describe('AcwReportComponent', () => {
  let component: AcwReportComponent;
  let fixture: ComponentFixture<AcwReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcwReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcwReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
