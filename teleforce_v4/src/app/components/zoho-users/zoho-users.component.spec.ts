import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZohoUsersComponent } from './zoho-users.component';

describe('ZohoUsersComponent', () => {
  let component: ZohoUsersComponent;
  let fixture: ComponentFixture<ZohoUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZohoUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZohoUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
