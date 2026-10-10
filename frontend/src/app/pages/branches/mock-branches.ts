import { Branch } from './models/branch.model';

export const MOCK_BRANCHES: Branch[] = [
  {
    id: 'b-001',
    name: 'Haxel Flagship — New Cairo',
    code: 'CAI-01',
    city: 'New Cairo',
    state: 'Cairo',
    address: 'Galleria40, El Teseen St, New Cairo',
    zipCode: '11835',
    phone: '+20 100 123 4567',
    email: 'newcairo@haxel.me',
    isOpenNow: true,
    isMainBranch: true,
    manager: 'Omar Khaled',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80',
    services: ['Store Pickup', 'Size Exchange', 'Footwear Fitting', 'New Drops', 'Easy Returns'],
    openingHours: [
      { day: 'Sun - Thu', hours: '09:00 AM - 06:00 PM' },
      { day: 'Saturday', hours: '10:00 AM - 08:00 PM' },
      { day: 'Friday', hours: '02:00 PM - 09:00 PM' }
    ]
  },
  {
    id: 'b-002',
    name: 'Haxel Zamalek Studio',
    code: 'CAI-02',
    city: 'Zamalek',
    state: 'Cairo',
    address: '12 Brazil St, Zamalek',
    zipCode: '11211',
    phone: '+20 101 234 5678',
    email: 'zamalek@haxel.me',
    isOpenNow: true,
    manager: 'Salma Adel',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    services: ['Store Pickup', 'Size Exchange', 'Styling Help'],
    openingHours: [
      { day: 'Sun - Thu', hours: '09:00 AM - 06:00 PM' },
      { day: 'Saturday', hours: '10:00 AM - 07:00 PM' },
      { day: 'Friday', hours: '02:00 PM - 08:00 PM' }
    ]
  },
  {
    id: 'b-003',
    name: 'Haxel Alexandria Hub',
    code: 'ALX-01',
    city: 'Alexandria',
    state: 'Alexandria',
    address: 'San Stefano, El Gaish Rd',
    zipCode: '21500',
    phone: '+20 102 345 6789',
    email: 'alex@haxel.me',
    isOpenNow: true,
    manager: 'Karim Samy',
    image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80',
    services: ['Store Pickup', 'Footwear Fitting', 'Easy Returns'],
    openingHours: [
      { day: 'Sun - Thu', hours: '09:00 AM - 06:00 PM' },
      { day: 'Saturday', hours: '10:00 AM - 07:00 PM' },
      { day: 'Friday', hours: 'Closed' }
    ]
  },
  {
    id: 'b-004',
    name: 'Haxel Giza / Sheikh Zayed',
    code: 'GIZ-01',
    city: 'Sheikh Zayed',
    state: 'Giza',
    address: 'Arkan Plaza, Sheikh Zayed',
    zipCode: '12588',
    phone: '+20 103 456 7890',
    email: 'zayed@haxel.me',
    isOpenNow: false,
    manager: 'Nour El-Din',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80',
    services: ['Store Pickup', 'Size Exchange', 'Easy Returns'],
    openingHours: [
      { day: 'Sun - Thu', hours: '09:00 AM - 06:00 PM' },
      { day: 'Saturday', hours: '10:00 AM - 06:00 PM' },
      { day: 'Friday', hours: '02:00 PM - 08:00 PM' }
    ]
  },
  {
    id: 'b-005',
    name: 'Haxel Nasr City Experience Store',
    code: 'CAI-03',
    city: 'Nasr City',
    state: 'Cairo',
    address: 'Citystars, Omar Ibn El Khattab St',
    zipCode: '11765',
    phone: '+20 104 567 8901',
    email: 'nasrcity@haxel.me',
    isOpenNow: true,
    manager: 'Mariam Fathy',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    services: ['Store Pickup', 'New Drops', 'Footwear Fitting', 'Size Exchange'],
    openingHours: [
      { day: 'Sun - Thu', hours: '10:00 AM - 09:00 PM' }
    ]
  }
];
