import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleMailPackageComponent } from './tele-mail-package.component';

describe('TeleMailPackageComponent', () => {
  let component: TeleMailPackageComponent;
  let fixture: ComponentFixture<TeleMailPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleMailPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleMailPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
