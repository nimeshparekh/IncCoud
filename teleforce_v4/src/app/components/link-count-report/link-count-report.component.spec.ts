import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkCountReportComponent } from './link-count-report.component';

describe('LinkCountReportComponent', () => {
  let component: LinkCountReportComponent;
  let fixture: ComponentFixture<LinkCountReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkCountReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkCountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
