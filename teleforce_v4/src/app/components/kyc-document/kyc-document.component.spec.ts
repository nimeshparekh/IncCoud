import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycDocumentComponent } from './kyc-document.component';

describe('KycDocumentComponent', () => {
  let component: KycDocumentComponent;
  let fixture: ComponentFixture<KycDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
