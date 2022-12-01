import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCallerReportComponent } from './new-caller-report.component';

describe('NewCallerReportComponent', () => {
  let component: NewCallerReportComponent;
  let fixture: ComponentFixture<NewCallerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCallerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCallerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
