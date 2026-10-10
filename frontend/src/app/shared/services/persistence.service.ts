import { Injectable } from '@angular/core';

// Single Responsibility: Handle storage operations only
@Injectable({ providedIn: 'root' })
export class PersistenceService {
  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}
