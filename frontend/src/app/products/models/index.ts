// Product Models
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  category: string;
  rating: ProductRating;
  stock: number;
  sku: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isFeatured?: boolean;
  vendor?: string;
}

export interface ProductRating {
  average: number;
  count: number;
  distribution: Record<number, number>;
}

// Category
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  productCount: number;
}

// Review
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
  images?: string[];
}

// Filter
export interface ProductFilter {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  searchQuery?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popularity';
}

// Pagination
export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
