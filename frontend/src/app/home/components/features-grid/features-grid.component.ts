import { Component, Input } from '@angular/core';
import { Feature } from '../../models';

@Component({
  selector: 'app-features-grid',
  templateUrl: './features-grid.component.html',
  styleUrls: ['./features-grid.component.scss']
})
export class FeaturesGridComponent {
  @Input() features: Feature[] = [];
}
