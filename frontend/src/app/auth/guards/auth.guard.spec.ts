import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { AUTH_SERVICE_TOKEN } from '../../shared/interfaces/dependency-injection';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AUTH_SERVICE_TOKEN, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate()', () => {
    it('should return true when user is authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      const result = guard.canActivate({} as any, { url: '/checkout' } as any);
      expect(result).toBeTrue();
    });

    it('should return false when user is not authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);
      const result = guard.canActivate({} as any, { url: '/checkout' } as any);
      expect(result).toBeFalse();
    });

    it('should redirect to /auth/login when not authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);
      guard.canActivate({} as any, { url: '/orders' } as any);
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['/auth/login'],
        { queryParams: { returnUrl: '/orders' } }
      );
    });

    it('should NOT redirect when user is authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      guard.canActivate({} as any, { url: '/orders' } as any);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should pass the current URL as returnUrl query param', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);
      guard.canActivate({} as any, { url: '/checkout/summary' } as any);
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['/auth/login'],
        { queryParams: { returnUrl: '/checkout/summary' } }
      );
    });
  });
});
