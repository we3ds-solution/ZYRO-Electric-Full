import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-badge',
  template: `
    <span [class]="getBadgeClasses()">
      @if (icon) {
        <lucide-icon [name]="icon" class="w-3 h-3"></lucide-icon>
      }
      {{ label }}
    </span>
    `,
  styles: []
})
export class UiBadgeComponent {
  @Input() label = '';
  @Input() icon?: string;
  @Input() variant: 'default' | 'accent' | 'success' | 'warning' | 'danger' = 'default';

  getBadgeClasses(): string {
    const baseClasses = 'tag-skill inline-flex items-center gap-1';
    
    const variantClasses: Record<string, string> = {
      default: '',
      accent: '!bg-accent !text-accent-foreground !border-accent',
      success: '!bg-green-500 !text-white !border-green-500',
      warning: '!bg-yellow-500 !text-white !border-yellow-500',
      danger: '!bg-red-500 !text-white !border-red-500'
    };

    return `${baseClasses} ${variantClasses[this.variant]}`;
  }
}
