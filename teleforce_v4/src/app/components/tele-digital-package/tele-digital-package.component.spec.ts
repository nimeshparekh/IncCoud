import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleDigitalPackageComponent } from './tele-digital-package.component';

describe('TeleDigitalPackageComponent', () => {
  let component: TeleDigitalPackageComponent;
  let fixture: ComponentFixture<TeleDigitalPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleDigitalPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleDigitalPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
