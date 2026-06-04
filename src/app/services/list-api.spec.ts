import { TestBed } from '@angular/core/testing';

import { ListApi } from './list-api';

describe('ListApi', () => {
  let service: ListApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
