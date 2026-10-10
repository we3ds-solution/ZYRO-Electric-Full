import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CookiesComponent } from './cookies.component';

@NgModule({
  declarations: [CookiesComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [CookiesComponent]
})
export class CookiesModule { }
