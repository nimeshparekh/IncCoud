import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledPostComponent } from './scheduled-post.component';

describe('ScheduledPostComponent', () => {
  let component: ScheduledPostComponent;
  let fixture: ComponentFixture<ScheduledPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
