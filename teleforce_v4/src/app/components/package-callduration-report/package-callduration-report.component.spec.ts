import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageCalldurationReportComponent } from './package-callduration-report.component';

describe('PackageCalldurationReportComponent', () => {
  let component: PackageCalldurationReportComponent;
  let fixture: ComponentFixture<PackageCalldurationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageCalldurationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageCalldurationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
