import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ShippingComponent } from './shipping.component';

@NgModule({
  declarations: [ShippingComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [ShippingComponent]
})
export class ShippingModule { }
