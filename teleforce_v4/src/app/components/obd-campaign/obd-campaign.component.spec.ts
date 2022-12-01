import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObdCampaignComponent } from './obd-campaign.component';

describe('ObdCampaignComponent', () => {
  let component: ObdCampaignComponent;
  let fixture: ComponentFixture<ObdCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObdCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObdCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
