import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycDocumentUploadComponent } from './kyc-document-upload.component';

describe('KycDocumentUploadComponent', () => {
  let component: KycDocumentUploadComponent;
  let fixture: ComponentFixture<KycDocumentUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycDocumentUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
