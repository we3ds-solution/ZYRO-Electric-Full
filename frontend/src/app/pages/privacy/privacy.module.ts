import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PrivacyComponent } from './privacy.component';

@NgModule({
  declarations: [PrivacyComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [PrivacyComponent]
})
export class PrivacyModule { }
