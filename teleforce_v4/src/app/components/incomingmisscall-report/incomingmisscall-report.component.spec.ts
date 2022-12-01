import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingmisscallReportComponent } from './incomingmisscall-report.component';

describe('IncomingmisscallReportComponent', () => {
  let component: IncomingmisscallReportComponent;
  let fixture: ComponentFixture<IncomingmisscallReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingmisscallReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingmisscallReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
