import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerAgentListComponent } from './manager-agent-list.component';

describe('ManagerAgentListComponent', () => {
  let component: ManagerAgentListComponent;
  let fixture: ComponentFixture<ManagerAgentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerAgentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerAgentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
