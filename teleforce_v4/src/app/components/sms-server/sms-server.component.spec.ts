import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsServerComponent } from './sms-server.component';

describe('SmsServerComponent', () => {
  let component: SmsServerComponent;
  let fixture: ComponentFixture<SmsServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
