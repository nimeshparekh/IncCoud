import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MamagerLoginComponent } from './mamager-login.component';

describe('MamagerLoginComponent', () => {
  let component: MamagerLoginComponent;
  let fixture: ComponentFixture<MamagerLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MamagerLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MamagerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
