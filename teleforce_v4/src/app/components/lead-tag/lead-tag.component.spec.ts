import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadTagComponent } from './lead-tag.component';

describe('LeadTagComponent', () => {
  let component: LeadTagComponent;
  let fixture: ComponentFixture<LeadTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
