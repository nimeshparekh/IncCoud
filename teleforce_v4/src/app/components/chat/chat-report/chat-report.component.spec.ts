import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatReportComponent } from './chat-report.component';

describe('ChatReportComponent', () => {
  let component: ChatReportComponent;
  let fixture: ComponentFixture<ChatReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
