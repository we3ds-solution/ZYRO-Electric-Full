import { Component } from '@angular/core';
import { TERMS_SECTIONS, TERMS_LAST_UPDATED, TermsSection } from './data';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent {
  lastUpdated = TERMS_LAST_UPDATED;
  sections: TermsSection[] = TERMS_SECTIONS;
}
