import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CONTACT_METHODS, ContactMethod } from './data';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  private fb = inject(FormBuilder);

  contactForm: FormGroup;
  submitted = false;
  contactMethods: ContactMethod[] = CONTACT_METHODS;

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      category: ['general', Validators.required]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      // TODO: Send to backend API
      this.contactForm.reset();
      this.submitted = false;
    }
  }
}
