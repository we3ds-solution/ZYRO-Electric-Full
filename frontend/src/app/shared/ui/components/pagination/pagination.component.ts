import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-ui-pagination',
  template: `
    <div class="flex justify-center items-center gap-2">
      <!-- Previous Button -->
      <button
        (click)="onPrevious()"
        [disabled]="currentPage === 1"
        class="btn-outline px-4 py-2"
        [class.opacity-50]="currentPage === 1">
        <lucide-icon name="chevron-left" class="w-4 h-4"></lucide-icon>
      </button>
    
      <!-- Page Numbers -->
      <div class="flex items-center gap-1">
        <!-- First Page -->
        @if (pages[0] > 1) {
          <button
            (click)="onPageChange(1)"
            class="px-3 py-2 rounded btn-outline">
            1
          </button>
        }
    
        <!-- Ellipsis Before -->
        @if (pages[0] > 2) {
          <span class="px-2">...</span>
        }
    
        <!-- Page Range -->
        @for (page of pages; track page) {
          <button
            (click)="onPageChange(page)"
            [class.btn-primary]="page === currentPage"
            [class.btn-outline]="page !== currentPage"
            class="px-3 py-2 rounded">
            {{ page }}
          </button>
        }
    
        <!-- Ellipsis After -->
        @if (pages[pages.length - 1] < totalPages - 1) {
          <span class="px-2">...</span>
        }
    
        <!-- Last Page -->
        @if (pages[pages.length - 1] < totalPages) {
          <button
            (click)="onPageChange(totalPages)"
            class="px-3 py-2 rounded btn-outline">
            {{ totalPages }}
          </button>
        }
      </div>
    
      <!-- Next Button -->
      <button
        (click)="onNext()"
        [disabled]="currentPage === totalPages"
        class="btn-outline px-4 py-2"
        [class.opacity-50]="currentPage === totalPages">
        <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
      </button>
    </div>
    
    <!-- Page Info -->
    @if (showPageInfo) {
      <div class="text-center text-sm text-muted-foreground mt-4">
        Page {{ currentPage }} of {{ totalPages }} ({{ totalItems }} items)
      </div>
    }
    `,
  styles: []
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() totalItems = 0;
  @Input() pagesVisible = 5;
  @Input() showPageInfo = true;
  @Output() pageChange = new EventEmitter<number>();

  pages: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentPage'] || changes['totalPages']) {
      this.calculatePages();
    }
  }

  private calculatePages(): void {
    const half = Math.floor(this.pagesVisible / 2);
    let start = Math.max(1, this.currentPage - half);
    const end = Math.min(this.totalPages, start + this.pagesVisible - 1);

    if (end - start + 1 < this.pagesVisible) {
      start = Math.max(1, end - this.pagesVisible + 1);
    }

    this.pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  onPrevious(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  onNext(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  onPageChange(page: number): void {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
