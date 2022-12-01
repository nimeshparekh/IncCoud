import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallTransferComponent } from './call-transfer.component';

describe('CallTransferComponent', () => {
  let component: CallTransferComponent;
  let fixture: ComponentFixture<CallTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
