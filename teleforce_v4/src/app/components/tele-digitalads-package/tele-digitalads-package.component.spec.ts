import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleDigitaladsPackageComponent } from './tele-digitalads-package.component';

describe('TeleDigitaladsPackageComponent', () => {
  let component: TeleDigitaladsPackageComponent;
  let fixture: ComponentFixture<TeleDigitaladsPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleDigitaladsPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleDigitaladsPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
