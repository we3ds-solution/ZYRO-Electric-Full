import { Component } from '@angular/core';
import { ABOUT_VALUES, ABOUT_STATS, ABOUT_TESTIMONIALS, Value, Stat, Testimonial } from './data';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  currentYear = new Date().getFullYear();
  values: Value[] = ABOUT_VALUES;
  stats: Stat[] = ABOUT_STATS;
  testimonials: Testimonial[] = ABOUT_TESTIMONIALS;
}
