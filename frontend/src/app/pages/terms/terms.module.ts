import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TermsComponent } from './terms.component';

@NgModule({
  declarations: [TermsComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [TermsComponent]
})
export class TermsModule { }
