import { Injectable } from '@angular/core';

// Open/Closed Principle: Open for extension, closed for modification
// New shipping methods can be added without modifying existing code

export interface IShippingStrategy {
  getName(): string;
  calculateCost(weight: number, distance: number): number;
  getDeliveryDays(): number;
  isAvailable(): boolean;
}

export class StandardShipping implements IShippingStrategy {
  getName(): string {
    return 'Standard';
  }

  calculateCost(weight: number, distance: number): number {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _unused = { weight, distance };
    // Standard shipping: flat rate + minimal weight consideration
    return 10;
  }

  getDeliveryDays(): number {
    return 5;
  }

  isAvailable(): boolean {
    return true;
  }
}

export class ExpressShipping implements IShippingStrategy {
  getName(): string {
    return 'Express';
  }

  calculateCost(weight: number, distance: number): number {
    // Express shipping: weight-based with distance consideration
    return 20 + (weight * 0.5) + (distance * 0.01);
  }

  getDeliveryDays(): number {
    return 2;
  }

  isAvailable(): boolean {
    return true;
  }
}

export class OvernightShipping implements IShippingStrategy {
  getName(): string {
    return 'Overnight';
  }

  calculateCost(weight: number, distance: number): number {
    return 50 + (distance * 0.1);
  }

  getDeliveryDays(): number {
    return 1;
  }

  isAvailable(): boolean {
    return true;
  }
}

@Injectable({ providedIn: 'root' })
export class ShippingStrategyFactory {
  private strategies = new Map<string, IShippingStrategy>([
    ['standard', new StandardShipping()],
    ['express', new ExpressShipping()],
    ['overnight', new OvernightShipping()]
  ]);

  getStrategy(type: string): IShippingStrategy {
    return this.strategies.get(type.toLowerCase()) || this.strategies.get('standard')!;
  }

  registerStrategy(type: string, strategy: IShippingStrategy): void {
    this.strategies.set(type.toLowerCase(), strategy);
  }

  getAllStrategies(): IShippingStrategy[] {
    return Array.from(this.strategies.values());
  }
}
