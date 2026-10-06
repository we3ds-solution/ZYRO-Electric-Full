import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AUTH_SERVICE_TOKEN } from '../../../shared/interfaces/dependency-injection';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([{ path: 'products', redirectTo: '' }])],
      providers: [
        FormBuilder,
        { provide: AUTH_SERVICE_TOKEN, useValue: authServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: { returnUrl: '/products' } } }
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.toast = jasmine.createSpyObj('UiToastComponent', ['show']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should create loginForm with email, password and rememberMe', () => {
      expect(component.loginForm.get('email')).not.toBeNull();
      expect(component.loginForm.get('password')).not.toBeNull();
      expect(component.loginForm.get('rememberMe')).not.toBeNull();
    });

    it('should be invalid when empty', () => {
      expect(component.loginForm.valid).toBeFalse();
    });

    it('should be invalid with malformed email', () => {
      component.loginForm.patchValue({ email: 'not-an-email', password: '123' });
      expect(component.loginForm.get('email')?.valid).toBeFalse();
    });

    it('should be valid with correct email and password', () => {
      component.loginForm.patchValue({ email: 'user@zyro.com', password: 'pass123' });
      expect(component.loginForm.valid).toBeTrue();
    });

    it('rememberMe should default to false', () => {
      expect(component.loginForm.get('rememberMe')?.value).toBeFalse();
    });
  });

  describe('isFieldInvalid()', () => {
    it('should return false for pristine field', () => {
      expect(component.isFieldInvalid('email')).toBeFalse();
    });

    it('should return true for touched invalid field', () => {
      const emailField = component.loginForm.get('email')!;
      emailField.markAsTouched();
      expect(component.isFieldInvalid('email')).toBeTrue();
    });

    it('should return false for valid touched field', () => {
      component.loginForm.patchValue({ email: 'valid@test.com' });
      component.loginForm.get('email')!.markAsTouched();
      expect(component.isFieldInvalid('email')).toBeFalse();
    });
  });

  describe('onSubmit()', () => {
    it('should NOT call authService.login when form is invalid', () => {
      component.onSubmit();
      expect(authServiceSpy.login).not.toHaveBeenCalled();
    });

    it('should call authService.login with form values when valid', () => {
      authServiceSpy.login.and.returnValue(of({ user: {} as any, token: 'tok', expiresIn: 3600 }));
      component.loginForm.patchValue({ email: 'a@b.com', password: 'pass' });
      component.onSubmit();
      expect(authServiceSpy.login).toHaveBeenCalledWith(jasmine.objectContaining({ email: 'a@b.com' }));
    });

    it('should set isLoading to false on success', fakeAsync(() => {
      authServiceSpy.login.and.returnValue(of({ user: {} as any, token: 'tok', expiresIn: 3600 }));
      component.loginForm.patchValue({ email: 'a@b.com', password: 'pass' });
      component.onSubmit();
      tick(2000);
      expect(component.isLoading).toBeFalse();
    }));

    it('should set isLoading to false on error', fakeAsync(() => {
      authServiceSpy.login.and.returnValue(throwError(() => new Error('fail')));
      component.loginForm.patchValue({ email: 'a@b.com', password: 'pass' });
      component.onSubmit();
      tick(2000);
      expect(component.isLoading).toBeFalse();
    }));
  });
});
