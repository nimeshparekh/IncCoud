import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostMediaComponent } from './post-media.component';

describe('PostMediaComponent', () => {
  let component: PostMediaComponent;
  let fixture: ComponentFixture<PostMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
