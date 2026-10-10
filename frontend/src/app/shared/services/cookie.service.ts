import { Injectable } from '@angular/core';

/**
 * Cookie Options
 */
export interface CookieOptions {
  expires?: Date | number; // days or Date
  path?: string;
  domain?: string;
  secure?: boolean; // HTTPS only
  sameSite?: 'Strict' | 'Lax' | 'None';
  httpOnly?: boolean; // Client-side JS cannot access (note: limited in browser)
}

/**
 * Cookie Service
 * Handles:
 * - Reading/writing cookies
 * - Cookie expiration
 * - Secure cookie attributes
 * - CSRF token management
 * - Session tracking
 */
@Injectable({ providedIn: 'root' })
export class CookieService {
  /**
   * Set a cookie
   */
  set(name: string, value: string, options?: CookieOptions): void {
    try {
      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

      if (options) {
        // Set expiration
        if (options.expires) {
          let expires = '';
          if (typeof options.expires === 'number') {
            // Convert days to date
            const date = new Date();
            date.setDate(date.getDate() + options.expires);
            expires = date.toUTCString();
          } else {
            expires = options.expires.toUTCString();
          }
          cookieString += `; expires=${expires}`;
        }

        if (options.path) {
          cookieString += `; path=${options.path}`;
        }

        if (options.domain) {
          cookieString += `; domain=${options.domain}`;
        }

        if (options.secure) {
          cookieString += '; secure';
        }

        if (options.sameSite) {
          cookieString += `; SameSite=${options.sameSite}`;
        }
      }

      document.cookie = cookieString;
    } catch (error) {
      console.error(`Error setting cookie ${name}:`, error);
    }
  }

  /**
   * Get cookie value by name
   */
  get(name: string): string | null {
    try {
      const nameEQ = encodeURIComponent(name) + '=';
      const cookies = document.cookie.split(';');

      for (const cookie of cookies) {
        const trimmed = cookie.trim();
        if (trimmed.startsWith(nameEQ)) {
          return decodeURIComponent(trimmed.substring(nameEQ.length));
        }
      }

      return null;
    } catch (error) {
      console.error(`Error getting cookie ${name}:`, error);
      return null;
    }
  }

  /**
   * Check if cookie exists
   */
  has(name: string): boolean {
    return this.get(name) !== null;
  }

  /**
   * Delete a cookie
   */
  delete(name: string, path = '/', domain?: string): void {
    try {
      const options: CookieOptions = {
        expires: new Date(0),
        path
      };

      if (domain) {
        options.domain = domain;
      }

      this.set(name, '', options);
    } catch (error) {
      console.error(`Error deleting cookie ${name}:`, error);
    }
  }

  /**
   * Get all cookies
   */
  getAll(): Record<string, string> {
    try {
      const cookies: Record<string, string> = {};
      const cookiePairs = document.cookie.split(';');

      for (const pair of cookiePairs) {
        const [name, value] = pair.trim().split('=');
        if (name) {
          cookies[decodeURIComponent(name)] = decodeURIComponent(value || '');
        }
      }

      return cookies;
    } catch (error) {
      console.error('Error getting all cookies:', error);
      return {};
    }
  }

  /**
   * Clear all cookies
   */
  clearAll(path = '/'): void {
    try {
      const cookies = this.getAll();
      for (const name of Object.keys(cookies)) {
        this.delete(name, path);
      }
    } catch (error) {
      console.error('Error clearing cookies:', error);
    }
  }

  /**
   * Set CSRF token (for form submission protection)
   */
  setCSRFToken(token: string, name = '_csrf'): void {
    this.set(name, token, {
      httpOnly: false, // JavaScript accessible
      secure: true,
      sameSite: 'Lax',
      path: '/'
    });
  }

  /**
   * Get CSRF token
   */
  getCSRFToken(name = '_csrf'): string | null {
    return this.get(name);
  }

  /**
   * Set session cookie (deleted when browser closes)
   */
  setSessionCookie(name: string, value: string): void {
    this.set(name, value, {
      path: '/',
      sameSite: 'Lax'
      // No expires = session cookie
    });
  }

  /**
   * Set secure session ID cookie
   */
  setSessionID(sessionId: string, cookieName = 'SESSIONID'): void {
    this.set(cookieName, sessionId, {
      secure: true, // HTTPS only
      httpOnly: false, // Note: Real implementation should use true with server-side access
      sameSite: 'Strict',
      path: '/'
    });
  }
}
