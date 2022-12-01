import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmailServerComponent } from './create-email-server.component';

describe('CreateEmailServerComponent', () => {
  let component: CreateEmailServerComponent;
  let fixture: ComponentFixture<CreateEmailServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEmailServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEmailServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
