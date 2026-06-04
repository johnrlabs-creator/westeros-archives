import { TestBed } from '@angular/core/testing';

import { UrlUtils } from './url.utils';

describe('UrlUtils', () => {
  let service: UrlUtils;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlUtils);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
