import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialChannelsComponent } from './social-channels.component';

describe('SocialChannelsComponent', () => {
  let component: SocialChannelsComponent;
  let fixture: ComponentFixture<SocialChannelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialChannelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
