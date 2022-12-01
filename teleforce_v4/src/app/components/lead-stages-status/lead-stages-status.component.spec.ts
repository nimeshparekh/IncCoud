import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadStagesStatusComponent } from './lead-stages-status.component';

describe('LeadStagesStatusComponent', () => {
  let component: LeadStagesStatusComponent;
  let fixture: ComponentFixture<LeadStagesStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadStagesStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadStagesStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
