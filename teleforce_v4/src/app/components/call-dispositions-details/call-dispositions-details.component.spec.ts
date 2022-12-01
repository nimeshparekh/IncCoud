import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallDispositionsDetailsComponent } from './call-dispositions-details.component';

describe('CallDispositionsDetailsComponent', () => {
  let component: CallDispositionsDetailsComponent;
  let fixture: ComponentFixture<CallDispositionsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallDispositionsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallDispositionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
