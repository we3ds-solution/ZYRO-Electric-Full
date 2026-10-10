import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map, delay } from 'rxjs/operators';
import {
  User,
  AuthResponse,
  AuthCredentials,
  RegisterData,
  PasswordChangeRequest,
  PasswordResetRequest,
  PasswordResetConfirm,
  EmailVerificationRequest,
  EmailVerificationConfirm,
  TwoFactorSetup,
  TwoFactorVerify,
  Session,
  AuthState,
  UserProfile,
  Address
} from '../models';
import { StorageService } from '../../shared/services/storage.service';
import { CookieService } from '../../shared/services/cookie.service';
import { CacheService } from '../../shared/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storageService = inject(StorageService);
  private cookieService = inject(CookieService);
  private cacheService = inject(CacheService);

  // State Management
  private authStateSubject = new BehaviorSubject<AuthState>({
    user: this.loadFromStorage()?.user || null,
    isAuthenticated: !!this.loadFromStorage(),
    isLoading: false,
    error: null,
    token: this.loadFromStorage()?.token || null
  });

  public authState$ = this.authStateSubject.asObservable();
  public isAuthenticated$ = this.authState$.pipe(map(state => state.isAuthenticated));
  public currentUser$ = this.authState$.pipe(map(state => state.user));
  public isLoading$ = this.authState$.pipe(map(state => state.isLoading));

  // Session Management
  private sessionsSubject = new BehaviorSubject<Session[]>([]);
  public sessions$ = this.sessionsSubject.asObservable();

  // Two-Factor Authentication
  private twoFactorEnabledSubject = new BehaviorSubject<boolean>(false);
  public twoFactorEnabled$ = this.twoFactorEnabledSubject.asObservable();

  // Storage configuration
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly AUTH_USER_KEY = 'auth_user';
  private readonly CSRF_TOKEN_KEY = 'csrf_token';
  private readonly SESSION_ID_KEY = 'session_id';
  private readonly TOKEN_CACHE_TTL = 60 * 60 * 1000; // 1 hour
  private readonly CSRF_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.initializeAuth();
  }

  // ============ Authentication ============

  login(credentials: AuthCredentials, rememberMe = false): Observable<AuthResponse> {
    this.setLoading(true);
    return of({
      user: this.createMockUser(credentials.email),
      token: 'mock_token_' + Math.random().toString(36).substr(2, 9),
      expiresIn: 3600
    }).pipe(
      delay(500),
      tap(response => {
        this.setUser(response.user, response.token, rememberMe);
        this.setLoading(false);
      }),
      catchError(error => {
        this.setError('Login failed. Please try again.');
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  register(data: RegisterData): Observable<AuthResponse> {
    if (data.password !== data.confirmPassword) {
      return throwError(() => new Error('Passwords do not match'));
    }

    this.setLoading(true);
    return of({
      user: this.createMockUser(data.email, data.name),
      token: 'mock_token_' + Math.random().toString(36).substr(2, 9),
      expiresIn: 3600
    }).pipe(
      delay(500),
      tap(response => {
        this.setUser(response.user, response.token, false);
        this.setLoading(false);
      }),
      catchError(error => {
        this.setError('Registration failed. Please try again.');
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<void> {
    return of(void 0).pipe(
      delay(300),
      tap(() => {
        this.clearAuth();
      })
    );
  }

  // ============ Password Management ============

  changePassword(request: PasswordChangeRequest): Observable<{ message: string }> {
    if (request.newPassword !== request.confirmPassword) {
      return throwError(() => new Error('Passwords do not match'));
    }

    return of({ message: 'Password changed successfully' }).pipe(
      delay(500),
      tap(() => this.setSuccess('Password updated successfully'))
    );
  }

  requestPasswordReset(request: PasswordResetRequest): Observable<{ message: string }> {
    return of({ message: 'Reset link sent to email' }).pipe(
      delay(500),
      tap(() => this.setSuccess('Password reset link sent to ' + request.email))
    );
  }

  confirmPasswordReset(request: PasswordResetConfirm): Observable<{ message: string }> {
    if (request.newPassword !== request.confirmPassword) {
      return throwError(() => new Error('Passwords do not match'));
    }

    return of({ message: 'Password reset successfully' }).pipe(
      delay(500),
      tap(() => this.setSuccess('Password reset successfully'))
    );
  }

  // ============ Email Verification ============

  requestEmailVerification(_request: EmailVerificationRequest): Observable<{ message: string }> {
    void _request;
    return of({ message: 'Verification code sent to email' }).pipe(
      delay(500),
      tap(() => this.setSuccess('Verification code sent'))
    );
  }

  confirmEmailVerification(_request: EmailVerificationConfirm): Observable<{ message: string }> {
    void _request;
    return of({ message: 'Email verified successfully' }).pipe(
      delay(500),
      tap(() => {
        const user = this.authStateSubject.value.user;
        if (user) {
          user.isEmailVerified = true;
          this.setUser(user, this.authStateSubject.value.token!);
        }
        this.setSuccess('Email verified successfully');
      })
    );
  }

  // ============ Two-Factor Authentication ============

  setupTwoFactor(): Observable<TwoFactorSetup> {
    const setup: TwoFactorSetup = {
      secret: 'JBSWY3DPEBLW64TMMQ======',
      qrCode: 'data:image/png;base64,...'
    };

    return of(setup).pipe(delay(500));
  }

  enableTwoFactor(_verify: TwoFactorVerify): Observable<{ message: string; backupCodes: string[] }> {
    void _verify;
    const backupCodes = Array.from({ length: 10 }, () =>
      Math.random().toString(36).substr(2, 8).toUpperCase()
    );

    return of({ message: '2FA enabled successfully', backupCodes }).pipe(
      delay(500),
      tap(() => {
        this.twoFactorEnabledSubject.next(true);
        this.setSuccess('Two-factor authentication enabled');
      })
    );
  }

  disableTwoFactor(_password: string): Observable<{ message: string }> {
    void _password;
    return of({ message: '2FA disabled successfully' }).pipe(
      delay(500),
      tap(() => {
        this.twoFactorEnabledSubject.next(false);
        this.setSuccess('Two-factor authentication disabled');
      })
    );
  }

  // ============ User Profile ============

  getUserProfile(): Observable<UserProfile> {
    const user = this.authStateSubject.value.user;
    if (!user) {
      return throwError(() => new Error('Not authenticated'));
    }

    const profile: UserProfile = {
      ...user,
      preferences: {
        newsletter: true,
        notifications: true,
        twoFactorEnabled: false,
        theme: 'dark'
      },
      addresses: [
        {
          id: '1',
          type: 'home',
          street: '123 Main St',
          city: 'City',
          state: 'State',
          zipCode: '12345',
          country: 'Country',
          isDefault: true
        }
      ]
    };

    return of(profile).pipe(delay(300));
  }

  updateUserProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
    const user = this.authStateSubject.value.user;
    if (!user) {
      return throwError(() => new Error('Not authenticated'));
    }

    const updated = { ...user, ...profile };
    this.setUser(updated, this.authStateSubject.value.token!);
    return of(updated as UserProfile).pipe(delay(500));
  }

  addAddress(address: Omit<Address, 'id'>): Observable<Address> {
    const newAddress: Address = {
      ...address,
      id: Math.random().toString(36).substr(2, 9)
    };
    return of(newAddress).pipe(delay(300));
  }

  removeAddress(_addressId: string): Observable<{ message: string }> {
    void _addressId;
    return of({ message: 'Address removed' }).pipe(delay(300));
  }

  // ============ Session Management ============

  getSessions(): Observable<Session[]> {
    return this.sessions$.pipe(
      map(sessions => sessions.length > 0 ? sessions : [this.createMockSession()])
    );
  }

  revokeSession(sessionId: string): Observable<{ message: string }> {
    const sessions = this.sessionsSubject.value.filter(s => s.id !== sessionId);
    this.sessionsSubject.next(sessions);
    return of({ message: 'Session revoked' }).pipe(delay(300));
  }

  revokeAllSessions(): Observable<{ message: string }> {
    this.sessionsSubject.next([]);
    return of({ message: 'All sessions revoked' }).pipe(delay(300));
  }

  // ============ State Management ============

  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  isAuthenticated(): boolean {
    // Check both in-memory state and storage for robustness
    const stateIsAuth = this.authStateSubject.value.isAuthenticated;
    const storageData = this.loadFromStorage();
    const storageIsAuth = !!storageData?.token && !!storageData?.user;
    
    const result = stateIsAuth || storageIsAuth;
    
    if (!result && (stateIsAuth || storageIsAuth)) {
      // If one says authenticated but other doesn't, sync them
      if (storageIsAuth && !stateIsAuth) {
        console.warn('[AuthService] Storage has auth data but state does not - syncing state');
        this.authStateSubject.next({
          user: storageData?.user || null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          token: storageData?.token || null
        });
        return true;
      }
    }
    
    return result;
  }

  getAuthToken(): string | null {
    return this.authStateSubject.value.token;
  }

  // ============ Private Methods ============

  private initializeAuth(): void {
    const stored = this.loadFromStorage();
    if (stored) {
      this.authStateSubject.next({
        user: stored.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token: stored.token
      });
    }
  }

  /**
   * Set authenticated user with token
   * Handles Remember Me functionality - determines storage type
   */
  private setUser(user: User, token: string, rememberMe = false): void {
    const state = this.authStateSubject.value;
    this.authStateSubject.next({
      ...state,
      user,
      isAuthenticated: true,
      token,
      error: null
    });

    // Store based on rememberMe flag
    const storageType: 'localStorage' | 'sessionStorage' = rememberMe ? 'localStorage' : 'sessionStorage';
    
    this.storageService.set(this.AUTH_TOKEN_KEY, token, storageType, 24 * 60 * 60 * 1000);
    this.storageService.set(this.AUTH_USER_KEY, user, storageType, 24 * 60 * 60 * 1000);
    
    // Set CSRF token cookie for server communication
    const csrfToken = 'csrf_' + Math.random().toString(36).substr(2, 9);
    this.cookieService.setCSRFToken(csrfToken);
    this.cacheService.set(this.CSRF_TOKEN_KEY, csrfToken, this.CSRF_CACHE_TTL);
    
    // Set session ID cookie
    const sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
    this.cookieService.set(this.SESSION_ID_KEY, sessionId, {
      expires: 1, // 1 day
      secure: true,
      sameSite: 'Lax',
      path: '/'
    });
  }

  private setLoading(isLoading: boolean): void {
    const state = this.authStateSubject.value;
    this.authStateSubject.next({ ...state, isLoading });
  }

  private setError(error: string): void {
    const state = this.authStateSubject.value;
    this.authStateSubject.next({ ...state, error });
  }

  private setSuccess(_message: string): void {
    void _message;
    const state = this.authStateSubject.value;
    this.authStateSubject.next({ ...state, error: null });
  }

  /**
   * Clear all auth data from storage and cache
   * Called on logout
   */
  private clearAuth(): void {
    this.authStateSubject.next({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: null
    });

    // Clear from both storage types
    this.storageService.remove(this.AUTH_TOKEN_KEY, 'localStorage');
    this.storageService.remove(this.AUTH_USER_KEY, 'localStorage');
    this.storageService.remove(this.AUTH_TOKEN_KEY, 'sessionStorage');
    this.storageService.remove(this.AUTH_USER_KEY, 'sessionStorage');
    
    // Clear cache
    this.cacheService.invalidate('auth:*');
    this.cacheService.invalidate('user:*');
    
    this.sessionsSubject.next([]);
  }

  /**
   * Load auth data from storage (checks both localStorage and sessionStorage)
   */
  private loadFromStorage(): { user: User; token: string } | null {
    try {
      // Try localStorage first (Remember Me)
      let token = this.storageService.get<string>(this.AUTH_TOKEN_KEY, 'localStorage');
      let user = this.storageService.get<User>(this.AUTH_USER_KEY, 'localStorage');
      
      // Fall back to sessionStorage
      if (!token) {
        token = this.storageService.get<string>(this.AUTH_TOKEN_KEY, 'sessionStorage');
      }
      if (!user) {
        user = this.storageService.get<User>(this.AUTH_USER_KEY, 'sessionStorage');
      }
      
      return (token && user) ? { token, user } : null;
    } catch (error) {
      console.error('Error loading auth from storage:', error);
      return null;
    }
  }

  private createMockUser(email: string, name?: string): User {
    return {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: name || email.split('@')[0],
      phone: '+1234567890',
      address: '123 Main St',
      createdAt: new Date(),
      updatedAt: new Date(),
      isEmailVerified: false,
      isPhoneVerified: false,
      role: 'customer',
      status: 'active'
    };
  }

  private createMockSession(): Session {
    return {
      id: Math.random().toString(36).substr(2, 9),
      userId: this.authStateSubject.value.user?.id || '',
      token: this.authStateSubject.value.token || '',
      refreshToken: 'refresh_token_mock',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      userAgent: navigator.userAgent,
      ipAddress: '192.168.1.1',
      isActive: true
    };
  }
}
