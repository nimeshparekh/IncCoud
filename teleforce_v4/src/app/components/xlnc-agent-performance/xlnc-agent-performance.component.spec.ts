import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XlncAgentPerformanceComponent } from './xlnc-agent-performance.component';

describe('XlncAgentPerformanceComponent', () => {
  let component: XlncAgentPerformanceComponent;
  let fixture: ComponentFixture<XlncAgentPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XlncAgentPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XlncAgentPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
