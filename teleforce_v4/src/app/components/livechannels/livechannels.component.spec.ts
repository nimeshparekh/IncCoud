import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LivechannelsComponent } from './livechannels.component';

describe('LivechannelsComponent', () => {
  let component: LivechannelsComponent;
  let fixture: ComponentFixture<LivechannelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivechannelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivechannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
