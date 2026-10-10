import { Component } from '@angular/core';
import { PRIVACY_SECTIONS, PRIVACY_LAST_UPDATED, PRIVACY_EFFECTIVE_DATE, Section } from './data';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent {
  lastUpdated = PRIVACY_LAST_UPDATED;
  effectiveDate = PRIVACY_EFFECTIVE_DATE;
  sections: Section[] = PRIVACY_SECTIONS;
}
