/**
 * Centralized Mock/Dummy Data for the application
 * This file contains all hardcoded dummy data and default values
 */

import { SortOption } from '../ui/components/sort-dropdown/sort-dropdown.component';
import { FilterGroup } from '../ui/components/filter-panel/filter-panel.component';

/**
 * Sort Options for Products
 */
export const SORT_OPTIONS: SortOption[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popularity', label: 'Most Popular' }
];

/**
 * Default Filter Groups for Products — Haxel activewear (prices in LE / EGP)
 */
export const DEFAULT_FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'category',
    name: 'Category',
    type: 'select',
    options: [],
    currentValue: ''
  },
  {
    id: 'price-range',
    name: 'Price Range (LE)',
    type: 'price-range',
    minValue: 0,
    maxValue: 3500,
    currentMin: 0,
    currentMax: 3500
  },
  {
    id: 'rating',
    name: 'Rating',
    type: 'rating',
    currentValue: 0
  },
  {
    id: 'stock',
    name: 'Stock Status',
    type: 'checkbox',
    options: [
      { value: 'in-stock', label: 'In Stock Only' }
    ],
    currentValue: ''
  }
];

/**
 * Default Pagination Settings
 */
export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_CURRENT_PAGE = 1;

/**
 * Default Search Placeholder — Haxel
 */
export const SEARCH_PLACEHOLDER = 'Search leggings, tees, footwear...';
export const SEARCH_DEBOUNCE_MS = 300;
