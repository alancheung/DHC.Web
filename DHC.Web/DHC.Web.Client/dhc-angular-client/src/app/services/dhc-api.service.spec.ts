import { TestBed } from '@angular/core/testing';

import { DhcApiService } from './dhc-api.service';

describe('DhcApiService', () => {
  let service: DhcApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DhcApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
