import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CareersComponent } from './careers.component';

@NgModule({
  declarations: [CareersComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [CareersComponent]
})
export class CareersModule { }
