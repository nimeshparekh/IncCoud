import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTempManagerComponent } from './create-temp-manager.component';

describe('CreateTempManagerComponent', () => {
  let component: CreateTempManagerComponent;
  let fixture: ComponentFixture<CreateTempManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTempManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTempManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
