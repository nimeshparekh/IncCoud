import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignAgentCampaginComponent } from './assign-agent-campagin.component';

describe('AssignAgentCampaginComponent', () => {
  let component: AssignAgentCampaginComponent;
  let fixture: ComponentFixture<AssignAgentCampaginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignAgentCampaginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignAgentCampaginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
