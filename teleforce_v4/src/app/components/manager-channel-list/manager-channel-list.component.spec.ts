import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerChannelListComponent } from './manager-channel-list.component';

describe('ManagerChannelListComponent', () => {
  let component: ManagerChannelListComponent;
  let fixture: ComponentFixture<ManagerChannelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerChannelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerChannelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
