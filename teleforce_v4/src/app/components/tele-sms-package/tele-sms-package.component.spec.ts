import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleSmsPackageComponent } from './tele-sms-package.component';

describe('TeleSmsPackageComponent', () => {
  let component: TeleSmsPackageComponent;
  let fixture: ComponentFixture<TeleSmsPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleSmsPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleSmsPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
