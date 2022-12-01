import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleEmailTemplateComponent } from './schedule-email-template.component';

describe('ScheduleEmailTemplateComponent', () => {
  let component: ScheduleEmailTemplateComponent;
  let fixture: ComponentFixture<ScheduleEmailTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleEmailTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
