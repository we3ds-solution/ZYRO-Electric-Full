import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UiToastComponent } from '../../../shared/ui/components/toast/toast.component';
import { AUTH_SERVICE_TOKEN } from '../../../shared/interfaces/dependency-injection';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  // DIP: Inject via tokens (abstraction), not concrete classes
  private authService = inject(AUTH_SERVICE_TOKEN);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild('toast') toast!: UiToastComponent;
  
  loginForm: FormGroup;
  isLoading = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid) return;

    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        if (this.toast && typeof this.toast.show === 'function') {
          this.toast.type = 'success';
          this.toast.title = 'Success';
          this.toast.message = 'Logged in successfully';
          this.toast.show();
        }
        
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isLoading = false;
        if (this.toast && typeof this.toast.show === 'function') {
          this.toast.type = 'error';
          this.toast.title = 'Login Failed';
          this.toast.message = err || 'An error occurred';
          this.toast.show();
        }
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
