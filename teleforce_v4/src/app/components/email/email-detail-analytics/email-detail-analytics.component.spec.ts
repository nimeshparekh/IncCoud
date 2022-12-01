import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailDetailAnalyticsComponent } from './email-detail-analytics.component';

describe('SmsCampaignDetailComponent', () => {
  let component: EmailDetailAnalyticsComponent;
  let fixture: ComponentFixture<EmailDetailAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailDetailAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailDetailAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
