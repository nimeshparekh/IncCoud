import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdminEmailComponent } from './create-admin-email.component';

describe('CreateAdminEmailComponent', () => {
  let component: CreateAdminEmailComponent;
  let fixture: ComponentFixture<CreateAdminEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAdminEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAdminEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
