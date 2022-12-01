import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OBDPackageComponent } from './obd-package.component';

describe('OBDPackageComponent', () => {
  let component: OBDPackageComponent;
  let fixture: ComponentFixture<OBDPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OBDPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OBDPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
