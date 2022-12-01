import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveSoundUploadComponent } from './approve-sound-upload.component';

describe('ApproveSoundUploadComponent', () => {
  let component: ApproveSoundUploadComponent;
  let fixture: ComponentFixture<ApproveSoundUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveSoundUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveSoundUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
