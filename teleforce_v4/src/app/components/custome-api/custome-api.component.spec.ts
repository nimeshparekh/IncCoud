import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeApiComponent } from './custome-api.component';

describe('CustomeApiComponent', () => {
  let component: CustomeApiComponent;
  let fixture: ComponentFixture<CustomeApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomeApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomeApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
