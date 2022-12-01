import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IvrInputReportComponent } from './ivr-input-report.component';

describe('IvrInputReportComponent', () => {
  let component: IvrInputReportComponent;
  let fixture: ComponentFixture<IvrInputReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IvrInputReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IvrInputReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
