import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignTypeComponent } from './campaign-type.component';

describe('CampaignTypeComponent', () => {
  let component: CampaignTypeComponent;
  let fixture: ComponentFixture<CampaignTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
