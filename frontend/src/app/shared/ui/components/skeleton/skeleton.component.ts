import { Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-ui-skeleton',
  template: `
    <div [class]="getSkeletonClasses()"></div>
  `,
  styles: []
})
export class UiSkeletonComponent {
  @Input() variant: 'text' | 'card' | 'avatar' | 'button' = 'text';
  @Input() width = '100%';
  @Input() height = '1rem';

  getSkeletonClasses(): string {
    const baseClasses = 'bg-muted rounded-[var(--radius)] animate-pulse';
    
    const variantClasses: Record<string, string> = {
      text: 'h-4 w-full',
      card: 'h-48 w-full',
      avatar: 'h-12 w-12 rounded-full',
      button: 'h-10 w-24'
    };

    return `${baseClasses} ${variantClasses[this.variant]}`;
  }
}

@Component({
  selector: 'app-ui-skeleton-group',
  template: `
    <div [class]="'space-y-' + (gap === 'sm' ? '2' : gap === 'md' ? '4' : '6')">
      @for (item of skeletons; track $index) {
        <app-ui-skeleton
          [variant]="item.variant"
          [width]="item.width"
          [height]="item.height">
        </app-ui-skeleton>
      }
    </div>
    `,
  styles: []
})
export class UiSkeletonGroupComponent implements OnInit, OnChanges {
  @Input() count = 3;
  @Input() variant: 'text' | 'card' = 'text';
  @Input() gap: 'sm' | 'md' | 'lg' = 'md';

  skeletons: { variant: string; width: string; height: string }[] = [];

  ngOnInit(): void {
    this.updateSkeletons();
  }

  ngOnChanges(): void {
    this.updateSkeletons();
  }

  private updateSkeletons(): void {
    this.skeletons = Array.from({ length: this.count }).map(() => ({
      variant: this.variant,
      width: '100%',
      height: this.variant === 'card' ? '200px' : '1rem'
    }));
  }
}
