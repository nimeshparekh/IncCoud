import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadConfigComponent } from './lead-config.component';

describe('LeadConfigComponent', () => {
  let component: LeadConfigComponent;
  let fixture: ComponentFixture<LeadConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
