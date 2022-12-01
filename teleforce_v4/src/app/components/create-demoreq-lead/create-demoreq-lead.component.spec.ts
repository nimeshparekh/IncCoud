import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDemoreqLeadComponent } from './create-demoreq-lead.component';

describe('CreateDemoreqLeadComponent', () => {
  let component: CreateDemoreqLeadComponent;
  let fixture: ComponentFixture<CreateDemoreqLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDemoreqLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDemoreqLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
