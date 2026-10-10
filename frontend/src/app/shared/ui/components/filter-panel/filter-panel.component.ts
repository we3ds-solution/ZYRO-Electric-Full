import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

export interface FilterGroup {
  id: string;
  name: string;
  type: 'select' | 'checkbox' | 'price-range' | 'rating';
  options?: { value: unknown; label: string }[];
  minValue?: number;
  maxValue?: number;
  currentValue?: unknown;
  currentMin?: number;
  currentMax?: number;
}

@Component({
  selector: 'app-ui-filter-panel',
  template: `
    <div class="p-6">
      <!-- Premium header with accent bar -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20">
            <lucide-icon name="filter" class="w-4 h-4 text-accent"></lucide-icon>
          </div>
          <h2 class="text-base font-black text-foreground uppercase tracking-widest">{{ title }}</h2>
        </div>
        <button (click)="onReset()" class="text-xs font-bold text-muted-foreground hover:text-accent transition-colors uppercase tracking-wider">
          Reset
        </button>
      </div>
    
      <!-- Filter Groups -->
      @for (group of filterGroups; track group; let last = $last) {
        <div
          [class.pb-6]="!last"
          [class.border-b]="!last"
          [class.border-border]="!last">
          <!-- Checkbox Filter -->
          @if (group.type === 'checkbox') {
            <div class="mb-6">
              <span class="section-label mb-3 block">{{ group.name }}</span>
              <div class="space-y-3">
                @for (opt of group.options; track opt) {
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <!-- Custom Checkbox -->
                    <div class="relative flex items-center justify-center w-5 h-5 rounded-[0.4rem] border-2 transition-all duration-200"
                      [class.bg-accent]="isChecked(group.id, opt.value)"
                      [class.border-accent]="isChecked(group.id, opt.value)"
                      [class.border-muted-foreground]="!isChecked(group.id, opt.value)"
                      [class.group-hover:border-accent]="!isChecked(group.id, opt.value)">
                      <input
                        type="checkbox"
                        [checked]="isChecked(group.id, opt.value)"
                        (change)="onCheckboxChange(group.id, opt.value, $event)"
                        class="absolute opacity-0 w-full h-full cursor-pointer m-0">
                        @if (isChecked(group.id, opt.value)) {
                          <lucide-icon name="check" class="w-3.5 h-3.5 text-accent-foreground"></lucide-icon>
                        }
                      </div>
                      <span class="text-sm font-medium group-hover:text-accent transition-colors">{{ opt.label }}</span>
                    </label>
                  }
                </div>
              </div>
            }
            <!-- Price Range Filter -->
            @if (group.type === 'price-range') {
              <div class="mb-6">
                <span class="section-label mb-3 block">{{ group.name }}</span>
                <div class="space-y-3">
                  <div class="flex gap-3">
                    <div class="relative flex-1">
                      <span class="price-prefix">$</span>
                      <input
                        type="number"
                        [(ngModel)]="group.currentMin"
                        [min]="group.minValue || 0"
                        placeholder="Min"
                        class="form-input price-input w-full text-sm rounded-xl">
                      </div>
                      <div class="relative flex-1">
                        <span class="price-prefix">$</span>
                        <input
                          type="number"
                          [(ngModel)]="group.currentMax"
                          [max]="group.maxValue || 10000"
                          placeholder="Max"
                          class="form-input price-input w-full text-sm rounded-xl">
                        </div>
                      </div>
                      <button
                        (click)="onPriceRangeChange(group.id)"
                        class="btn-primary w-full py-2.5 text-sm rounded-xl font-bold shadow-md shadow-accent/10 hover:scale-[1.02] transition-transform duration-200">
                        Apply Price
                      </button>
                    </div>
                  </div>
                }
                <!-- Rating Filter -->
                @if (group.type === 'rating') {
                  <div class="mb-6">
                    <span class="section-label mb-4 block">{{ group.name }}</span>
                    <div class="space-y-3">
                      @for (i of [5,4,3,2,1]; track i) {
                        <label class="flex items-center gap-3 cursor-pointer group">
                          <!-- Custom Checkbox (Radio-style) -->
                          <div class="relative flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-200"
                            [class.bg-accent]="isChecked(group.id, i)"
                            [class.border-accent]="isChecked(group.id, i)"
                            [class.border-muted-foreground]="!isChecked(group.id, i)"
                            [class.group-hover:border-accent]="!isChecked(group.id, i)">
                            <input
                              type="checkbox"
                              [checked]="isChecked(group.id, i)"
                              (change)="onRatingChange(group.id, i, $event)"
                              class="absolute opacity-0 w-full h-full cursor-pointer m-0">
                              @if (isChecked(group.id, i)) {
                                <div class="w-2 h-2 rounded-full bg-accent-foreground"></div>
                              }
                            </div>
                            <div class="flex items-center gap-1">
                              @for (j of [1,2,3,4,5]; track j) {
                                <lucide-icon
                                  name="star"
                                  [class]="j <= i ? 'fill-accent text-accent' : 'text-muted'"
                                class="w-4 h-4"></lucide-icon>
                              }
                            </div>
                            <span class="text-sm font-semibold text-muted-foreground">{{ i }}+</span>
                          </label>
                        }
                      </div>
                    </div>
                  }
                  <!-- Select Filter -->
                  @if (group.type === 'select') {
                    <div class="mb-6 relative">
                      <span class="section-label mb-2 block">{{ group.name }}</span>
                      <!-- Custom Select Trigger -->
                      <button
                        (click)="toggleSelectDropdown(group.id)"
                        class="flex items-center justify-between gap-3 bg-secondary/30 hover:bg-secondary/60 border border-border/50 px-4 py-3 rounded-xl transition-all duration-200 w-full group text-sm font-semibold text-left z-10 relative">
                        <span class="text-foreground">{{ getSelectSelectedLabel(group) }}</span>
                        <lucide-icon name="chevron-down" class="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200" [class.rotate-180]="isSelectOpen(group.id)"></lucide-icon>
                      </button>
                      <!-- Custom Select Options Menu -->
                      @if (isSelectOpen(group.id)) {
                        <div
                          class="absolute top-full left-0 mt-2 w-full bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div class="max-h-60 overflow-y-auto scrollbar-custom p-1.5">
                            <div class="flex flex-col gap-0.5">
                              <button
                                (click)="selectGroupOption(group, '')"
                                class="flex items-center justify-between w-full px-3 py-2.5 text-left text-sm rounded-xl transition-colors duration-150"
                                [class.bg-accent]="!group.currentValue"
                                [class.text-accent-foreground]="!group.currentValue"
                                [class.font-bold]="!group.currentValue"
                                [class.hover:bg-secondary]="group.currentValue"
                                [class.text-foreground]="group.currentValue">
                                All {{ group.name }}
                                @if (!group.currentValue) {
                                  <lucide-icon name="check" class="w-4 h-4"></lucide-icon>
                                }
                              </button>
                              @for (opt of group.options; track opt) {
                                <button
                                  (click)="selectGroupOption(group, opt.value)"
                                  class="flex items-center justify-between w-full px-3 py-2.5 text-left text-sm rounded-xl transition-colors duration-150"
                                  [class.bg-accent]="group.currentValue === opt.value"
                                  [class.text-accent-foreground]="group.currentValue === opt.value"
                                  [class.font-bold]="group.currentValue === opt.value"
                                  [class.hover:bg-secondary]="group.currentValue !== opt.value"
                                  [class.text-foreground]="group.currentValue !== opt.value">
                                  {{ opt.label }}
                                  @if (group.currentValue === opt.value) {
                                    <lucide-icon name="check" class="w-4 h-4"></lucide-icon>
                                  }
                                </button>
                              }
                            </div>
                          </div>
                        </div>
                      }
                      <!-- Invisible overlay for click outside -->
                      @if (isSelectOpen(group.id)) {
                        <div class="fixed inset-0 z-40" tabindex="0" (click)="closeSelectDropdown(group.id)" (keyup.enter)="closeSelectDropdown(group.id)"></div>
                      }
                    </div>
                  }
                </div>
              }
    
              <!-- Reset Button -->
            </div>
    `,
  styles: [`
    /* Scrollbar inside dropdown */
    .scrollbar-custom::-webkit-scrollbar {
      width: 5px;
    }
    .scrollbar-custom::-webkit-scrollbar-track {
      background: transparent;
    }
    .scrollbar-custom::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 99px;
    }
    .scrollbar-custom::-webkit-scrollbar-thumb:hover {
      background: var(--accent);
    }

    /* Price range input prefix symbol */
    .price-prefix {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent);
      pointer-events: none;
      z-index: 1;
    }

    /* Price range input with left padding for $ prefix */
    .price-input {
      padding-left: 1.75rem !important;
      padding-top: 0.625rem !important;
      padding-bottom: 0.625rem !important;
    }

    /* Hide number input spinner arrows */
    .price-input::-webkit-outer-spin-button,
    .price-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .price-input[type=number] {
      -moz-appearance: textfield;
    }
  `]
})
export class FilterPanelComponent implements OnInit {
  @Input() title = 'Filters';
  @Input() filterGroups: FilterGroup[] = [];
  @Output() filterChange = new EventEmitter<{ filterId: string; value: unknown }>();
  @Output() panelReset = new EventEmitter<void>();

  checkedValues = new Map<string, Set<unknown>>();
  openDropdowns = new Set<string>();

  ngOnInit(): void {
    // Initialize checked values map for checkbox and rating filters
    this.filterGroups.forEach(group => {
      if (group.type === 'checkbox' || group.type === 'rating') {
        this.checkedValues.set(group.id, new Set());
      }
    });
  }

  toggleSelectDropdown(id: string): void {
    if (this.openDropdowns.has(id)) {
      this.openDropdowns.delete(id);
    } else {
      this.openDropdowns.add(id);
    }
  }

  isSelectOpen(id: string): boolean {
    return this.openDropdowns.has(id);
  }

  closeSelectDropdown(id: string): void {
    this.openDropdowns.delete(id);
  }

  selectGroupOption(group: FilterGroup, value: unknown): void {
    group.currentValue = value;
    this.onFilterChange(group.id, value);
    this.closeSelectDropdown(group.id);
  }

  getSelectSelectedLabel(group: FilterGroup): string {
    if (!group.currentValue) {
      return `All ${group.name}`;
    }
    const option = group.options?.find(o => o.value === group.currentValue);
    return option ? option.label : `All ${group.name}`;
  }

  onFilterChange(filterId: string, value: unknown): void {
    this.filterChange.emit({ filterId, value });
  }

  onCheckboxChange(filterId: string, value: unknown, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (!this.checkedValues.has(filterId)) {
      this.checkedValues.set(filterId, new Set());
    }

    const values = this.checkedValues.get(filterId)!;
    if (checked) {
      values.add(value);
    } else {
      values.delete(value);
    }

    this.filterChange.emit({ filterId, value: Array.from(values) });
  }

  onRatingChange(filterId: string, rating: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (!this.checkedValues.has(filterId)) {
      this.checkedValues.set(filterId, new Set());
    }

    const values = this.checkedValues.get(filterId)!;
    if (checked) {
      values.clear(); // Only allow one rating selection
      values.add(rating);
    } else {
      values.delete(rating);
    }

    this.filterChange.emit({ filterId, value: Array.from(values)[0] || 0 });
  }

  onPriceRangeChange(filterId: string): void {
    const group = this.filterGroups.find(g => g.id === filterId);
    if (group) {
      this.filterChange.emit({ 
        filterId, 
        value: { min: group.currentMin, max: group.currentMax } 
      });
    }
  }

  isChecked(filterId: string, value: unknown): boolean {
    return this.checkedValues.get(filterId)?.has(value) ?? false;
  }

  onReset(): void {
    this.checkedValues.clear();
    this.openDropdowns.clear();
    this.filterGroups.forEach(group => {
      group.currentValue = '';
      group.currentMin = group.minValue;
      group.currentMax = group.maxValue;
    });
    this.panelReset.emit();
  }
}
