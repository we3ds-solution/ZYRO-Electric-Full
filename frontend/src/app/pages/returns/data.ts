export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export const RETURN_WINDOW = '30 days from delivery';

export const FREE_RETURN_CONDITIONS: string[] = [
  'Product is defective or damaged',
  'We sent the wrong item',
  'You have Prime membership',
  'Return is within 30 days'
];

export const RETURN_PROCESS_STEPS: ProcessStep[] = [
  { step: 1, title: 'Initiate Return', description: 'Log in and request return from your order history' },
  { step: 2, title: 'Get Authorization', description: 'Receive RMA# and return shipping label via email' },
  { step: 3, title: 'Ship Item', description: 'Pack securely and ship using the provided label' },
  { step: 4, title: 'Inspection', description: 'We inspect and verify the item\'s condition' },
  { step: 5, title: 'Refund', description: 'Approved refunds processed within 5-7 business days' }
];
