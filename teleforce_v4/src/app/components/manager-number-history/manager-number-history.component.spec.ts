import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerNumberHistoryComponent } from './manager-number-history.component';

describe('ManagerNumberHistoryComponent', () => {
  let component: ManagerNumberHistoryComponent;
  let fixture: ComponentFixture<ManagerNumberHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerNumberHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerNumberHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
