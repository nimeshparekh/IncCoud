import { TestBed } from '@angular/core/testing';

import { SmscampaignService } from './smscampaign.service';

describe('SmscampaignService', () => {
  let service: SmscampaignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmscampaignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
