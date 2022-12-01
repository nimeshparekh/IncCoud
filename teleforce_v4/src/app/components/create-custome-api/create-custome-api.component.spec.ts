import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomeApiComponent } from './create-custome-api.component';

describe('CreateCustomeApiComponent', () => {
  let component: CreateCustomeApiComponent;
  let fixture: ComponentFixture<CreateCustomeApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCustomeApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCustomeApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
