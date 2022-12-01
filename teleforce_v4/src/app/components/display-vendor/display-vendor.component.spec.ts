import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayVendorComponent } from './display-vendor.component';

describe('DisplayVendorComponent', () => {
  let component: DisplayVendorComponent;
  let fixture: ComponentFixture<DisplayVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
