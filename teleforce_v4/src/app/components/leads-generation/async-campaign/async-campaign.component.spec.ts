import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsyncCampaignComponent } from './async-campaign.component';

describe('AsyncCampaignComponent', () => {
  let component: AsyncCampaignComponent;
  let fixture: ComponentFixture<AsyncCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsyncCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsyncCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
