import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerReportsDashboardComponent } from './manager-reports-dashboard.component';

describe('ManagerReportsDashboardComponent', () => {
  let component: ManagerReportsDashboardComponent;
  let fixture: ComponentFixture<ManagerReportsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerReportsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerReportsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
