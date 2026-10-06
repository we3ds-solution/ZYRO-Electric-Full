import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackingComponent } from './tracking.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Order } from '../../models';
import { ORDER_SERVICE_TOKEN } from '../../../shared/interfaces/dependency-injection';

const mockOrder: Order = {
  id: 'ORD-TEST001',
  userId: 'user-1',
  items: [{ productId: 'p-001', title: 'USB Hub', quantity: 1, price: 29.99, image: '' }],
  total: 42.98,
  subtotal: 29.99,
  tax: 3.00,
  shipping: 10.00,
  status: 'shipped',
  paymentStatus: 'paid',
  shippingAddress: {
    firstName: 'Mostafa', lastName: 'Said',
    phone: '+1234567890', street: '123 St', city: 'NY', state: 'NY',
    zipCode: '10001', country: 'US'
  },
  paymentMethod: { type: 'card', last4: '4242', brand: 'Visa' },
  createdAt: new Date(),
  updatedAt: new Date(),
  history: [
    { status: 'pending', timestamp: new Date(), message: 'Created' },
    { status: 'shipped', timestamp: new Date(), message: 'Shipped out' }
  ]
};

describe('TrackingComponent', () => {
  let component: TrackingComponent;
  let fixture: ComponentFixture<TrackingComponent>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    orderServiceSpy = jasmine.createSpyObj('OrderService', ['getOrderById', 'cancelOrder']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [TrackingComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: ORDER_SERVICE_TOKEN, useValue: orderServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'ORD-TEST001' } } }
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    orderServiceSpy.getOrderById.and.returnValue(of(mockOrder));
    fixture = TestBed.createComponent(TrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load order by ID from route params', () => {
      expect(orderServiceSpy.getOrderById).toHaveBeenCalledWith('ORD-TEST001');
    });

    it('should set order on successful load', () => {
      expect(component.order).toEqual(mockOrder);
    });

    it('should keep order null when order not found', () => {
      orderServiceSpy.getOrderById.and.returnValue(throwError(() => new Error('Not found')));
      component.order = null;
      component.ngOnInit();
      expect(component.order).toBeNull();
    });

    it('should not call getOrderById when no ID in route', () => {
      orderServiceSpy.getOrderById.calls.reset();
      const route = TestBed.inject(ActivatedRoute);
      (route.snapshot.paramMap.get as jasmine.Spy) = jasmine.createSpy().and.returnValue(null);
      component.ngOnInit();
      expect(orderServiceSpy.getOrderById).not.toHaveBeenCalled();
    });
  });

  describe('isCurrentStatus()', () => {
    it('should return true when status matches order status', () => {
      expect(component.isCurrentStatus('shipped')).toBeTrue();
    });

    it('should return false when status does not match', () => {
      expect(component.isCurrentStatus('delivered')).toBeFalse();
    });

    it('should return false when order is null', () => {
      component.order = null;
      expect(component.isCurrentStatus('pending')).toBeFalse();
    });
  });

  describe('getStatusIcon()', () => {
    it('should return "clock" for pending', () => {
      expect(component.getStatusIcon('pending')).toBe('clock');
    });

    it('should return "truck" for shipped', () => {
      expect(component.getStatusIcon('shipped')).toBe('truck');
    });

    it('should return "package" for delivered', () => {
      expect(component.getStatusIcon('delivered')).toBe('package');
    });

    it('should return "x-circle" for cancelled', () => {
      expect(component.getStatusIcon('cancelled')).toBe('x-circle');
    });

    it('should return "info" for unknown status', () => {
      expect(component.getStatusIcon('unknown_status')).toBe('info');
    });
  });

  describe('cancelOrder()', () => {
    it('should not call orderService.cancelOrder when order is null', () => {
      component.order = null;
      component.cancelOrder();
      expect(orderServiceSpy.cancelOrder).not.toHaveBeenCalled();
    });

    it('should call cancelOrder on service with correct order ID', () => {
      orderServiceSpy.cancelOrder.and.returnValue(of({ ...mockOrder, status: 'cancelled' }));
      component.cancelOrder();
      expect(orderServiceSpy.cancelOrder).toHaveBeenCalledWith('ORD-TEST001', 'User requested cancellation');
    });

    it('should update order status after successful cancellation', () => {
      const cancelledOrder = { ...mockOrder, status: 'cancelled' as const };
      orderServiceSpy.cancelOrder.and.returnValue(of(cancelledOrder));
      component.cancelOrder();
      expect(component.order?.status).toBe('cancelled');
    });
  });

  describe('goBack()', () => {
    it('should navigate to /products', () => {
      component.goBack();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/products']);
    });
  });
});
