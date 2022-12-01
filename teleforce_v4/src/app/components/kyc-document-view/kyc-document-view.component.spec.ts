import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycDocumentViewComponent } from './kyc-document-view.component';

describe('KycDocumentViewComponent', () => {
  let component: KycDocumentViewComponent;
  let fixture: ComponentFixture<KycDocumentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycDocumentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycDocumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
