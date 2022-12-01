import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerSmsServerComponent } from './manager-sms-server.component';

describe('ManagerSmsServerComponent', () => {
  let component: ManagerSmsServerComponent;
  let fixture: ComponentFixture<ManagerSmsServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerSmsServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerSmsServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
