import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsAnalyticComponent } from './lms-analytic.component';

describe('LmsAnalyticComponent', () => {
  let component: LmsAnalyticComponent;
  let fixture: ComponentFixture<LmsAnalyticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LmsAnalyticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LmsAnalyticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
