import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSupervisiorComponent } from './assign-supervisior.component';

describe('AssignSupervisiorComponent', () => {
  let component: AssignSupervisiorComponent;
  let fixture: ComponentFixture<AssignSupervisiorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignSupervisiorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignSupervisiorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
