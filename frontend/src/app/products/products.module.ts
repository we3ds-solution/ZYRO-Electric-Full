import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AllProductsComponent } from './components/all-products/all-products.component';
import { ProductsDetailsComponent } from './components/products-details/products-details.component';
import { SharedModule } from '../shared/shared.module';
import { ProductComponent } from './components/product/product.component';

@NgModule({
  declarations: [
    AllProductsComponent,
    ProductsDetailsComponent,
    ProductComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ProductsModule { }
