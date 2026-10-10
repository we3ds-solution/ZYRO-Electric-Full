import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ui-confirmation',
  template: `
    @if (isVisible) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="card glass-card-strong max-w-md w-full mx-4 p-6 animate-slide-in-right">
          <h2 class="text-xl font-bold text-accent mb-2">{{ title }}</h2>
          <p class="text-foreground mb-6">{{ message }}</p>
          <div class="flex gap-3 justify-end">
            <button
              (click)="cancel()"
              class="btn-outline px-4 py-2">
              {{ cancelLabel }}
            </button>
            <button
              (click)="confirm()"
              [class]="confirmButtonClass">
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    }
    `,
  styles: []
})
export class UiConfirmationComponent {
  @Input() title = 'Confirm';
  @Input() message = '';
  @Input() confirmLabel = 'Confirm';
  @Input() cancelLabel = 'Cancel';
  @Input() type: 'default' | 'danger' = 'default';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  isVisible = false;

  open(): void {
    this.isVisible = true;
  }

  confirm(): void {
    this.isVisible = false;
    this.confirmed.emit();
  }

  cancel(): void {
    this.isVisible = false;
    this.cancelled.emit();
  }

  get confirmButtonClass(): string {
    return this.type === 'danger' 
      ? 'btn-primary !bg-red-500 hover:!bg-red-600 px-4 py-2'
      : 'btn-primary px-4 py-2';
  }
}
