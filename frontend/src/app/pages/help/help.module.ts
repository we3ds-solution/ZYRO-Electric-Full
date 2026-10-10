import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HelpComponent } from './help.component';

@NgModule({
  declarations: [HelpComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [HelpComponent]
})
export class HelpModule { }
