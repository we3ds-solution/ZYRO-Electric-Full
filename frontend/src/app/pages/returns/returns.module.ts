import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ReturnsComponent } from './returns.component';

@NgModule({
  declarations: [ReturnsComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [ReturnsComponent]
})
export class ReturnsModule { }
