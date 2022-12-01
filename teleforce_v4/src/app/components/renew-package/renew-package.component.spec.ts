import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewPackageComponent } from './renew-package.component';

describe('RenewPackageComponent', () => {
  let component: RenewPackageComponent;
  let fixture: ComponentFixture<RenewPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
