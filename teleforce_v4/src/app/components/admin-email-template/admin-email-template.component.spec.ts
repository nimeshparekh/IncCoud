import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEmailTemplateComponent } from './admin-email-template.component';

describe('AdminEmailTemplateComponent', () => {
  let component: AdminEmailTemplateComponent;
  let fixture: ComponentFixture<AdminEmailTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEmailTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
