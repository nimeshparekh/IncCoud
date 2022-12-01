import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsBreakReportComponent } from './agents-break-report.component';

describe('AgentsBreakReportComponent', () => {
  let component: AgentsBreakReportComponent;
  let fixture: ComponentFixture<AgentsBreakReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentsBreakReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentsBreakReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
