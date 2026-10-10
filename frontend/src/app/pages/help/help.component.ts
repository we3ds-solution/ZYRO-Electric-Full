import { Component } from '@angular/core';
import { HELP_FAQS, FAQSection } from './data';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {
  expandedFAQ: string | null = null;
  faqs: FAQSection[] = HELP_FAQS;
}
