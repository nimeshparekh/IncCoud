import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDirectoryComponent } from './media-directory.component';

describe('MediaDirectoryComponent', () => {
  let component: MediaDirectoryComponent;
  let fixture: ComponentFixture<MediaDirectoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaDirectoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
