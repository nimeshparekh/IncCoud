import { TestBed } from '@angular/core/testing';

import { LmsreportService } from './lmsreport.service';

describe('LmsreportService', () => {
  let service: LmsreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LmsreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
