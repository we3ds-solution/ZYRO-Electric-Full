import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-card',
  template: `
    <div [class]="getCardClasses()">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class UiCardComponent {
  @Input() variant: 'default' | 'glass' | 'glass-strong' = 'default';
  @Input() padding: 'sm' | 'md' | 'lg' = 'md';
  @Input() hover = false;

  getCardClasses(): string {
    const baseClasses = 'rounded-[var(--radius)] overflow-hidden transition-all relative';
    
    const variantClasses: Record<string, string> = {
      default: 'card',
      glass: 'glass-card',
      'glass-strong': 'glass-card-strong'
    };

    const paddingClasses: Record<string, string> = {
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8'
    };

    const hoverClass = this.hover ? 'project-card-hover accent-glow' : '';

    return `${baseClasses} ${variantClasses[this.variant]} ${paddingClasses[this.padding]} ${hoverClass}`;
  }
}
