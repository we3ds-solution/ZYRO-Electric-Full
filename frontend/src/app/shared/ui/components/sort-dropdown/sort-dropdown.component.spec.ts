import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SortDropdownComponent, SortOption } from './sort-dropdown.component';
import { CommonModule } from '@angular/common';

describe('SortDropdownComponent', () => {
  let component: SortDropdownComponent;
  let fixture: ComponentFixture<SortDropdownComponent>;

  const mockOptions: SortOption[] = [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Best Rated' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SortDropdownComponent],
      imports: [CommonModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(SortDropdownComponent);
    component = fixture.componentInstance;
    component.options = mockOptions;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default state', () => {
    it('should start with isOpen = false', () => {
      expect(component.isOpen).toBeFalse();
    });

    it('should default label to "Sort by"', () => {
      expect(component.label).toBe('Sort by');
    });

    it('should default selectedSort to empty string', () => {
      expect(component.selectedSort).toBe('');
    });
  });

  describe('toggleDropdown()', () => {
    it('should open dropdown when closed', () => {
      component.toggleDropdown();
      expect(component.isOpen).toBeTrue();
    });

    it('should close dropdown when open', () => {
      component.isOpen = true;
      component.toggleDropdown();
      expect(component.isOpen).toBeFalse();
    });
  });

  describe('closeDropdown()', () => {
    it('should set isOpen to false', () => {
      component.isOpen = true;
      component.closeDropdown();
      expect(component.isOpen).toBeFalse();
    });
  });

  describe('selectOption()', () => {
    it('should update selectedSort with given value', () => {
      component.selectOption('price-asc');
      expect(component.selectedSort).toBe('price-asc');
    });

    it('should emit sortChange with selected value', () => {
      let emitted = '';
      component.sortChange.subscribe((v: string) => emitted = v);
      component.selectOption('rating');
      expect(emitted).toBe('rating');
    });

    it('should close the dropdown after selection', () => {
      component.isOpen = true;
      component.selectOption('price-desc');
      expect(component.isOpen).toBeFalse();
    });
  });

  describe('getSelectedLabel()', () => {
    it('should return "Select..." when no option is selected', () => {
      component.selectedSort = '';
      expect(component.getSelectedLabel()).toBe('Select...');
    });

    it('should return the matching option label', () => {
      component.selectedSort = 'price-asc';
      expect(component.getSelectedLabel()).toBe('Price: Low to High');
    });

    it('should return "Select..." when value does not match any option', () => {
      component.selectedSort = 'nonexistent';
      expect(component.getSelectedLabel()).toBe('Select...');
    });
  });
});
