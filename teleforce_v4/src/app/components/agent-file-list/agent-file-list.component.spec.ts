import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentFileListComponent } from './agent-file-list.component';

describe('AgentFileListComponent', () => {
  let component: AgentFileListComponent;
  let fixture: ComponentFixture<AgentFileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentFileListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
