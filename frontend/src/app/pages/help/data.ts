export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSection {
  category: string;
  items: FAQItem[];
}

export const HELP_FAQS: FAQSection[] = [
  {
    category: 'Ordering & Sizing',
    items: [
      {
        question: 'How do I place an order?',
        answer: 'Shop Men / Women / Footwear, pick size (S–2XL apparel, 37–45 footwear), add to cart, checkout with address and cash or card. 5 minutes!'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'Visa, Mastercard and Cash on Delivery across Egypt.'
      },
      {
        question: 'Can I change or cancel my order?',
        answer: 'You can cancel within 2 hours if it hasn\'t shipped yet. Email support@haxel.me for assistance.'
      }
    ]
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        question: 'How long does shipping take?',
        answer: 'Cairo/Giza 2-5 days, Express 1-2 days. Free shipping when you buy 3+ items.'
      },
      {
        question: 'Do you offer free shipping?',
        answer: 'Yes! Free shipping on orders over 3 items (Egypt).'
      },
      {
        question: 'Can I track my order?',
        answer: 'Yes! You\'ll receive tracking via SMS/email when your order ships. Support Sun-Thu 9am-6pm.'
      }
    ]
  },
  {
    category: 'Exchanges & Returns',
    items: [
      {
        question: 'What\'s your exchange policy?',
        answer: 'Smooth & easy exchange & returns within 14 days. Unworn with tags. Free size exchange.'
      },
      {
        question: 'How do I exchange a size?',
        answer: 'Log in → Orders → Select order → Click Exchange → Choose new size. Or visit New Cairo / Zamalek store.'
      },
      {
        question: 'When will I get my refund?',
        answer: '5-10 business days after we receive the return: inspection (1-2 days), approval, then transfer.'
      }
    ]
  }
];
