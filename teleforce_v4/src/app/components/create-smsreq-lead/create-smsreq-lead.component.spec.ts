import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSmsreqLeadComponent } from './create-smsreq-lead.component';

describe('CreateSmsreqLeadComponent', () => {
  let component: CreateSmsreqLeadComponent;
  let fixture: ComponentFixture<CreateSmsreqLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSmsreqLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSmsreqLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
