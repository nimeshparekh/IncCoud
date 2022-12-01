import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerInvoiceReportComponent } from './manager-invoice-report.component';

describe('ManagerInvoiceReportComponent', () => {
  let component: ManagerInvoiceReportComponent;
  let fixture: ComponentFixture<ManagerInvoiceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerInvoiceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerInvoiceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
