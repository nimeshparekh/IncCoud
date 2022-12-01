import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSmsTemplateComponent } from './admin-sms-template.component';

describe('AdminSmsTemplateComponent', () => {
  let component: AdminSmsTemplateComponent;
  let fixture: ComponentFixture<AdminSmsTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSmsTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSmsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
