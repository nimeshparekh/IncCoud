import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareWhatsappCallLogComponent } from './share-whatsapp-call-log.component';

describe('ShareWhatsappCallLogComponent', () => {
  let component: ShareWhatsappCallLogComponent;
  let fixture: ComponentFixture<ShareWhatsappCallLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareWhatsappCallLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareWhatsappCallLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
