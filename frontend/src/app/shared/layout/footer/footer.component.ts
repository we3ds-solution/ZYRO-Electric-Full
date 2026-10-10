import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  private router = inject(Router);

  currentYear = new Date().getFullYear();

  footerLinks = {
    company: [
      { label: 'About Us', route: '/about' },
      { label: 'Our Stores', route: '/branches' },
      { label: 'Men', route: '/products' },
      { label: 'Women', route: '/products' },
      { label: 'Footwear', route: '/products' }
    ],
    support: [
      { label: 'Shipping & Refund Policy', route: '/shipping' },
      { label: 'Contact Us', route: '/contact' },
      { label: 'FAQ', route: '/faq' },
      { label: 'Size Guide', route: '/help' }
    ],
    legal: [
      { label: 'Privacy Policy', route: '/privacy' },
      { label: 'Terms of Service', route: '/terms' },
      { label: 'Cookie Policy', route: '/cookies' },
      { label: 'Return Policy', route: '/returns' }
    ],
    social: [
      { label: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/haxel.me' },
      { label: 'Facebook', icon: 'facebook', url: 'https://facebook.com/haxel.me' },
      { label: 'Twitter', icon: 'twitter', url: 'https://twitter.com' },
      { label: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com' }
    ]
  };

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  openExternal(url: string): void {
    window.open(url, '_blank');
  }
}
