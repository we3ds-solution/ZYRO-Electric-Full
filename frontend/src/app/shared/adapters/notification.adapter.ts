// Liskov Substitution: Adapt UI components to work with notification interface contracts

import { Injectable } from '@angular/core';
import { INotificationService } from '../interfaces/business-logic';

export interface ToastComponentInterface {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  show(): void;
}

/**
 * Toast Notification Adapter
 * Adapts the Toast UI component to implement INotificationService
 * Ensures the component is treated as a Liskov-substitutable implementation
 */
@Injectable({ providedIn: 'root' })
export class ToastNotificationAdapter implements INotificationService {
  private toastComponent: ToastComponentInterface | null = null;

  registerToastComponent(component: ToastComponentInterface): void {
    this.toastComponent = component;
  }

  showSuccess(title: string, message: string): void {
    if (this.toastComponent) {
      this.toastComponent.type = 'success';
      this.toastComponent.title = title;
      this.toastComponent.message = message;
      this.toastComponent.show();
    }
  }

  showError(title: string, message: string): void {
    if (this.toastComponent) {
      this.toastComponent.type = 'error';
      this.toastComponent.title = title;
      this.toastComponent.message = message;
      this.toastComponent.show();
    }
  }

  showInfo(title: string, message: string): void {
    if (this.toastComponent) {
      this.toastComponent.type = 'info';
      this.toastComponent.title = title;
      this.toastComponent.message = message;
      this.toastComponent.show();
    }
  }

  showWarning(title: string, message: string): void {
    if (this.toastComponent) {
      this.toastComponent.type = 'warning';
      this.toastComponent.title = title;
      this.toastComponent.message = message;
      this.toastComponent.show();
    }
  }
}
