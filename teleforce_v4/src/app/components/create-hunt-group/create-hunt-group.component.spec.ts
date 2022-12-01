import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHuntGroupComponent } from './create-hunt-group.component';

describe('CreateHuntGroupComponent', () => {
  let component: CreateHuntGroupComponent;
  let fixture: ComponentFixture<CreateHuntGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateHuntGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHuntGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
