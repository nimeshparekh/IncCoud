import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTelemeetPackageComponent } from './create-telemeet-package.component';

describe('CreateTelemeetPackageComponent', () => {
  let component: CreateTelemeetPackageComponent;
  let fixture: ComponentFixture<CreateTelemeetPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTelemeetPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTelemeetPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
