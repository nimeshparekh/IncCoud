import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConferenceCallComponent } from './create-conference-call.component';

describe('CreateConferenceCallComponent', () => {
  let component: CreateConferenceCallComponent;
  let fixture: ComponentFixture<CreateConferenceCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateConferenceCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateConferenceCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
