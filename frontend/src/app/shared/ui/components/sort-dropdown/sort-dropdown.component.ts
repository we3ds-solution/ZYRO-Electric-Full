import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface SortOption {
  value: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-ui-sort-dropdown',
  template: `
    <div class="flex items-center gap-3 relative">
      <span class="text-sm font-semibold text-muted-foreground whitespace-nowrap">{{ label }}</span>
    
      <!-- Custom Dropdown Button -->
      <button
        (click)="toggleDropdown()"
        class="flex items-center justify-between gap-3 bg-secondary/30 hover:bg-secondary/60 border border-border/50 px-4 py-2.5 rounded-xl transition-all duration-200 min-w-[160px] group text-sm font-medium">
        <span class="text-foreground">{{ getSelectedLabel() }}</span>
        <lucide-icon name="chevron-down" class="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200" [class.rotate-180]="isOpen"></lucide-icon>
      </button>
    
      <!-- Dropdown Menu -->
      @if (isOpen) {
        <div
          class="absolute top-full right-0 mt-2 w-48 bg-card border border-border shadow-2xl rounded-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 p-1.5">
          <div class="p-1.5 flex flex-col gap-0.5">
            @for (option of options; track option) {
              <button
                (click)="selectOption(option.value)"
                class="flex items-center justify-between w-full px-3 py-2.5 text-left text-sm rounded-xl transition-colors duration-150"
                [class.bg-accent]="selectedSort === option.value"
                [class.text-accent-foreground]="selectedSort === option.value"
                [class.font-bold]="selectedSort === option.value"
                [class.hover:bg-secondary]="selectedSort !== option.value"
                [class.text-foreground]="selectedSort !== option.value">
                {{ option.label }}
                @if (selectedSort === option.value) {
                  <lucide-icon name="check" class="w-4 h-4"></lucide-icon>
                }
              </button>
            }
          </div>
        </div>
      }
    </div>
    
    <!-- Invisible overlay to catch outside clicks -->
    @if (isOpen) {
      <div class="fixed inset-0 z-40" tabindex="0" (click)="closeDropdown()" (keyup.enter)="closeDropdown()"></div>
    }
    `,
  styles: []
})
export class SortDropdownComponent {
  @Input() label = 'Sort by';
  @Input() options: SortOption[] = [];
  @Input() selectedSort = '';
  @Output() sortChange = new EventEmitter<string>();

  isOpen = false;

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  selectOption(value: string): void {
    this.selectedSort = value;
    this.sortChange.emit(this.selectedSort);
    this.isOpen = false;
  }

  getSelectedLabel(): string {
    const option = this.options.find(o => o.value === this.selectedSort);
    return option ? option.label : 'Select...';
  }
}
