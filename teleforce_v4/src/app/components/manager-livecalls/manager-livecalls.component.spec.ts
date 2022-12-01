import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerLivecallsComponent } from './manager-livecalls.component';

describe('ManagerLivecallsComponent', () => {
  let component: ManagerLivecallsComponent;
  let fixture: ComponentFixture<ManagerLivecallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerLivecallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerLivecallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
