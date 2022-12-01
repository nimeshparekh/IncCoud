import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMailreqLeadComponent } from './create-mailreq-lead.component';

describe('CreateMailreqLeadComponent', () => {
  let component: CreateMailreqLeadComponent;
  let fixture: ComponentFixture<CreateMailreqLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMailreqLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMailreqLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
