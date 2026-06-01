import { TestBed } from '@angular/core/testing';

import { HousesApi } from './houses-api';

describe('HousesApi', () => {
  let service: HousesApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HousesApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
