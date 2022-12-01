import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGstDisplayComponent } from './admin-gst-display.component';

describe('AdminGstDisplayComponent', () => {
  let component: AdminGstDisplayComponent;
  let fixture: ComponentFixture<AdminGstDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGstDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGstDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
