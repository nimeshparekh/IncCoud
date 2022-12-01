import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycAprovelComponent } from './kyc-aprovel.component';

describe('KycAprovelComponent', () => {
  let component: KycAprovelComponent;
  let fixture: ComponentFixture<KycAprovelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycAprovelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycAprovelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
