import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleMeetPackageComponent } from './tele-meet-package.component';

describe('TeleMeetPackageComponent', () => {
  let component: TeleMeetPackageComponent;
  let fixture: ComponentFixture<TeleMeetPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleMeetPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleMeetPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
