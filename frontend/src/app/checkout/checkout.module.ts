import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { CheckoutComponent } from './checkout.component';

@NgModule({
  declarations: [CheckoutComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class CheckoutModule { }
