import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService, SessionState } from '../../services/session.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Subject, takeUntil, interval } from 'rxjs';

/**
 * Session Timeout Warning Modal Component
 * 
 * Displays a warning modal when user session is about to expire.
 * Features:
 * - Shows countdown timer to session expiration
 * - Provides "Continue Session" button to extend timeout
 * - Auto-logout if user doesn't interact
 * - Prevents overlapping warnings
 */
@Component({
  selector: 'app-session-timeout-warning',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="session-timeout-overlay" *ngIf="isWarningVisible" role="presentation">
      <div class="session-timeout-modal" role="alertdialog" aria-labelledby="timeout-title" aria-describedby="timeout-description">
        <!-- Modal Header -->
        <div class="modal-header">
          <h2 id="timeout-title" class="modal-title">
            <span class="warning-icon">⚠️</span> Session Timeout Warning
          </h2>
          <button 
            type="button" 
            class="close-button" 
            aria-label="Close warning"
            (click)="onDismiss()"
            [disabled]="isAutoLogoutCountdown"
          >
            ✕
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <p id="timeout-description" class="timeout-message">
            Your session is about to expire due to inactivity.
          </p>

          <!-- Countdown Timer -->
          <div class="countdown-section">
            <div class="countdown-timer">
              <span class="time-value">{{ formatTime(remainingTime) }}</span>
              <span class="time-label">until logout</span>
            </div>
            <div class="countdown-bar">
              <div class="countdown-progress" [style.width.%]="getProgressPercentage()"></div>
            </div>
          </div>

          <!-- Information -->
          <div class="info-box">
            <p>You will be automatically logged out in <strong>{{ formatTime(remainingTime) }}</strong></p>
            <p class="info-subtext">Your data will be saved securely.</p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn-logout"
            (click)="onLogout()"
            [disabled]="isProcessing"
          >
            {{ isProcessing ? 'Logging out...' : 'Logout Now' }}
          </button>
          <button 
            type="button" 
            class="btn-continue"
            (click)="onContinueSession()"
            [disabled]="isProcessing || isAutoLogoutCountdown"
           
          >
            {{ isProcessing ? 'Extending...' : 'Continue Session' }}
          </button>
        </div>

        <!-- Auto-logout Countdown -->
        <div class="auto-logout-message" *ngIf="isAutoLogoutCountdown">
          <p>Auto-logging out in {{ formatTime(autoLogoutCountdown) }}...</p>
        </div>
      </div>
    </div>

    <!-- Floating Notification (when warning is NOT visible but session is expiring soon) -->
    <div class="session-notification" *ngIf="isNotificationVisible && !isWarningVisible">
      <div class="notification-content">
        <span class="notification-icon">⏱️</span>
        <span class="notification-text">
          Session expiring in {{ formatTime(remainingTime) }}
          <a href="javascript:void(0)" (click)="showWarning()" class="notification-link">Show details</a>
        </span>
      </div>
    </div>
  `,
  styles: [`
    .session-timeout-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .session-timeout-modal {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      max-width: 500px;
      width: 90%;
      animation: slideUp 0.3s ease-out;
      display: flex;
      flex-direction: column;
    }

    @keyframes slideUp {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .warning-icon {
      font-size: 24px;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 24px;
      color: #6b7280;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .close-button:hover:not(:disabled) {
      background-color: #f3f4f6;
      color: #1f2937;
    }

    .close-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .modal-body {
      padding: 24px;
      flex: 1;
    }

    .timeout-message {
      margin: 0 0 20px 0;
      font-size: 14px;
      color: #4b5563;
      line-height: 1.5;
    }

    .countdown-section {
      margin-bottom: 20px;
    }

    .countdown-timer {
      text-align: center;
      margin-bottom: 12px;
    }

    .time-value {
      display: block;
      font-size: 36px;
      font-weight: 700;
      color: #dc2626;
      font-family: 'Monaco', 'Courier New', monospace;
    }

    .time-label {
      display: block;
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .countdown-bar {
      height: 6px;
      background-color: #e5e7eb;
      border-radius: 3px;
      overflow: hidden;
    }

    .countdown-progress {
      height: 100%;
      background: linear-gradient(90deg, #ef4444, #dc2626);
      border-radius: 3px;
      transition: width 0.1s linear;
    }

    .info-box {
      background-color: #fef2f2;
      border-left: 4px solid #dc2626;
      padding: 12px;
      border-radius: 4px;
      font-size: 13px;
      color: #7f1d1d;
    }

    .info-box p {
      margin: 0 0 8px 0;
    }

    .info-box p:last-child {
      margin-bottom: 0;
    }

    .info-subtext {
      font-size: 12px !important;
      opacity: 0.8;
    }

    .modal-footer {
      display: flex;
      gap: 12px;
      padding: 16px 20px;
      border-top: 1px solid #e5e7eb;
      justify-content: flex-end;
    }

    .btn-logout,
    .btn-continue {
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .btn-logout {
      background-color: #f3f4f6;
      color: #1f2937;
    }

    .btn-logout:hover:not(:disabled) {
      background-color: #e5e7eb;
    }

    .btn-continue {
      background-color: #2563eb;
      color: white;
    }

    .btn-continue:hover:not(:disabled) {
      background-color: #1d4ed8;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auto-logout-message {
      padding: 12px 20px;
      background-color: #fef2f2;
      border-top: 1px solid #fecaca;
      text-align: center;
      font-size: 13px;
      color: #7f1d1d;
      font-weight: 500;
    }

    .session-notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #fff7ed;
      border: 1px solid #fed7aa;
      border-radius: 6px;
      padding: 12px 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 9998;
      max-width: 300px;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #92400e;
    }

    .notification-icon {
      font-size: 16px;
    }

    .notification-text {
      flex: 1;
    }

    .notification-link {
      color: #b45309;
      font-weight: 600;
      text-decoration: none;
      margin-left: 4px;
    }

    .notification-link:hover {
      text-decoration: underline;
    }

    @media (max-width: 600px) {
      .session-timeout-modal {
        width: 95%;
      }

      .modal-title {
        font-size: 16px;
      }

      .time-value {
        font-size: 28px;
      }

      .modal-footer {
        flex-direction: column-reverse;
      }

      .btn-logout,
      .btn-continue {
        width: 100%;
      }

      .session-notification {
        left: 12px;
        right: 12px;
        bottom: 12px;
        max-width: none;
      }
    }
  `]
})
export class SessionTimeoutWarningComponent implements OnInit, OnDestroy {
  private sessionService = inject(SessionService);
  private authService = inject(AuthService);

  private destroy$ = new Subject<void>();

  isWarningVisible = false;
  isNotificationVisible = false;
  isProcessing = false;
  isAutoLogoutCountdown = false;

  remainingTime = 0;
  autoLogoutCountdown = 0;

  private warningThreshold = 5 * 60 * 1000; // 5 minutes
  private autoLogoutCountdownTime = 30 * 1000; // 30 seconds
  private updateInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.setupSessionMonitoring();
  }

  /**
   * Setup session monitoring and warning display logic
   */
  private setupSessionMonitoring(): void {
    // Subscribe to session state changes
    this.sessionService.sessionState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.handleSessionStateChange(state);
      });

    // Update remaining time every second
    this.updateInterval = setInterval(() => {
      this.remainingTime = this.sessionService.getRemainingTime();

      if (this.isWarningVisible && this.remainingTime <= 0) {
        this.performAutoLogout();
      }
    }, 1000);
  }

  /**
   * Handle session state changes
   */
  private handleSessionStateChange(state: SessionState): void {
    if (!state.isActive) {
      this.isWarningVisible = false;
      this.isNotificationVisible = false;
      return;
    }

    const remaining = this.sessionService.getRemainingTime();

    // Show warning when less than 5 minutes remaining
    if (remaining > 0 && remaining <= this.warningThreshold) {
      if (!this.isWarningVisible && !this.isAutoLogoutCountdown) {
        this.showWarning();
      }
      this.isNotificationVisible = false;
    }
    // Show subtle notification when less than 15 minutes
    else if (remaining > this.warningThreshold && remaining <= 15 * 60 * 1000) {
      this.isNotificationVisible = true;
      this.isWarningVisible = false;
    } else {
      this.isWarningVisible = false;
      this.isNotificationVisible = false;
    }

    this.remainingTime = remaining;
  }

  /**
   * Show the warning modal
   */
  showWarning(): void {
    this.isWarningVisible = true;
    this.isNotificationVisible = false;
  }

  /**
   * Handle continue session button click
   */
  onContinueSession(): void {
    this.isProcessing = true;

    // Extend session
    this.sessionService.extendSession();

    // Hide warning
    setTimeout(() => {
      this.isWarningVisible = false;
      this.isProcessing = false;
      this.isAutoLogoutCountdown = false;
    }, 500);
  }

  /**
   * Handle logout button click
   */
  onLogout(): void {
    this.isProcessing = true;

    this.authService.logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.isWarningVisible = false;
          this.isProcessing = false;
        },
        error: () => {
          this.isProcessing = false;
        }
      });
  }

  /**
   * Handle modal dismiss
   */
  onDismiss(): void {
    if (!this.isAutoLogoutCountdown) {
      this.isWarningVisible = false;
    }
  }

  /**
   * Perform auto-logout after countdown
   */
  private performAutoLogout(): void {
    if (this.isAutoLogoutCountdown) return;

    this.isAutoLogoutCountdown = true;
    this.autoLogoutCountdown = this.autoLogoutCountdownTime;

    const countdownInterval = setInterval(() => {
      this.autoLogoutCountdown -= 1000;

      if (this.autoLogoutCountdown <= 0) {
        clearInterval(countdownInterval);
        this.onLogout();
      }
    }, 1000);
  }

  /**
   * Format milliseconds to MM:SS format
   */
  formatTime(ms: number): string {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Get progress percentage for countdown bar
   */
  getProgressPercentage(): number {
    const totalTime = this.warningThreshold;
    const elapsed = totalTime - this.remainingTime;
    return Math.max(0, Math.min(100, (elapsed / totalTime) * 100));
  }

  ngOnDestroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
