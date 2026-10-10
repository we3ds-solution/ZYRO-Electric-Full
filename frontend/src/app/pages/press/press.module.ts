import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PressComponent } from './press.component';

@NgModule({
  declarations: [PressComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [PressComponent]
})
export class PressModule { }
