import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteChatComponent } from './website-chat.component';

describe('WebsiteChatComponent', () => {
  let component: WebsiteChatComponent;
  let fixture: ComponentFixture<WebsiteChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsiteChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
