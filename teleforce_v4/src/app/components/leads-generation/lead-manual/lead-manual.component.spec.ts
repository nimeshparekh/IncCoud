import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadManualComponent } from './lead-manual.component';

describe('LeadManualComponent', () => {
  let component: LeadManualComponent;
  let fixture: ComponentFixture<LeadManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
