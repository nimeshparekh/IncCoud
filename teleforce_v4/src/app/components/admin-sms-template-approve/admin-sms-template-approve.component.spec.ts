import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSmsTemplateApproveComponent } from './admin-sms-template-approve.component';

describe('AdminSmsTemplateApproveComponent', () => {
  let component: AdminSmsTemplateApproveComponent;
  let fixture: ComponentFixture<AdminSmsTemplateApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSmsTemplateApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSmsTemplateApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
