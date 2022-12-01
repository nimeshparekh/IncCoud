import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallRecordingListComponent } from './call-recording-list.component';

describe('CallRecordingListComponent', () => {
  let component: CallRecordingListComponent;
  let fixture: ComponentFixture<CallRecordingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallRecordingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallRecordingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
