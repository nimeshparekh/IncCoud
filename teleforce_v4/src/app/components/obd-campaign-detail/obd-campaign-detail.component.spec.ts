import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObdCampaignDetailComponent } from './obd-campaign-detail.component';

describe('ObdCampaignDetailComponent', () => {
  let component: ObdCampaignDetailComponent;
  let fixture: ComponentFixture<ObdCampaignDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObdCampaignDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObdCampaignDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
