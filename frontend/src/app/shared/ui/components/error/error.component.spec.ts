import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiErrorComponent, UiErrorBoundaryComponent } from './error.component';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UiErrorComponent', () => {
  let component: UiErrorComponent;
  let fixture: ComponentFixture<UiErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiErrorComponent],
      imports: [CommonModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UiErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default inputs', () => {
    it('should have default title', () => {
      expect(component.title).toBe('Something went wrong');
    });

    it('should have default message', () => {
      expect(component.message).toBe('An unexpected error occurred');
    });

    it('should default details to undefined', () => {
      expect(component.details).toBeUndefined();
    });
  });

  describe('retry()', () => {
    it('should emit retried event', () => {
      let emitted = false;
      component.retried.subscribe(() => emitted = true);
      component.retry();
      expect(emitted).toBeTrue();
    });
  });
});

describe('UiErrorBoundaryComponent', () => {
  let component: UiErrorBoundaryComponent;
  let fixture: ComponentFixture<UiErrorBoundaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiErrorBoundaryComponent],
      imports: [CommonModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UiErrorBoundaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default state', () => {
    it('should start with hasError = false', () => {
      expect(component.hasError).toBeFalse();
    });
  });

  describe('captureError()', () => {
    it('should set hasError to true', () => {
      component.captureError(new Error('Test error'));
      expect(component.hasError).toBeTrue();
    });

    it('should set errorMessage from error message', () => {
      component.captureError(new Error('Something broke'));
      expect(component.errorMessage).toBe('Something broke');
    });

    it('should generate an errorId starting with ERR_', () => {
      component.captureError(new Error('fail'));
      expect(component.errorId).toMatch(/^ERR_/);
    });

    it('should set errorTime', () => {
      component.captureError(new Error('fail'));
      expect(component.errorTime).toBeTruthy();
    });

    it('should handle non-Error objects gracefully', () => {
      component.captureError({ message: 'plain obj error' });
      expect(component.errorMessage).toBe('plain obj error');
    });
  });

  describe('resetError()', () => {
    it('should set hasError to false', () => {
      component.captureError(new Error('err'));
      component.resetError();
      expect(component.hasError).toBeFalse();
    });

    it('should clear errorMessage', () => {
      component.captureError(new Error('err'));
      component.resetError();
      expect(component.errorMessage).toBe('');
    });
  });
});
