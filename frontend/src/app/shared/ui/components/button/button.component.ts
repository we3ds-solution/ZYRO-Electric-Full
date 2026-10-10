import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ui-button',
  template: `
    <button
      [class]="getButtonClasses()"
      [disabled]="disabled"
      (click)="clicked.emit()">
      @if (icon) {
        <lucide-icon [name]="icon" class="w-4 h-4"></lucide-icon>
      }
      <span>{{ label }}</span>
    </button>
    `,
  styles: []
})
export class UiButtonComponent {
  @Input() label = 'Button';
  @Input() variant: 'primary' | 'outline' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() icon?: string;
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<void>();

  getButtonClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-bold transition-all rounded-[var(--radius)] disabled:opacity-50';
    
    const sizeClasses: Record<string, string> = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-lg'
    };

    const variantClasses: Record<string, string> = {
      primary: 'btn-primary',
      outline: 'btn-outline',
      danger: 'bg-red-500 text-white hover:bg-red-600'
    };

    return `${baseClasses} ${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }
}
