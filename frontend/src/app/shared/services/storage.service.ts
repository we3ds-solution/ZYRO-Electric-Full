import { Injectable } from '@angular/core';

/**
 * Storage Type Options
 */
export type StorageType = 'localStorage' | 'sessionStorage' | 'memory';

/**
 * Storage Entry with metadata
 */
export interface StorageEntry<T> {
  value: T;
  timestamp: number;
  ttl: number; // milliseconds, 0 = no expiration
  type: StorageType;
}

/**
 * Multi-Strategy Storage Service
 * Supports:
 * - localStorage (persistent across sessions)
 * - sessionStorage (cleared on browser close)
 * - In-memory fallback (if storage unavailable)
 * - TTL-based expiration
 * - JSON serialization with error handling
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private memoryStorage = new Map<string, StorageEntry<unknown>>();

  /**
   * Set value in storage with optional TTL
   */
  set<T>(
    key: string,
    value: T,
    storageType: StorageType = 'localStorage',
    ttl = 0
  ): boolean {
    try {
      const entry: StorageEntry<T> = {
        value,
        timestamp: Date.now(),
        ttl,
        type: storageType
      };

      const serialized = JSON.stringify(entry);

      if (storageType === 'memory') {
        this.memoryStorage.set(key, entry);
        return true;
      }

      const storage = this.getStorage(storageType);
      if (!storage) {
        // Fallback to memory if storage unavailable
        this.memoryStorage.set(key, entry);
        return false;
      }

      storage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      // Fallback to memory on quota exceeded or other errors
      this.memoryStorage.set(key, { value, timestamp: Date.now(), ttl, type: 'memory' });
      return false;
    }
  }

  /**
   * Get value from storage, checking expiration
   */
  get<T>(key: string, storageType: StorageType = 'localStorage'): T | null {
    try {
      let entry: StorageEntry<T> | null = null;

      if (storageType === 'memory') {
        entry = this.memoryStorage.get(key) as StorageEntry<T> | undefined || null;
      } else {
        const storage = this.getStorage(storageType);
        if (storage) {
          const stored = storage.getItem(key);
          if (!stored) return null;

          try {
            // Try to parse as StorageEntry first (new format)
            const parsed = JSON.parse(stored);
            
            // Check if it's a StorageEntry (has value, timestamp, ttl properties)
            if (parsed && typeof parsed === 'object' && 'value' in parsed && 'timestamp' in parsed && 'ttl' in parsed) {
              entry = parsed;
            } else {
              // Legacy format - just the value itself, wrap it
              entry = {
                value: parsed,
                timestamp: Date.now(),
                ttl: 0,
                type: storageType
              };
            }
          } catch (e) {
            // If JSON parse fails, treat as plain string token
            entry = {
              value: stored as unknown as T,
              timestamp: Date.now(),
              ttl: 0,
              type: storageType
            };
          }
        }
      }

      if (!entry) {
        return null;
      }

      // Check TTL expiration
      if (entry.ttl > 0 && Date.now() - entry.timestamp > entry.ttl) {
        this.remove(key, storageType);
        return null;
      }

      return entry.value;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string, storageType: StorageType = 'localStorage'): boolean {
    return this.get(key, storageType) !== null;
  }

  /**
   * Remove specific key from storage
   */
  remove(key: string, storageType: StorageType = 'localStorage'): void {
    try {
      if (storageType === 'memory') {
        this.memoryStorage.delete(key);
      } else {
        const storage = this.getStorage(storageType);
        if (storage) {
          storage.removeItem(key);
        }
      }
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  }

  /**
   * Remove all items matching pattern from storage
   */
  invalidate(pattern: string, storageType: StorageType = 'localStorage'): void {
    try {
      const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');

      if (storageType === 'memory') {
        const keysToDelete: string[] = [];
        this.memoryStorage.forEach((_, key) => {
          if (regex.test(key)) {
            keysToDelete.push(key);
          }
        });
        keysToDelete.forEach(key => this.memoryStorage.delete(key));
      } else {
        const storage = this.getStorage(storageType);
        if (storage) {
          const keysToDelete: string[] = [];
          for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (key && regex.test(key)) {
              keysToDelete.push(key);
            }
          }
          keysToDelete.forEach(key => storage.removeItem(key));
        }
      }
    } catch (error) {
      console.error(`Error invalidating pattern ${pattern}:`, error);
    }
  }

  /**
   * Clear all storage
   */
  clear(storageType: StorageType = 'localStorage'): void {
    try {
      if (storageType === 'memory') {
        this.memoryStorage.clear();
      } else {
        const storage = this.getStorage(storageType);
        if (storage) {
          storage.clear();
        }
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  /**
   * Get all keys in storage
   */
  getKeys(storageType: StorageType = 'localStorage'): string[] {
    try {
      if (storageType === 'memory') {
        return Array.from(this.memoryStorage.keys());
      }

      const storage = this.getStorage(storageType);
      if (!storage) return [];

      const keys: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) keys.push(key);
      }
      return keys;
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  }

  /**
   * Get storage size in bytes (rough estimate)
   */
  getSize(storageType: StorageType = 'localStorage'): number {
    try {
      let size = 0;

      if (storageType === 'memory') {
        this.memoryStorage.forEach(entry => {
          size += JSON.stringify(entry).length;
        });
      } else {
        const storage = this.getStorage(storageType);
        if (storage) {
          for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (key) {
              size += key.length + (storage.getItem(key)?.length || 0);
            }
          }
        }
      }

      return size;
    } catch (error) {
      console.error('Error calculating size:', error);
      return 0;
    }
  }

  /**
   * Get appropriate storage object
   */
  private getStorage(storageType: StorageType): Storage | null {
    try {
      if (storageType === 'localStorage') {
        return localStorage;
      } else if (storageType === 'sessionStorage') {
        return sessionStorage;
      }
    } catch (error) {
      console.warn(`${storageType} not available:`, error);
    }
    return null;
  }
}
