import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CartComponent } from './components/cart/cart.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CartComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class CartsModule { }
