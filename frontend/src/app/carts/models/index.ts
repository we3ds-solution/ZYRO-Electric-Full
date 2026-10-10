// Cart Models
import { Product } from '../../products/models';

export interface CartItem {
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  discount?: number;
  tax?: number;
  addedAt: Date;
}

export interface Cart {
  id?: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  lastUpdated: Date;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  productId: string;
  quantity: number;
}

export interface CartSummary {
  itemCount: number;
  uniqueProducts: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
}

export interface CheckoutData {
  cartItems: CartItem[];
  shippingMethod: 'standard' | 'express' | 'overnight';
  shippingCost: number;
  taxAmount: number;
  couponCode?: string;
  discountAmount?: number;
  total: number;
}
