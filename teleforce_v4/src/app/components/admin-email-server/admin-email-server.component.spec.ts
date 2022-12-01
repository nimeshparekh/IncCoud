import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEmailServerComponent } from './admin-email-server.component';

describe('AdminEmailServerComponent', () => {
  let component: AdminEmailServerComponent;
  let fixture: ComponentFixture<AdminEmailServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEmailServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEmailServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
