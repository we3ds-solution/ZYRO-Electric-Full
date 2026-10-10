import { Component } from '@angular/core';
import { SHIPPING_OPTIONS, ShippingOption } from './data';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent {
  shippingOptions: ShippingOption[] = SHIPPING_OPTIONS;
}
