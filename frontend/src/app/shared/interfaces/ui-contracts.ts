// Interface Segregation: UI component contracts - clients depend only on what they need

export interface IToastNotification {
  show(title: string, message: string, type: 'success' | 'error' | 'info' | 'warning'): void;
}

export interface ILoadingIndicator {
  show(message?: string): void;
  hide(): void;
}

export interface IConfirmDialog {
  show(title: string, message: string): Promise<boolean>;
}

export interface IPaginator {
  pageSize: number;
  pageIndex: number;
  total: number;
  onPageChange: (page: number) => void;
}

export interface IFilter {
  filters: Record<string, unknown>;
  onFilterChange: (filters: Record<string, unknown>) => void;
}

export interface ISortable {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, order: 'asc' | 'desc') => void;
}

export interface IDataTable<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  onRowClick: (item: T) => void;
}

export interface ISearchable {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export interface ISelectable<T> {
  selectedItems: T[];
  onSelectionChange: (items: T[]) => void;
  isSelected: (item: T) => boolean;
}

export interface ICartDisplay {
  itemCount: number;
  total: number;
}

export interface ICheckoutForm {
  shippingAddress: string;
  shippingMethod: string;
  paymentMethod: string;
  onSubmit: () => void;
}

export interface IProductCard {
  productId: string;
  productName: string;
  price: number;
  image: string;
  rating: number;
  onAddToCart: () => void;
  onViewDetails: () => void;
}
