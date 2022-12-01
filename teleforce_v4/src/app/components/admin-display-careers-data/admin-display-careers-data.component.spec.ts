import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDisplayCareersDataComponent } from './admin-display-careers-data.component';

describe('AdminDisplayCareersDataComponent', () => {
  let component: AdminDisplayCareersDataComponent;
  let fixture: ComponentFixture<AdminDisplayCareersDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDisplayCareersDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDisplayCareersDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
