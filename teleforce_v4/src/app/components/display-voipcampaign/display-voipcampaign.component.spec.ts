import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayVoipcampaignComponent } from './display-voipcampaign.component';

describe('DisplayVoipcampaignComponent', () => {
  let component: DisplayVoipcampaignComponent;
  let fixture: ComponentFixture<DisplayVoipcampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayVoipcampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayVoipcampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
