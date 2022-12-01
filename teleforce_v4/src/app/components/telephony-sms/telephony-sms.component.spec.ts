import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelephonySmsComponent } from './telephony-sms.component';

describe('TelephonySmsComponent', () => {
  let component: TelephonySmsComponent;
  let fixture: ComponentFixture<TelephonySmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelephonySmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelephonySmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
