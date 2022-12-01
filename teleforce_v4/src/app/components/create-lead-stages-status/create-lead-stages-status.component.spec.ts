import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLeadStagesStatusComponent } from './create-lead-stages-status.component';

describe('CreateLeadStagesStatusComponent', () => {
  let component: CreateLeadStagesStatusComponent;
  let fixture: ComponentFixture<CreateLeadStagesStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLeadStagesStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLeadStagesStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
