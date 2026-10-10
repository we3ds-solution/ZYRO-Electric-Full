import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { UiToastComponent } from '../../../shared/ui/components/toast/toast.component';
import { AUTH_SERVICE_TOKEN } from '../../../shared/interfaces/dependency-injection';

@Component({
  selector: 'app-auth-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  // DIP: Inject via tokens (abstraction), not concrete classes
  private authService = inject(AUTH_SERVICE_TOKEN);
  private router = inject(Router);

  @ViewChild('toast') toast!: UiToastComponent;
  
  registerForm: FormGroup;
  isLoading = false;

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (!this.registerForm.valid) return;

    this.isLoading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        if (this.toast && typeof this.toast.show === 'function') {
          this.toast.type = 'success';
          this.toast.title = 'Account Created';
          this.toast.message = 'Welcome! Redirecting to products...';
          this.toast.show();
        }
        
        setTimeout(() => this.router.navigate(['/products']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        if (this.toast && typeof this.toast.show === 'function') {
          this.toast.type = 'error';
          this.toast.title = 'Registration Failed';
          this.toast.message = err || 'An error occurred';
          this.toast.show();
        }
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
