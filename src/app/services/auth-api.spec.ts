import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthApi } from './auth-api';

describe('AuthApi', () => {
  let service: AuthApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should POST to the login endpoint', () => {
      service.login('user', 'password123').subscribe();
      const req = httpMock.expectOne('http://localhost:3000/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'user', password: 'password123' });
      req.flush({ token: 'mock-token' });
    });

    it('should set token and username signals on success', () => {
      service.login('user', 'password123').subscribe();
      const req = httpMock.expectOne('http://localhost:3000/login');
      req.flush({ token: 'mock-token' });
      expect(service.token()).toBe('mock-token');
      expect(service.username()).toBe('user');
    });

    it('should persist token and username to sessionStorage', () => {
      service.login('user', 'password123').subscribe();
      const req = httpMock.expectOne('http://localhost:3000/login');
      req.flush({ token: 'mock-token' });
      expect(sessionStorage.getItem('token')).toBe('mock-token');
      expect(sessionStorage.getItem('username')).toBe('user');
    });
  });

  describe('register', () => {
    it('should POST to the register endpoint', () => {
      service.register('user', 'password123').subscribe();
      const req = httpMock.expectOne('http://localhost:3000/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'user', password: 'password123' });
      req.flush({});
    });
  });

  describe('token rehydration', () => {
    it('should rehydrate token from sessionStorage on init', () => {
      sessionStorage.setItem('token', 'existing-token');
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting()],
      });
      const freshService = TestBed.inject(AuthApi);
      expect(freshService.token()).toBe('existing-token');
    });
  });
});