import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsGroupsComponent } from './agents-groups.component';

describe('AgentsGroupsComponent', () => {
  let component: AgentsGroupsComponent;
  let fixture: ComponentFixture<AgentsGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentsGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentsGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
