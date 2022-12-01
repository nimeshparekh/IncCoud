import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelephonyDigitalComponent } from './telephony-digital.component';

describe('TelephonyDigitalComponent', () => {
  let component: TelephonyDigitalComponent;
  let fixture: ComponentFixture<TelephonyDigitalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelephonyDigitalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelephonyDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
