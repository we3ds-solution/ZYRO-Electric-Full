// Order Models
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type OrderPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  discount?: number;
  tax?: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  trackingNumber?: string;
  history: OrderHistory[];
  notes?: string;
  cancellationReason?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'apple-pay' | 'google-pay';
  last4?: string;
  brand?: string;
}

export interface OrderHistory {
  status: OrderStatus;
  timestamp: Date;
  message: string;
  metadata?: Record<string, unknown>;
}

// Order Statistics
export interface OrderStatistics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: Date;
  ordersByStatus: Record<OrderStatus, number>;
}

// Order Filter
export interface OrderFilter {
  status?: OrderStatus[];
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}

// Order Pagination
export interface OrderPage {
  items: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
