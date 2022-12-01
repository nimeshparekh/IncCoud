import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldCallingReasonComponent } from './hold-calling-reason.component';

describe('HoldCallingReasonComponent', () => {
  let component: HoldCallingReasonComponent;
  let fixture: ComponentFixture<HoldCallingReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldCallingReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldCallingReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
