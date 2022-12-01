import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWhatsappTemplateComponent } from './create-whatsapp-template.component';

describe('CreateWhatsappTemplateComponent', () => {
  let component: CreateWhatsappTemplateComponent;
  let fixture: ComponentFixture<CreateWhatsappTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWhatsappTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWhatsappTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
