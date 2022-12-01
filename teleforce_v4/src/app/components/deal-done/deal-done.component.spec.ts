import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealDoneComponent } from './deal-done.component';

describe('DealDoneComponent', () => {
  let component: DealDoneComponent;
  let fixture: ComponentFixture<DealDoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealDoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
