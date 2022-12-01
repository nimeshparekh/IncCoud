import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssignLeadComponent } from './create-assign-lead.component';

describe('CreateAssignLeadComponent', () => {
  let component: CreateAssignLeadComponent;
  let fixture: ComponentFixture<CreateAssignLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAssignLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAssignLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
