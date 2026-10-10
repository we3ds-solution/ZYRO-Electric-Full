// Open/Closed Principle: Payment methods can be added without modifying existing code

import { Injectable } from '@angular/core';

export interface IPaymentStrategy {
  getName(): string;
  processPayment(amount: number, details: PaymentDetails): Promise<PaymentResult>;
  validate(details: PaymentDetails): boolean;
}

export interface PaymentDetails {
  method: string;
  cardNumber?: string;
  cvv?: string;
  expiryDate?: string;
  accountNumber?: string;
  email?: string;
  token?: string;
  [key: string]: unknown;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
}

export class CreditCardPayment implements IPaymentStrategy {
  getName(): string {
    return 'Credit Card';
  }

  processPayment(amount: number, details: PaymentDetails): Promise<PaymentResult> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _unused = { amount, details };
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `CC-${Date.now()}`,
          message: 'Payment processed successfully'
        });
      }, 1000);
    });
  }

  validate(details: PaymentDetails): boolean {
    return !!(details.cardNumber && details.cvv && details.expiryDate);
  }
}

export class PayPalPayment implements IPaymentStrategy {
  getName(): string {
    return 'PayPal';
  }

  processPayment(amount: number, details: PaymentDetails): Promise<PaymentResult> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _unused = { amount, details };
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `PP-${Date.now()}`,
          message: 'PayPal payment processed'
        });
      }, 1500);
    });
  }

  validate(details: PaymentDetails): boolean {
    return !!details.email;
  }
}

export class ApplePayPayment implements IPaymentStrategy {
  getName(): string {
    return 'Apple Pay';
  }

  processPayment(amount: number, details: PaymentDetails): Promise<PaymentResult> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _unused = { amount, details };
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `AP-${Date.now()}`,
          message: 'Apple Pay payment processed'
        });
      }, 800);
    });
  }

  validate(details: PaymentDetails): boolean {
    return !!details.token;
  }
}

@Injectable({ providedIn: 'root' })
export class PaymentStrategyFactory {
  private strategies = new Map<string, IPaymentStrategy>([
    ['creditcard', new CreditCardPayment()],
    ['paypal', new PayPalPayment()],
    ['applepay', new ApplePayPayment()]
  ]);

  getStrategy(type: string): IPaymentStrategy | undefined {
    return this.strategies.get(type.toLowerCase());
  }

  registerStrategy(type: string, strategy: IPaymentStrategy): void {
    this.strategies.set(type.toLowerCase(), strategy);
  }

  getAllStrategies(): IPaymentStrategy[] {
    return Array.from(this.strategies.values());
  }
}
