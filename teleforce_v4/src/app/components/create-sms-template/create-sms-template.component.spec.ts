import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSmsTemplateComponent } from './create-sms-template.component';

describe('CreateSmsTemplateComponent', () => {
  let component: CreateSmsTemplateComponent;
  let fixture: ComponentFixture<CreateSmsTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSmsTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSmsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
