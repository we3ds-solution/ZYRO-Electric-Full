import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { OrderService } from './services/order.service';
import { TrackingComponent } from './components/tracking/tracking.component';

const ORDER_COMPONENTS = [
  TrackingComponent
];

const ORDER_SERVICES = [
  OrderService
];

@NgModule({
  declarations: [...ORDER_COMPONENTS],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  providers: [...ORDER_SERVICES],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrdersModule { }
