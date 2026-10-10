import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AUTH_SERVICE_TOKEN } from '../../../shared/interfaces/dependency-injection';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: any;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([{ path: 'products', redirectTo: '' }])],
      providers: [
        FormBuilder,
        { provide: AUTH_SERVICE_TOKEN, useValue: authServiceSpy }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    component.toast = jasmine.createSpyObj('UiToastComponent', ['show']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should create registerForm with all required fields', () => {
      expect(component.registerForm.get('name')).not.toBeNull();
      expect(component.registerForm.get('email')).not.toBeNull();
      expect(component.registerForm.get('phone')).not.toBeNull();
      expect(component.registerForm.get('address')).not.toBeNull();
      expect(component.registerForm.get('password')).not.toBeNull();
      expect(component.registerForm.get('confirmPassword')).not.toBeNull();
      expect(component.registerForm.get('terms')).not.toBeNull();
    });

    it('should be invalid when empty', () => {
      expect(component.registerForm.valid).toBeFalse();
    });

    it('should require minimum 8 characters for password', () => {
      component.registerForm.patchValue({ password: 'short' });
      expect(component.registerForm.get('password')?.valid).toBeFalse();
    });

    it('should accept password with 8+ characters', () => {
      component.registerForm.patchValue({ password: 'longpassword' });
      expect(component.registerForm.get('password')?.valid).toBeTrue();
    });

    it('should require terms to be accepted', () => {
      component.registerForm.patchValue({ terms: false });
      expect(component.registerForm.get('terms')?.valid).toBeFalse();
    });
  });

  describe('passwordMatchValidator()', () => {
    it('should return passwordMismatch error when passwords differ', () => {
      component.registerForm.patchValue({
        password: 'password1',
        confirmPassword: 'password2'
      });
      expect(component.registerForm.errors?.['passwordMismatch']).toBeTrue();
    });

    it('should return null when passwords match', () => {
      component.registerForm.patchValue({
        password: 'password1',
        confirmPassword: 'password1'
      });
      expect(component.registerForm.errors?.['passwordMismatch']).toBeFalsy();
    });
  });

  describe('isFieldInvalid()', () => {
    it('should return false for pristine field', () => {
      expect(component.isFieldInvalid('name')).toBeFalse();
    });

    it('should return true for touched empty required field', () => {
      component.registerForm.get('name')!.markAsTouched();
      expect(component.isFieldInvalid('name')).toBeTrue();
    });

    it('should return false for valid touched field', () => {
      component.registerForm.patchValue({ name: 'Mostafa Said' });
      component.registerForm.get('name')!.markAsTouched();
      expect(component.isFieldInvalid('name')).toBeFalse();
    });
  });

  describe('onSubmit()', () => {
    it('should NOT call authService.register when form is invalid', () => {
      component.onSubmit();
      expect(authServiceSpy.register).not.toHaveBeenCalled();
    });

    it('should call authService.register with form values when valid', () => {
      authServiceSpy.register.and.returnValue(of({ user: {} as any, token: 'tok', expiresIn: 3600 }));
      component.registerForm.patchValue({
        name: 'Mostafa Said',
        email: 'mostafa@haxel.me',
        phone: '+1234567890',
        address: '123 Haxel St',
        password: 'password123',
        confirmPassword: 'password123',
        terms: true
      });
      component.onSubmit();
      expect(authServiceSpy.register).toHaveBeenCalledWith(jasmine.objectContaining({ email: 'mostafa@haxel.me' }));
    });

    it('should set isLoading to false on success', fakeAsync(() => {
      authServiceSpy.register.and.returnValue(of({ user: {} as any, token: 'tok', expiresIn: 3600 }));
      component.registerForm.patchValue({
        name: 'Test', email: 'a@b.com', phone: '123',
        address: 'addr', password: 'password1', confirmPassword: 'password1', terms: true
      });
      component.onSubmit();
      tick(2000);
      expect(component.isLoading).toBeFalse();
    }));

    it('should set isLoading to false on error', fakeAsync(() => {
      authServiceSpy.register.and.returnValue(throwError(() => new Error('fail')));
      component.registerForm.patchValue({
        name: 'Test', email: 'a@b.com', phone: '123',
        address: 'addr', password: 'password1', confirmPassword: 'password1', terms: true
      });
      component.onSubmit();
      tick(2000);
      expect(component.isLoading).toBeFalse();
    }));
  });
});
