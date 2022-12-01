import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerUserReportComponent } from './manager-user-report.component';

describe('ManagerUserReportComponent', () => {
  let component: ManagerUserReportComponent;
  let fixture: ComponentFixture<ManagerUserReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerUserReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerUserReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
