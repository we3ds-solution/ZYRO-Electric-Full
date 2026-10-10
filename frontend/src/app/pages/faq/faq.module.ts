import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FAQComponent } from './faq.component';

@NgModule({
  declarations: [FAQComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [FAQComponent]
})
export class FAQModule { }
