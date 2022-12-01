import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpamDidReportComponent } from './spam-did-report.component';

describe('SpamDidReportComponent', () => {
  let component: SpamDidReportComponent;
  let fixture: ComponentFixture<SpamDidReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpamDidReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpamDidReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
