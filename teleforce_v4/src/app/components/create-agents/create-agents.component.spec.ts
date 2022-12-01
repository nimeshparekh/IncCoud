import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAgentsComponent } from './create-agents.component';

describe('CreateAgentsComponent', () => {
  let component: CreateAgentsComponent;
  let fixture: ComponentFixture<CreateAgentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAgentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
