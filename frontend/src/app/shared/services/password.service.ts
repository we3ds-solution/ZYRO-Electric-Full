import { Injectable } from '@angular/core';

// Single Responsibility: Handle password operations only
@Injectable({ providedIn: 'root' })
export class PasswordService {
  changePassword(oldPassword: string, newPassword: string, currentPassword: string): { success: boolean; error?: string } {
    if (oldPassword !== currentPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }

    if (newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return { success: false, error: 'Password must contain uppercase and numbers' };
    }

    return { success: true };
  }

  resetPassword(email: string): { success: boolean; token: string } {
    const token = Math.random().toString(36).substr(2, 32);
    // In real app: send email with reset link
    console.log(`Password reset token sent to ${email}: ${token}`);
    return { success: true, token };
  }

  validateResetToken(token: string): boolean {
    // In real app: verify token against database
    return token.length === 32;
  }

  setNewPassword(token: string, newPassword: string): { success: boolean; error?: string } {
    if (!this.validateResetToken(token)) {
      return { success: false, error: 'Invalid or expired reset token' };
    }

    if (newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    // In real app: update password in database
    return { success: true };
  }

  validatePasswordStrength(password: string): { score: number; feedback: string[] } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score++;
    else feedback.push('Password should be at least 8 characters');

    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Add uppercase letters');

    if (/[a-z]/.test(password)) score++;
    else feedback.push('Add lowercase letters');

    if (/[0-9]/.test(password)) score++;
    else feedback.push('Add numbers');

    if (/[^A-Za-z0-9]/.test(password)) score++;
    else feedback.push('Add special characters');

    return { score, feedback };
  }
}
