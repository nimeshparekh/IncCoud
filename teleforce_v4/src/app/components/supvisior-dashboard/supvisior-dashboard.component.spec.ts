import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupvisiorDashboardComponent } from './supvisior-dashboard.component';

describe('SupvisiorDashboardComponent', () => {
  let component: SupvisiorDashboardComponent;
  let fixture: ComponentFixture<SupvisiorDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupvisiorDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupvisiorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
