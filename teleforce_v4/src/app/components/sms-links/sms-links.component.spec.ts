import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsLinksComponent } from './sms-links.component';

describe('SmsLinksComponent', () => {
  let component: SmsLinksComponent;
  let fixture: ComponentFixture<SmsLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
