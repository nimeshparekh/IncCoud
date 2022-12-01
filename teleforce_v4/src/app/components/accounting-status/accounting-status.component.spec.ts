import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingStatusComponent } from './accounting-status.component';

describe('AccountingStatusComponent', () => {
  let component: AccountingStatusComponent;
  let fixture: ComponentFixture<AccountingStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
