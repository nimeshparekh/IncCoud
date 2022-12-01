import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupRequestComponent } from './signup-request.component';

describe('SignupRequestComponent', () => {
  let component: SignupRequestComponent;
  let fixture: ComponentFixture<SignupRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
