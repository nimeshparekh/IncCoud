import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDispotionCallComponent } from './create-dispotion-call.component';

describe('CreateDispotionCallComponent', () => {
  let component: CreateDispotionCallComponent;
  let fixture: ComponentFixture<CreateDispotionCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDispotionCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDispotionCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
