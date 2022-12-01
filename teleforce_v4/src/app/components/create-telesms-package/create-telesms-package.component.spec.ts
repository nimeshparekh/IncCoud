import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTelesmsPackageComponent } from './create-telesms-package.component';

describe('CreateTelesmsPackageComponent', () => {
  let component: CreateTelesmsPackageComponent;
  let fixture: ComponentFixture<CreateTelesmsPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTelesmsPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTelesmsPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
