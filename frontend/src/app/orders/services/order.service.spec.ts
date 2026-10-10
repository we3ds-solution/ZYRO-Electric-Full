import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrderService } from './order.service';
import { ORDER_SERVICE_TOKEN } from '../../shared/interfaces/dependency-injection';
import { OrderItem, ShippingAddress, PaymentMethod } from '../models';

describe('OrderService', () => {
  let service: OrderService;

  const mockShippingAddress: ShippingAddress = {
    firstName: 'Mostafa',
    lastName: 'Said',
    phone: '+1234567890',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'US'
  };

  const mockPaymentMethod: PaymentMethod = {
    type: 'card',
    last4: '4242',
    brand: 'Visa'
  };

  const mockItems: OrderItem[] = [
    { productId: 'p-001', title: 'USB Hub', quantity: 2, price: 29.99, image: '' },
    { productId: 'p-002', title: 'Cable', quantity: 1, price: 9.99, image: '' }
  ];

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [ OrderService, { provide: ORDER_SERVICE_TOKEN, useExisting: OrderService } ],
      schemas: [ NO_ERRORS_SCHEMA ]});
    service = TestBed.inject(OrderService);
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createOrder()', () => {
    it('should create an order with correct totals', fakeAsync(() => {
      let createdOrder: any;
      service.createOrder(mockItems, mockShippingAddress, mockPaymentMethod)
        .subscribe(o => createdOrder = o);
      tick(600);

      const expectedSubtotal = (29.99 * 2) + (9.99 * 1); // 69.97
      expect(createdOrder.subtotal).toBeCloseTo(expectedSubtotal, 1);
      expect(createdOrder.tax).toBeCloseTo(expectedSubtotal * 0.10, 1);
      expect(createdOrder.shipping).toBe(10);
    }));

    it('should assign a unique order ID with ORD- prefix', fakeAsync(() => {
      let order: any;
      service.createOrder(mockItems, mockShippingAddress, mockPaymentMethod).subscribe(o => order = o);
      tick(600);
      expect(order.id).toMatch(/^ORD-/);
    }));

    it('should set initial status to pending', fakeAsync(() => {
      let order: any;
      service.createOrder(mockItems, mockShippingAddress, mockPaymentMethod).subscribe(o => order = o);
      tick(600);
      expect(order.status).toBe('pending');
    }));

    it('should include order history entry on creation', fakeAsync(() => {
      let order: any;
      service.createOrder(mockItems, mockShippingAddress, mockPaymentMethod).subscribe(o => order = o);
      tick(600);
      expect(order.history.length).toBeGreaterThanOrEqual(1);
      expect(order.history[0].status).toBe('pending');
    }));

    it('should save order to localStorage', fakeAsync(() => {
      service.createOrder(mockItems, mockShippingAddress, mockPaymentMethod).subscribe();
      tick(600);
      const stored = localStorage.getItem('orders');
      expect(stored).not.toBeNull();
    }));
  });

  describe('getOrderById()', () => {
    it('should throw error for non-existent order ID', () => {
      let error: any;
      service.getOrderById('NONEXISTENT').subscribe({ error: e => error = e });
      expect(error.message).toBe('Order not found');
    });

    it('should return order by ID after creating it', fakeAsync(() => {
      let createdOrder: any;
      service.createOrder(mockItems, mockShippingAddress, mockPaymentMethod).subscribe(o => createdOrder = o);
      tick(600);

      let foundOrder: any;
      service.getOrderById(createdOrder.id).subscribe(o => foundOrder = o);
      tick(300);
      expect(foundOrder.id).toBe(createdOrder.id);
    }));
  });

  describe('updateOrderStatus()', () => {
    it('should update the order status', fakeAsync(() => {
      let orderId = '';
      service.createOrder(mockItems, mockShippingAddress, mockPaymentMethod).subscribe(o => orderId = o.id);
      tick(600);

      let updated: any;
      service.updateOrderStatus(orderId, 'confirmed', 'Order confirmed').subscribe(o => updated = o);
      tick(400);
      expect(updated.status).toBe('confirmed');
    }));

    it('should add entry to order history on status update', fakeAsync(() => {
      let orderId = '';
      service.createOrder(mockItems, mockShippingAddress, mockPaymentMethod).subscribe(o => orderId = o.id);
      tick(600);

      let updated: any;
      service.updateOrderStatus(orderId, 'shipped', 'Shipped out').subscribe(o => updated = o);
      tick(400);
      expect(updated.history.some((h: any) => h.status === 'shipped')).toBeTrue();
    }));

    it('should set paymentStatus to paid when order is confirmed', fakeAsync(() => {
      let orderId = '';
      service.createOrder(mockItems, mockShippingAddress, mockPaymentMethod).subscribe(o => orderId = o.id);
      tick(600);

      let updated: any;
      service.updateOrderStatus(orderId, 'confirmed', 'Confirmed').subscribe(o => updated = o);
      tick(400);
      expect(updated.paymentStatus).toBe('paid');
    }));

    it('should throw error for non-existent order ID', () => {
      let error: any;
      service.updateOrderStatus('FAKE', 'confirmed', 'msg').subscribe({ error: e => error = e });
      expect(error.message).toBe('Order not found');
    });
  });

  describe('cancelOrder()', () => {
    it('should cancel a pending order', fakeAsync(() => {
      let orderId = '';
      service.createOrder(mockItems, mockShippingAddress, mockPaymentMethod).subscribe(o => orderId = o.id);
      tick(600);

      let cancelled: any;
      service.cancelOrder(orderId, 'Changed my mind').subscribe(o => cancelled = o);
      tick(400);
      expect(cancelled.status).toBe('cancelled');
    }));

    it('should not allow cancelling a delivered order', fakeAsync(() => {
      let orderId = '';
      service.createOrder(mockItems, mockShippingAddress, mockPaymentMethod).subscribe(o => orderId = o.id);
      tick(600);

      service.updateOrderStatus(orderId, 'delivered', 'Delivered').subscribe();
      tick(400);

      let error: any;
      service.cancelOrder(orderId, 'Too late').subscribe({ error: e => error = e });
      expect(error.message).toBe('Cannot cancel order in current status');
    }));
  });

  describe('getOrderStatistics()', () => {
    it('should return statistics with zero totals when no orders exist', fakeAsync(() => {
      let stats: any;
      service.getOrderStatistics().subscribe(s => stats = s);
      tick(300);
      expect(stats.totalOrders).toBe(0);
      expect(stats.totalSpent).toBe(0);
    }));

    it('should count total orders correctly after creating orders', fakeAsync(() => {
      service.createOrder(mockItems, mockShippingAddress, mockPaymentMethod).subscribe();
      tick(600);
      service.createOrder(mockItems, mockShippingAddress, mockPaymentMethod).subscribe();
      tick(600);

      let stats: any;
      service.getOrderStatistics().subscribe(s => stats = s);
      tick(300);
      expect(stats.totalOrders).toBe(2);
    }));
  });

  describe('getOrders()', () => {
    it('should return paginated results', fakeAsync(() => {
      let page: any;
      service.getOrders(1, 10).subscribe(p => page = p);
      tick(400);
      expect(page.page).toBe(1);
      expect(page.pageSize).toBe(10);
      expect(page.items).toBeDefined();
    }));
  });

  describe('orders$', () => {
    it('should emit updated orders after createOrder', fakeAsync(() => {
      let orders: any[] = [];
      service.orders$.subscribe(o => orders = o);
      service.createOrder(mockItems, mockShippingAddress, mockPaymentMethod).subscribe();
      tick(600);
      expect(orders.length).toBeGreaterThan(0);
    }));
  });
});
