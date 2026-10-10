import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-ui-search-bar',
  template: `
    <div class="flex items-center gap-2 w-full">
      <div class="flex-1 relative">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (input)="onSearchInput($event)"
          [placeholder]="placeholder"
          class="form-input w-full pl-10">
          <lucide-icon name="search" class="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"></lucide-icon>
        </div>
        @if (searchQuery) {
          <button
            (click)="clearSearch()"
            class="btn-outline px-3 py-2 flex items-center justify-center">
            <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
          </button>
        }
      </div>
    `,
  styles: []
})
export class SearchBarComponent implements OnInit {
  @Input() placeholder = 'Search...';
  @Input() debounceMs = 300;
  @Output() searchChange = new EventEmitter<string>();

  searchQuery = '';
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(this.debounceMs),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchChange.emit(query);
    });
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchChange.emit('');
  }
}
