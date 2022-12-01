import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayVisitorDataComponent } from './display-visitor-data.component';

describe('DisplayVisitorDataComponent', () => {
  let component: DisplayVisitorDataComponent;
  let fixture: ComponentFixture<DisplayVisitorDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayVisitorDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayVisitorDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
