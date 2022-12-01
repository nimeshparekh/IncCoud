import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdminSmsComponent } from './create-admin-sms.component';

describe('CreateAdminSmsComponent', () => {
  let component: CreateAdminSmsComponent;
  let fixture: ComponentFixture<CreateAdminSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAdminSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAdminSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
