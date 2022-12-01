import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSmsConfigComponent } from './email-sms-config.component';

describe('EmailSmsConfigComponent', () => {
  let component: EmailSmsConfigComponent;
  let fixture: ComponentFixture<EmailSmsConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailSmsConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSmsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
