import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelephonyMailComponent } from './telephony-mail.component';

describe('TelephonyMailComponent', () => {
  let component: TelephonyMailComponent;
  let fixture: ComponentFixture<TelephonyMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelephonyMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelephonyMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
