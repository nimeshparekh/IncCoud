import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTelemailPackageComponent } from './create-telemail-package.component';

describe('CreateTelemailPackageComponent', () => {
  let component: CreateTelemailPackageComponent;
  let fixture: ComponentFixture<CreateTelemailPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTelemailPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTelemailPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
