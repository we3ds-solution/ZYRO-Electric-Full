import { Injectable } from '@angular/core';

export interface Coupon {
  code: string;
  discountPercent: number;
  maxUses: number;
  currentUses: number;
  expiryDate: Date;
  isActive: boolean;
}

// Single Responsibility: Handle coupon validation and discount calculation
@Injectable({ providedIn: 'root' })
export class CouponService {
  private coupons: Map<string, Coupon> = new Map<string, Coupon>([
    ['SAVE10', { code: 'SAVE10', discountPercent: 10, maxUses: 100, currentUses: 45, expiryDate: new Date('2025-12-31'), isActive: true }],
    ['SAVE20', { code: 'SAVE20', discountPercent: 20, maxUses: 50, currentUses: 48, expiryDate: new Date('2025-12-31'), isActive: true }],
    ['FREESHIP', { code: 'FREESHIP', discountPercent: 15, maxUses: 200, currentUses: 120, expiryDate: new Date('2025-12-31'), isActive: true }]
  ]);

  validateCoupon(code: string): { valid: boolean; discount: number; error?: string } {
    const coupon = this.coupons.get(code.toUpperCase());

    if (!coupon) {
      return { valid: false, discount: 0, error: 'Coupon code not found' };
    }

    if (!coupon.isActive) {
      return { valid: false, discount: 0, error: 'Coupon is no longer active' };
    }

    if (new Date() > coupon.expiryDate) {
      return { valid: false, discount: 0, error: 'Coupon has expired' };
    }

    if (coupon.currentUses >= coupon.maxUses) {
      return { valid: false, discount: 0, error: 'Coupon usage limit reached' };
    }

    return { valid: true, discount: coupon.discountPercent };
  }

  applyCoupon(code: string): { success: boolean; discountPercent: number; error?: string } {
    const validation = this.validateCoupon(code);
    if (!validation.valid) {
      return { success: false, discountPercent: 0, error: validation.error };
    }

    const coupon = this.coupons.get(code.toUpperCase());
    if (coupon) {
      coupon.currentUses++;
    }

    return { success: true, discountPercent: validation.discount };
  }

  getCoupon(code: string): Coupon | undefined {
    return this.coupons.get(code.toUpperCase());
  }

  getAllActiveCoupons(): Coupon[] {
    return Array.from(this.coupons.values()).filter(c => c.isActive && new Date() <= c.expiryDate);
  }

  addCoupon(coupon: Coupon): void {
    this.coupons.set(coupon.code.toUpperCase(), coupon);
  }

  removeCoupon(code: string): void {
    this.coupons.delete(code.toUpperCase());
  }
}
