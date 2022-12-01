import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTeledigitalPackageComponent } from './create-teledigital-package.component';

describe('CreateTeledigitalPackageComponent', () => {
  let component: CreateTeledigitalPackageComponent;
  let fixture: ComponentFixture<CreateTeledigitalPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTeledigitalPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTeledigitalPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
