import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';

// Single Responsibility: Handle 2FA operations only
@Injectable({ providedIn: 'root' })
export class TwoFactorAuthService {
  private twoFactorStates = new Map<string, { secret: string; verified: boolean }>();
  private readonly TOTP_WINDOW = 1; // Allow ±1 time window (30s each)
  private readonly TIME_STEP = 30; // TOTP time step in seconds

  constructor(private cryptoService: CryptoService) {}

  enableTwoFactor(userId: string): { secret: string; qrCode: string } {
    const secret = this.cryptoService.generateSecureSecret();
    const qrCode = `otpauth://totp/Haxel:${userId}?secret=${secret}&issuer=Haxel`;
    
    this.twoFactorStates.set(userId, { secret, verified: false });
    
    return { secret, qrCode };
  }

  verifySetup(userId: string, code: string): { success: boolean; error?: string } {
    const state = this.twoFactorStates.get(userId);
    
    if (!state) {
      return { success: false, error: '2FA setup not found' };
    }

    if (this.verifyCode(code, state.secret)) {
      state.verified = true;
      return { success: true };
    }

    return { success: false, error: 'Invalid verification code' };
  }

  verifyLogin(userId: string, code: string): { success: boolean; error?: string } {
    const state = this.twoFactorStates.get(userId);
    
    if (!state || !state.verified) {
      return { success: false, error: '2FA not enabled' };
    }

    if (this.verifyCode(code, state.secret)) {
      return { success: true };
    }

    return { success: false, error: 'Invalid code' };
  }

  disableTwoFactor(userId: string): void {
    this.twoFactorStates.delete(userId);
  }

  isTwoFactorEnabled(userId: string): boolean {
    const state = this.twoFactorStates.get(userId);
    return state?.verified || false;
  }

  /**
   * Verify TOTP code against secret
   * Implements RFC 6238 Time-based One-Time Password algorithm
   * Validates code against current and adjacent time windows to handle clock skew
   */
  private verifyCode(code: string, secret: string): boolean {
    // Validate code format
    if (!/^\d{6}$/.test(code)) {
      return false;
    }

    // Prevent verification with invalid secret
    if (!secret || typeof secret !== 'string' || secret.length < 16) {
      return false;
    }

    const currentTimeCounter = Math.floor(Date.now() / 1000 / this.TIME_STEP);

    // Check current time window and adjacent windows to handle clock skew
    for (let i = -this.TOTP_WINDOW; i <= this.TOTP_WINDOW; i++) {
      const timeCounter = currentTimeCounter + i;
      const expectedCode = this.generateTOTPCodeSync(secret, timeCounter);

      // Use constant-time comparison to prevent timing attacks
      if (this.constantTimeCompare(code, expectedCode)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Generate TOTP code synchronously using HMAC-SHA1
   * Uses Web Crypto API compatible implementation
   */
  private generateTOTPCodeSync(secret: string, timeCounter: number): string {
    try {
      return this.cryptoService.generateTOTPSync(secret, timeCounter);
    } catch (e) {
      return '';
    }
  }

  /**
   * Constant-time string comparison to prevent timing attacks
   */
  private constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }
}
