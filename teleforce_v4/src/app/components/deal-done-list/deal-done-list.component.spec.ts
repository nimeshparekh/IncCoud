import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealDoneListComponent } from './deal-done-list.component';

describe('DealDoneListComponent', () => {
  let component: DealDoneListComponent;
  let fixture: ComponentFixture<DealDoneListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealDoneListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealDoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
