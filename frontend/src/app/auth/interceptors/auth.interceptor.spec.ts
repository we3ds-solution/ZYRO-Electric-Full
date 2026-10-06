import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceSpy: any;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getAuthToken', 'logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy.logout.and.returnValue({ subscribe: (fn: any) => fn() } as any);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AuthInterceptor,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const interceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });

  describe('Token injection', () => {
    it('should add Authorization header when token exists and URL is not auth endpoint', () => {
      authServiceSpy.getAuthToken.and.returnValue('test_token_123');
      http.get('/api/products').subscribe();
      const req = httpMock.expectOne('/api/products');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test_token_123');
      req.flush({});
    });

    it('should NOT add Authorization header when token is null', () => {
      authServiceSpy.getAuthToken.and.returnValue(null);
      http.get('/api/products').subscribe();
      const req = httpMock.expectOne('/api/products');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush({});
    });

    it('should NOT add Authorization header for auth endpoints', () => {
      authServiceSpy.getAuthToken.and.returnValue('test_token_123');
      http.post('/auth/login', {}).subscribe();
      const req = httpMock.expectOne('/auth/login');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush({});
    });
  });

  describe('Error handling', () => {
    it('should call router.navigate to /auth/login on 401', () => {
      authServiceSpy.getAuthToken.and.returnValue(null);
      http.get('/api/orders').subscribe({ error: () => {} });
      const req = httpMock.expectOne('/api/orders');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should call router.navigate to /403 on 403', () => {
      authServiceSpy.getAuthToken.and.returnValue(null);
      http.get('/api/admin').subscribe({ error: () => {} });
      const req = httpMock.expectOne('/api/admin');
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/403']);
    });

    it('should re-throw the error on any HTTP error', () => {
      authServiceSpy.getAuthToken.and.returnValue(null);
      let thrownError: any;
      http.get('/api/products').subscribe({ error: e => thrownError = e });
      const req = httpMock.expectOne('/api/products');
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
      expect(thrownError).toBeTruthy();
      expect(thrownError.status).toBe(500);
    });
  });
});
