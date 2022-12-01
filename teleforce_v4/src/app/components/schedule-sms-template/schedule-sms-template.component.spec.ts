import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSmsTemplateComponent } from './schedule-sms-template.component';

describe('ScheduleSmsTemplateComponent', () => {
  let component: ScheduleSmsTemplateComponent;
  let fixture: ComponentFixture<ScheduleSmsTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleSmsTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleSmsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
