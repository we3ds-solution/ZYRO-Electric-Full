import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchBarComponent],
      imports: [CommonModule, FormsModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default inputs', () => {
    it('should default placeholder to "Search..."', () => {
      expect(component.placeholder).toBe('Search...');
    });

    it('should default debounceMs to 300', () => {
      expect(component.debounceMs).toBe(300);
    });

    it('should start with empty searchQuery', () => {
      expect(component.searchQuery).toBe('');
    });
  });

  describe('clearSearch()', () => {
    it('should clear searchQuery to empty string', () => {
      component.searchQuery = 'USB Hub';
      component.clearSearch();
      expect(component.searchQuery).toBe('');
    });

    it('should emit empty string via searchChange', () => {
      let emitted = '';
      component.searchChange.subscribe((v: string) => emitted = v);
      component.searchQuery = 'something';
      component.clearSearch();
      expect(emitted).toBe('');
    });
  });

  describe('onSearchInput() with debounce', () => {
    it('should emit search value after debounce delay', fakeAsync(() => {
      component.debounceMs = 300;
      component.ngOnInit();
      let emitted = '';
      component.searchChange.subscribe((v: string) => emitted = v);

      component.onSearchInput({ target: { value: 'USB' } } as any);
      tick(300);
      expect(emitted).toBe('USB');
    }));

    it('should only emit the final value on rapid input', fakeAsync(() => {
      component.debounceMs = 300;
      component.ngOnInit();
      const emittedValues: string[] = [];
      component.searchChange.subscribe((v: string) => emittedValues.push(v));

      component.onSearchInput({ target: { value: 'U' } } as any);
      tick(100);
      component.onSearchInput({ target: { value: 'US' } } as any);
      tick(100);
      component.onSearchInput({ target: { value: 'USB' } } as any);
      tick(300);
      expect(emittedValues[emittedValues.length - 1]).toBe('USB');
    }));
  });
});
