import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelUtilizationComponent } from './channel-utilization.component';

describe('ChannelUtilizationComponent', () => {
  let component: ChannelUtilizationComponent;
  let fixture: ComponentFixture<ChannelUtilizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelUtilizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
