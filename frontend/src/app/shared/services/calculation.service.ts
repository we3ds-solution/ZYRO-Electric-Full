import { Injectable } from '@angular/core';

// Single Responsibility: Handle price calculations only
@Injectable({ providedIn: 'root' })
export class CalculationService {
  private readonly TAX_RATE = 0.08; // 8% tax
  private readonly SHIPPING_RATES = {
    standard: 10,
    express: 20,
    overnight: 50
  };

  calculateTax(subtotal: number): number {
    return Math.round(subtotal * this.TAX_RATE * 100) / 100;
  }

  calculateShipping(method: string): number {
    return this.SHIPPING_RATES[method as keyof typeof this.SHIPPING_RATES] || 10;
  }

  calculateDiscount(subtotal: number, discountPercent: number): number {
    return Math.round(subtotal * (discountPercent / 100) * 100) / 100;
  }

  calculateTotal(subtotal: number, tax: number, shipping: number, discount = 0): number {
    return Math.max(0, Math.round((subtotal + tax + shipping - discount) * 100) / 100);
  }

  getShippingMethods(): string[] {
    return Object.keys(this.SHIPPING_RATES);
  }

  getShippingCost(method: string): number {
    return this.SHIPPING_RATES[method as keyof typeof this.SHIPPING_RATES] || 0;
  }

  getTaxRate(): number {
    return this.TAX_RATE;
  }
}
