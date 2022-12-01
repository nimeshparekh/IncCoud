import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialerDialogComponent } from './dialer-dialog.component';

describe('DialerDialogComponent', () => {
  let component: DialerDialogComponent;
  let fixture: ComponentFixture<DialerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
