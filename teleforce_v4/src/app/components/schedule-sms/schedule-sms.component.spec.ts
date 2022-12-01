import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSmsComponent } from './schedule-sms.component';

describe('ScheduleSmsComponent', () => {
  let component: ScheduleSmsComponent;
  let fixture: ComponentFixture<ScheduleSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
