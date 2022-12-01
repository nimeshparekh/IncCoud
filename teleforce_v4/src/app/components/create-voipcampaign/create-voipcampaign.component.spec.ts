import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVoipcampaignComponent } from './create-voipcampaign.component';

describe('CreateVoipcampaignComponent', () => {
  let component: CreateVoipcampaignComponent;
  let fixture: ComponentFixture<CreateVoipcampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVoipcampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVoipcampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
