export interface ShippingOption {
  name: string;
  processing: string;
  delivery: string;
  cost: string;
  coverage: string;
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    name: 'Standard Shipping',
    processing: '1-2 business days',
    delivery: '2-5 business days',
    cost: '60 LE (free over 3 items)',
    coverage: 'All Egypt'
  },
  {
    name: 'Express Cairo / Giza',
    processing: 'Same day (by 2 PM)',
    delivery: 'Next business day',
    cost: '90 LE',
    coverage: 'Cairo & Giza'
  },
  {
    name: 'Express Alexandria / Delta',
    processing: '1-2 business days',
    delivery: '2-3 business days',
    cost: '100 LE',
    coverage: 'Alex & Delta'
  },
  {
    name: 'Cash on Delivery',
    processing: '1-2 business days',
    delivery: '2-5 business days',
    cost: '60 LE + 15 LE COD fee (free over 3 items)',
    coverage: 'All Egypt'
  }
];
