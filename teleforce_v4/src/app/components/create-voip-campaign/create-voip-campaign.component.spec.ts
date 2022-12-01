import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVoipCampaignComponent } from './create-voip-campaign.component';

describe('CreateVoipCampaignComponent', () => {
  let component: CreateVoipCampaignComponent;
  let fixture: ComponentFixture<CreateVoipCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVoipCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVoipCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
