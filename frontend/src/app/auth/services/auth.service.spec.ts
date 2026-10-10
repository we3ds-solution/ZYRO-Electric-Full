import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { AUTH_SERVICE_TOKEN } from '../../shared/interfaces/dependency-injection';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [ AuthService, { provide: AUTH_SERVICE_TOKEN, useExisting: AuthService } ],
      schemas: [ NO_ERRORS_SCHEMA ]});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isAuthenticated()', () => {
    it('should return false by default (no stored session)', () => {
      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should return true after successful login', fakeAsync(() => {
      service.login({ email: 'test@haxel.me', password: 'pass123' }).subscribe();
      tick(600);
      expect(service.isAuthenticated()).toBeTrue();
    }));
  });

  describe('login()', () => {
    it('should return an AuthResponse with user and token', fakeAsync(() => {
      let result: any;
      service.login({ email: 'user@haxel.me', password: 'pass' }).subscribe(r => result = r);
      tick(600);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('user@haxel.me');
    }));

    it('should set isAuthenticated to true after login', fakeAsync(() => {
      service.login({ email: 'a@b.com', password: 'x' }).subscribe();
      tick(600);
      expect(service.isAuthenticated()).toBeTrue();
    }));

    it('should persist auth token to storage after login', fakeAsync(() => {
      service.login({ email: 'a@b.com', password: 'x' }).subscribe();
      tick(600);
      // login without rememberMe defaults to sessionStorage
      const hasToken = sessionStorage.getItem('auth_token') !== null
        || localStorage.getItem('auth_token') !== null;
      expect(hasToken).toBeTrue();
    }));
  });

  describe('register()', () => {
    it('should throw error when passwords do not match', () => {
      let error: any;
      service.register({
        email: 'a@b.com', password: '123', confirmPassword: '456', name: 'Test',
        phone: '',
        address: '',
        agreeToTerms: false
      })
        .subscribe({ error: e => error = e });
      expect(error.message).toBe('Passwords do not match');
    });

    it('should return user with provided name on success', fakeAsync(() => {
      let result: any;
      service.register({
        email: 'new@haxel.me', password: 'abc', confirmPassword: 'abc', name: 'Mostafa',
        phone: '',
        address: '',
        agreeToTerms: false
      })
        .subscribe(r => result = r);
      tick(600);
      expect(result.user.name).toBe('Mostafa');
      expect(result.user.email).toBe('new@haxel.me');
    }));
  });

  describe('logout()', () => {
    it('should clear authentication state after logout', fakeAsync(() => {
      service.login({ email: 'a@b.com', password: 'x' }).subscribe();
      tick(600);
      service.logout().subscribe();
      tick(400);
      expect(service.isAuthenticated()).toBeFalse();
    }));

    it('should remove authData from localStorage', fakeAsync(() => {
      service.login({ email: 'a@b.com', password: 'x' }).subscribe();
      tick(600);
      service.logout().subscribe();
      tick(400);
      expect(localStorage.getItem('authData')).toBeNull();
    }));
  });

  describe('getCurrentUser()', () => {
    it('should return null when not authenticated', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should return user after login', fakeAsync(() => {
      service.login({ email: 'u@haxel.me', password: 'p' }).subscribe();
      tick(600);
      expect(service.getCurrentUser()).not.toBeNull();
      expect(service.getCurrentUser()!.email).toBe('u@haxel.me');
    }));
  });

  describe('getAuthToken()', () => {
    it('should return null when not authenticated', () => {
      expect(service.getAuthToken()).toBeNull();
    });

    it('should return a token string after login', fakeAsync(() => {
      service.login({ email: 'u@haxel.me', password: 'p' }).subscribe();
      tick(600);
      expect(service.getAuthToken()).toContain('mock_token_');
    }));
  });

  describe('changePassword()', () => {
    it('should throw error when passwords do not match', () => {
      let error: any;
      service.changePassword({ currentPassword: 'old', newPassword: 'new1', confirmPassword: 'new2' })
        .subscribe({ error: e => error = e });
      expect(error.message).toBe('Passwords do not match');
    });

    it('should return success message when passwords match', fakeAsync(() => {
      let result: any;
      service.changePassword({ currentPassword: 'old', newPassword: 'new1', confirmPassword: 'new1' })
        .subscribe(r => result = r);
      tick(600);
      expect(result.message).toBe('Password changed successfully');
    }));
  });

  describe('requestPasswordReset()', () => {
    it('should return a message about sending reset link', fakeAsync(() => {
      let result: any;
      service.requestPasswordReset({ email: 'test@haxel.me' }).subscribe(r => result = r);
      tick(600);
      expect(result.message).toBeDefined();
    }));
  });

  describe('getUserProfile()', () => {
    it('should throw error if not authenticated', () => {
      let error: any;
      service.getUserProfile().subscribe({ error: e => error = e });
      expect(error.message).toBe('Not authenticated');
    });

    it('should return profile with addresses after login', fakeAsync(() => {
      service.login({ email: 'u@haxel.me', password: 'p' }).subscribe();
      tick(600);
      let profile: any;
      service.getUserProfile().subscribe(p => profile = p);
      tick(400);
      expect(profile.addresses).toBeDefined();
      expect(profile.preferences).toBeDefined();
    }));
  });

  describe('authState$', () => {
    it('should emit updated state after login', fakeAsync(() => {
      const states: any[] = [];
      service.authState$.subscribe(s => states.push(s));
      service.login({ email: 'u@haxel.me', password: 'p' }).subscribe();
      tick(600);
      const lastState = states[states.length - 1];
      expect(lastState.isAuthenticated).toBeTrue();
      expect(lastState.user).not.toBeNull();
    }));
  });

  describe('confirmPasswordReset()', () => {
    it('should throw error when passwords do not match', () => {
      let error: any;
      service.confirmPasswordReset({ token: 't', newPassword: 'new', confirmPassword: 'old' })
        .subscribe({ error: e => error = e });
      expect(error.message).toBe('Passwords do not match');
    });

    it('should return success message when passwords match', fakeAsync(() => {
      let result: any;
      service.confirmPasswordReset({ token: 't', newPassword: 'new', confirmPassword: 'new' })
        .subscribe(r => result = r);
      tick(600);
      expect(result.message).toBe('Password reset successfully');
    }));
  });

  describe('Email Verification', () => {
    it('should requestEmailVerification', fakeAsync(() => {
      let result: any;
      service.requestEmailVerification({ email: 'e' }).subscribe(r => result = r);
      tick(600);
      expect(result.message).toBe('Verification code sent to email');
    }));

    it('should confirmEmailVerification', fakeAsync(() => {
      let result: any;
      service.login({ email: 'u@haxel.me', password: 'p' }).subscribe();
      tick(600);
      service.confirmEmailVerification({ email: 'u@haxel.me', code: '123456' }).subscribe(r => result = r);
      tick(600);
      expect(result.message).toBe('Email verified successfully');
    }));
  });

  describe('Two-Factor Auth', () => {
    it('should setupTwoFactor', fakeAsync(() => {
      let result: any;
      service.setupTwoFactor().subscribe(r => result = r);
      tick(600);
      expect(result.secret).toBeDefined();
      expect(result.qrCode).toBeDefined();
    }));

    it('should enableTwoFactor', fakeAsync(() => {
      let result: any;
      service.enableTwoFactor({ code: 'c' }).subscribe(r => result = r);
      tick(600);
      expect(result.message).toBe('2FA enabled successfully');
      expect(result.backupCodes.length).toBe(10);
    }));

    it('should disableTwoFactor', fakeAsync(() => {
      let result: any;
      service.disableTwoFactor('pass').subscribe(r => result = r);
      tick(600);
      expect(result.message).toBe('2FA disabled successfully');
    }));
  });

  describe('updateUserProfile()', () => {
    it('should throw error if not authenticated', () => {
      let error: any;
      service.updateUserProfile({ name: 'n' }).subscribe({ error: e => error = e });
      expect(error.message).toBe('Not authenticated');
    });

    it('should update user profile if authenticated', fakeAsync(() => {
      service.login({ email: 'u@haxel.me', password: 'p' }).subscribe();
      tick(600);
      let result: any;
      service.updateUserProfile({ name: 'Mostafa' }).subscribe(r => result = r);
      tick(600);
      expect(result.name).toBe('Mostafa');
    }));
  });

  describe('Address Management', () => {
    it('should addAddress', fakeAsync(() => {
      let result: any;
      service.addAddress({ type: 'home', street: 's', city: 'c', state: 's', zipCode: 'z', country: 'c', isDefault: true }).subscribe(r => result = r);
      tick(600);
      expect(result.id).toBeDefined();
    }));

    it('should removeAddress', fakeAsync(() => {
      let result: any;
      service.removeAddress('id').subscribe(r => result = r);
      tick(600);
      expect(result.message).toBe('Address removed');
    }));
  });

  describe('Session Management', () => {
    it('should getSessions', fakeAsync(() => {
      let result: any;
      service.getSessions().subscribe(r => result = r);
      tick(600);
      expect(result.length).toBeGreaterThan(0);
    }));

    it('should revokeSession', fakeAsync(() => {
      let result: any;
      service.revokeSession('id').subscribe(r => result = r);
      tick(600);
      expect(result.message).toBe('Session revoked');
    }));

    it('should revokeAllSessions', fakeAsync(() => {
      let result: any;
      service.revokeAllSessions().subscribe(r => result = r);
      tick(600);
      expect(result.message).toBe('All sessions revoked');
    }));
  });
});
