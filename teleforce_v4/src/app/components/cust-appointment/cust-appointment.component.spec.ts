import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustAppointmentComponent } from './cust-appointment.component';

describe('CustAppointmentComponent', () => {
  let component: CustAppointmentComponent;
  let fixture: ComponentFixture<CustAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
