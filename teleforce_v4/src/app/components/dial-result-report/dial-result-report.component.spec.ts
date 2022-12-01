import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialResultReportComponent } from './dial-result-report.component';

describe('DialResultReportComponent', () => {
  let component: DialResultReportComponent;
  let fixture: ComponentFixture<DialResultReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialResultReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialResultReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
