import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareWhatsappComponent } from './share-whatsapp.component';

describe('ShareWhatsappComponent', () => {
  let component: ShareWhatsappComponent;
  let fixture: ComponentFixture<ShareWhatsappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareWhatsappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareWhatsappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
