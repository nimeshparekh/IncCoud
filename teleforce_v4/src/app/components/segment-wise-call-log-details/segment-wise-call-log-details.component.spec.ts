import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentWiseCallLogDetailsComponent } from './segment-wise-call-log-details.component';

describe('SegmentWiseCallLogDetailsComponent', () => {
  let component: SegmentWiseCallLogDetailsComponent;
  let fixture: ComponentFixture<SegmentWiseCallLogDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentWiseCallLogDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentWiseCallLogDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
