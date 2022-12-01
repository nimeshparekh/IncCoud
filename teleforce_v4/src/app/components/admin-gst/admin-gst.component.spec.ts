import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGstComponent } from './admin-gst.component';

describe('AdminGstComponent', () => {
  let component: AdminGstComponent;
  let fixture: ComponentFixture<AdminGstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
