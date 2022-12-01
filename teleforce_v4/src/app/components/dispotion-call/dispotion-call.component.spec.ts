import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispotionCallComponent } from './dispotion-call.component';

describe('DispotionCallComponent', () => {
  let component: DispotionCallComponent;
  let fixture: ComponentFixture<DispotionCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispotionCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispotionCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
