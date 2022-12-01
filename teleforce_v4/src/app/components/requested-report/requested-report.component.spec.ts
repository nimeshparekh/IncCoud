import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedReportComponent } from './requested-report.component';

describe('RequestedReportComponent', () => {
  let component: RequestedReportComponent;
  let fixture: ComponentFixture<RequestedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
