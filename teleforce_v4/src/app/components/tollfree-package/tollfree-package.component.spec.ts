import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TollfreePackageComponent } from './tollfree-package.component';

describe('TollfreePackageComponent', () => {
  let component: TollfreePackageComponent;
  let fixture: ComponentFixture<TollfreePackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollfreePackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TollfreePackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
