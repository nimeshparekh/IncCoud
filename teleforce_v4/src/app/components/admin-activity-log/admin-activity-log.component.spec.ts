import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActivityLogComponent } from './admin-activity-log.component';

describe('AdminActivityLogComponent', () => {
  let component: AdminActivityLogComponent;
  let fixture: ComponentFixture<AdminActivityLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminActivityLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
