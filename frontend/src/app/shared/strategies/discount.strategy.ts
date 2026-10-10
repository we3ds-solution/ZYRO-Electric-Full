// Open/Closed Principle: Discount strategies can be added without modifying existing code

import { Injectable } from '@angular/core';

export interface DiscountContext {
  subtotal: number;
  itemCount?: number;
}

export interface IDiscountStrategy {
  getType(): string;
  calculate(context: DiscountContext): number;
  validate(context: DiscountContext): boolean;
}

export class PercentageDiscount implements IDiscountStrategy {
  constructor(private percent: number) {}

  getType(): string {
    return 'PERCENTAGE';
  }

  calculate(context: DiscountContext): number {
    return Math.round(context.subtotal * (this.percent / 100) * 100) / 100;
  }

  validate(context: DiscountContext): boolean {
    return (
      typeof context?.subtotal === 'number' &&
      Number.isFinite(context.subtotal) &&
      context.subtotal >= 0 &&
      this.percent > 0 &&
      this.percent <= 100
    );
  }
}

export class FixedDiscount implements IDiscountStrategy {
  constructor(private amount: number) {}

  getType(): string {
    return 'FIXED';
  }

  calculate(context: DiscountContext): number {
    return Math.min(this.amount, context.subtotal);
  }

  validate(context: DiscountContext): boolean {
    return (
      typeof context?.subtotal === 'number' &&
      Number.isFinite(context.subtotal) &&
      context.subtotal >= 0 &&
      this.amount > 0
    );
  }
}

export class BulkDiscount implements IDiscountStrategy {
  constructor(private minQuantity: number, private discountPercent: number) {}

  getType(): string {
    return 'BULK';
  }

  calculate(context: DiscountContext): number {
    // Only apply discount if item count meets minimum quantity threshold
    if (!context.itemCount || context.itemCount < this.minQuantity) {
      return 0;
    }
    return Math.round(context.subtotal * (this.discountPercent / 100) * 100) / 100;
  }

  validate(context: DiscountContext): boolean {
    return (
      typeof context?.subtotal === 'number' &&
      Number.isFinite(context.subtotal) &&
      context.subtotal >= 0 &&
      typeof context?.itemCount === 'number' &&
      context.itemCount >= this.minQuantity &&
      this.discountPercent > 0 &&
      this.discountPercent <= 100
    );
  }
}

@Injectable({ providedIn: 'root' })
export class DiscountStrategyFactory {
  private strategies = new Map<string, IDiscountStrategy>();

  registerStrategy(type: string, strategy: IDiscountStrategy): void {
    this.strategies.set(type.toUpperCase(), strategy);
  }

  getStrategy(type: string): IDiscountStrategy | undefined {
    return this.strategies.get(type.toUpperCase());
  }

  applyDiscount(strategy: IDiscountStrategy, context: DiscountContext): number {
    if (!strategy.validate(context)) {
      return 0;
    }
    return strategy.calculate(context);
  }
}
