import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsCampaignComponent } from './sms-campaign.component';

describe('SocialChannelsComponent', () => {
  let component: SmsCampaignComponent;
  let fixture: ComponentFixture<SmsCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
