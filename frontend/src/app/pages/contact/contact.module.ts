import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ContactComponent } from './contact.component';

@NgModule({
  declarations: [ContactComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [ContactComponent]
})
export class ContactModule { }
