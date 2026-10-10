import { Injectable, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { CookieService } from './cookie.service';

/**
 * Session Configuration
 */
export interface SessionConfig {
  timeout: number; // milliseconds of inactivity before timeout
  warningTime: number; // milliseconds before timeout to show warning
  rememberMe: boolean; // persist session across browser closes
}

/**
 * Session State
 */
export interface SessionState {
  isActive: boolean;
  lastActivity: number;
  sessionId: string;
  expiresAt: number | null;
  remainingTime: number; // milliseconds until expiration
}

/**
 * Session Management Service
 * Handles:
 * - Session tracking and timeout
 * - Session restoration
 * - Activity monitoring
 * - Session warnings
 * - Multi-tab synchronization
 */
@Injectable({ providedIn: 'root' })
export class SessionService implements OnDestroy {
  private storageService = inject(StorageService);
  private cookieService = inject(CookieService);

  private sessionStateSubject = new BehaviorSubject<SessionState>({
    isActive: false,
    lastActivity: Date.now(),
    sessionId: this.generateSessionId(),
    expiresAt: null,
    remainingTime: 0
  });

  public sessionState$ = this.sessionStateSubject.asObservable();

  private config: SessionConfig = {
    timeout: 30 * 60 * 1000, // 30 minutes
    warningTime: 5 * 60 * 1000, // 5 minutes before timeout
    rememberMe: false
  };

  private activityTimeout: ReturnType<typeof setTimeout> | null = null;
  private checkInterval: ReturnType<typeof setInterval> | null = null;
  private unloadListener: (() => void) | null = null;

  constructor() {
    this.initializeSession();
    this.setupActivityMonitoring();
    this.startSessionCheck();
  }

  /**
   * Create/restore session
   */
  private initializeSession(): void {
    const storedSession = this.storageService.get<{ sessionId: string; timestamp: number }>(
      'session_metadata',
      'sessionStorage'
    );

    const sessionId = storedSession?.sessionId || this.generateSessionId();
    const expiresAt = Date.now() + this.config.timeout;

    // Store session metadata
    this.storageService.set(
      'session_metadata',
      { sessionId, timestamp: Date.now() },
      'sessionStorage'
    );

    // Set session cookie
    this.cookieService.setSessionID(sessionId);

    // Update state
    this.sessionStateSubject.next({
      isActive: true,
      lastActivity: Date.now(),
      sessionId,
      expiresAt,
      remainingTime: this.config.timeout
    });
  }

  /**
   * Monitor user activity and reset timeout
   */
  private setupActivityMonitoring(): void {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      if (this.isSessionActive()) {
        this.recordActivity();
        this.resetTimeout();
      }
    };

    // Add listeners for all activity events
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Store unload listener for cleanup
    this.unloadListener = () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };

    window.addEventListener('beforeunload', this.unloadListener);
  }

  /**
   * Periodically check session status and sync across tabs
   */
  private startSessionCheck(): void {
    this.checkInterval = setInterval(() => {
      this.checkSessionExpiration();
      this.syncSessionAcrossTabs();
    }, 10000); // Check every 10 seconds
  }

  /**
   * Record user activity timestamp
   */
  private recordActivity(): void {
    const state = this.sessionStateSubject.value;
    const updatedState: SessionState = {
      ...state,
      lastActivity: Date.now(),
      expiresAt: Date.now() + this.config.timeout,
      remainingTime: this.config.timeout
    };

    this.sessionStateSubject.next(updatedState);
    this.storageService.set('session_metadata', 
      { sessionId: state.sessionId, timestamp: Date.now() },
      'sessionStorage'
    );
  }

  /**
   * Reset session timeout
   */
  private resetTimeout(): void {
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
    }

    const expiresAt = Date.now() + this.config.timeout;

    this.activityTimeout = setTimeout(() => {
      this.handleSessionTimeout();
    }, this.config.timeout);

    // Update remaining time every second
    const updateInterval = setInterval(() => {
      const currentState = this.sessionStateSubject.value;
      if (!currentState.isActive) {
        clearInterval(updateInterval);
        return;
      }

      const remaining = Math.max(0, expiresAt - Date.now());
      this.sessionStateSubject.next({
        ...currentState,
        remainingTime: remaining
      });
    }, 1000);
  }

  /**
   * Check if session has expired
   */
  private checkSessionExpiration(): void {
    const state = this.sessionStateSubject.value;

    if (!state.isActive || !state.expiresAt) return;

    const remaining = state.expiresAt - Date.now();

    if (remaining <= 0) {
      this.handleSessionTimeout();
    } else if (remaining <= this.config.warningTime) {
      // Emit warning event (emit to 0 subjects would go here)
      console.warn('Session expiring soon. Time remaining:', remaining);
    }
  }

  /**
   * Synchronize session state across browser tabs
   */
  private syncSessionAcrossTabs(): void {
    // Use storage events to detect changes from other tabs
    const storageEvent = new StorageEvent('storage', {
      key: 'session_metadata',
      storageArea: sessionStorage
    });

    window.dispatchEvent(storageEvent);
  }

  /**
   * Handle session timeout
   */
  private handleSessionTimeout(): void {
    console.log('Session timeout - user inactive');
    this.destroySession();
    // Trigger logout in auth service
  }

  /**
   * Check if session is active
   */
  isSessionActive(): boolean {
    return this.sessionStateSubject.value.isActive;
  }

  /**
   * Get current session state
   */
  getSessionState(): SessionState {
    return this.sessionStateSubject.value;
  }

  /**
   * Get remaining session time in milliseconds
   */
  getRemainingTime(): number {
    const state = this.sessionStateSubject.value;
    if (!state.expiresAt) return 0;
    return Math.max(0, state.expiresAt - Date.now());
  }

  /**
   * Extend session (manual extend for critical operations)
   */
  extendSession(additionalTime = this.config.timeout): void {
    const state = this.sessionStateSubject.value;
    const newExpiresAt = Date.now() + additionalTime;

    this.sessionStateSubject.next({
      ...state,
      expiresAt: newExpiresAt,
      remainingTime: additionalTime
    });

    this.resetTimeout();
  }

  /**
   * Destroy session (logout)
   */
  destroySession(): void {
    // Clear timers
    if (this.activityTimeout) clearTimeout(this.activityTimeout);
    if (this.checkInterval) clearInterval(this.checkInterval);

    // Remove activity listeners
    if (this.unloadListener) {
      window.removeEventListener('beforeunload', this.unloadListener);
    }

    // Clear storage and cookies
    this.storageService.clear('sessionStorage');
    this.cookieService.delete('SESSIONID');

    // Update state
    this.sessionStateSubject.next({
      isActive: false,
      lastActivity: Date.now(),
      sessionId: '',
      expiresAt: null,
      remainingTime: 0
    });
  }

  /**
   * Configure session
   */
  configure(config: Partial<SessionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return 'sess_' + Math.random().toString(36).substr(2, 32) + '_' + Date.now();
  }

  ngOnDestroy(): void {
    this.destroySession();
  }
}
