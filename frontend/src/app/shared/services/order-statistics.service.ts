import { Injectable } from '@angular/core';
import { Order } from '../../orders/models';

// Single Responsibility: Handle order statistics and analytics only
@Injectable({ providedIn: 'root' })
export class OrderStatisticsService {
  calculateTotalRevenue(orders: Order[]): number {
    return orders.reduce((total, order) => total + (order.total || 0), 0);
  }

  calculateAverageOrderValue(orders: Order[]): number {
    if (orders.length === 0) return 0;
    return this.calculateTotalRevenue(orders) / orders.length;
  }

  calculateTotalOrders(orders: Order[]): number {
    return orders.length;
  }

  calculateOrdersByStatus(orders: Order[]): Record<string, number> {
    return orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  calculateMonthlyRevenue(orders: Order[]): Record<string, number> {
    return orders.reduce((acc, order) => {
      const month = new Date(order.createdAt).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' });
      acc[month] = (acc[month] || 0) + (order.total || 0);
      return acc;
    }, {} as Record<string, number>);
  }

  getTopProducts(orders: Order[]): { productId: string; quantity: number }[] {
    const productMap = new Map<string, number>();
    orders.forEach(order => {
      order.items.forEach(item => {
        productMap.set(item.productId, (productMap.get(item.productId) || 0) + item.quantity);
      });
    });
    return Array.from(productMap.entries())
      .map(([productId, quantity]) => ({ productId, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }

  calculateRepeatCustomers(orders: Order[]): number {
    const userMap = new Map<string, number>();
    orders.forEach(order => {
      userMap.set(order.userId, (userMap.get(order.userId) || 0) + 1);
    });
    return Array.from(userMap.values()).filter(count => count > 1).length;
  }
}
