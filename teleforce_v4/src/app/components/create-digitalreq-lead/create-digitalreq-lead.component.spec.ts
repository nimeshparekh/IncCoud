import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDigitalreqLeadComponent } from './create-digitalreq-lead.component';

describe('CreateDigitalreqLeadComponent', () => {
  let component: CreateDigitalreqLeadComponent;
  let fixture: ComponentFixture<CreateDigitalreqLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDigitalreqLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDigitalreqLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
