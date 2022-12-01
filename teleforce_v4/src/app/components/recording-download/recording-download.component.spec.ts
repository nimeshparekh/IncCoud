import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingDownloadComponent } from './recording-download.component';

describe('RecordingDownloadComponent', () => {
  let component: RecordingDownloadComponent;
  let fixture: ComponentFixture<RecordingDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordingDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
