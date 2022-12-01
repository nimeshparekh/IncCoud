import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreNotificationComponent } from './more-notification.component';

describe('MoreNotificationComponent', () => {
  let component: MoreNotificationComponent;
  let fixture: ComponentFixture<MoreNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
