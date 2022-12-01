import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailCampaignDetailComponent } from './email-campaign-detail.component';

describe('SmsCampaignDetailComponent', () => {
  let component: EmailCampaignDetailComponent;
  let fixture: ComponentFixture<EmailCampaignDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailCampaignDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailCampaignDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
