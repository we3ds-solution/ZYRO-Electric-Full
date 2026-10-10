import { Component } from '@angular/core';
import { FAQ_ITEMS, FAQItem } from './data';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FAQComponent {
  expandedId: string | null = null;
  faqs: FAQItem[] = FAQ_ITEMS;

  toggleFAQ(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
  }
}
