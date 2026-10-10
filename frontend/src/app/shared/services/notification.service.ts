import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastNotification {
  type: ToastType;
  title: string;
  message: string;
}

// Single Responsibility: Handle toast notifications only
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private toastSubject = new Subject<ToastNotification>();
  toast$ = this.toastSubject.asObservable();

  show(title: string, message: string, type: ToastType = 'info'): void {
    this.toastSubject.next({ type, title, message });
  }

  success(title: string, message: string): void {
    this.show(title, message, 'success');
  }

  error(title: string, message: string): void {
    this.show(title, message, 'error');
  }

  info(title: string, message: string): void {
    this.show(title, message, 'info');
  }

  warning(title: string, message: string): void {
    this.show(title, message, 'warning');
  }
}
