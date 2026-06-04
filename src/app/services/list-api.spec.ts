import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ListApi } from './list-api';
import { BASE_URL } from '../';

describe('ListApi', () => {
  let service: ListApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ListApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getHouses', () => {
    it('should send a GET request to the correct url', () => {
      service.getHouses(1).subscribe();

      const req = httpMock.expectOne((r) => r.url === BASE_URL);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should send the correct page and pageSize params', () => {
      service.getHouses(2, 10).subscribe();

      const req = httpMock.expectOne((r) => r.url === BASE_URL);
      expect(req.request.params.get('page')).toBe('2');
      expect(req.request.params.get('pageSize')).toBe('10');
      req.flush([]);
    });

    it('should use default pageSize of 20 when not provided', () => {
      service.getHouses(1).subscribe();

      const req = httpMock.expectOne((r) => r.url === BASE_URL);
      expect(req.request.params.get('pageSize')).toBe('20');
      req.flush([]);
    });

    it('should return the response body', async () => {
      const mockHouses = [{ name: 'House Stark' }, { name: 'House Lannister' }];
      let result: any;

      service.getHouses(1).subscribe((data) => (result = data));

      const req = httpMock.expectOne((r) => r.url === BASE_URL);
      req.flush(mockHouses);

      expect(result).toEqual(mockHouses);
    });
  });
});