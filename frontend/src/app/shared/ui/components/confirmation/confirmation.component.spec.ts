import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiConfirmationComponent } from './confirmation.component';
import { CommonModule } from '@angular/common';

describe('UiConfirmationComponent', () => {
  let component: UiConfirmationComponent;
  let fixture: ComponentFixture<UiConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiConfirmationComponent],
      imports: [CommonModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(UiConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default state', () => {
    it('should start hidden (isVisible = false)', () => {
      expect(component.isVisible).toBeFalse();
    });

    it('should default title to "Confirm"', () => {
      expect(component.title).toBe('Confirm');
    });

    it('should default confirmLabel to "Confirm"', () => {
      expect(component.confirmLabel).toBe('Confirm');
    });

    it('should default cancelLabel to "Cancel"', () => {
      expect(component.cancelLabel).toBe('Cancel');
    });

    it('should default type to "default"', () => {
      expect(component.type).toBe('default');
    });
  });

  describe('open()', () => {
    it('should set isVisible to true', () => {
      component.open();
      expect(component.isVisible).toBeTrue();
    });
  });

  describe('confirm()', () => {
    it('should set isVisible to false', () => {
      component.open();
      component.confirm();
      expect(component.isVisible).toBeFalse();
    });

    it('should emit "confirmed" event', () => {
      let emitted = false;
      component.confirmed.subscribe(() => emitted = true);
      component.confirm();
      expect(emitted).toBeTrue();
    });
  });

  describe('cancel()', () => {
    it('should set isVisible to false', () => {
      component.open();
      component.cancel();
      expect(component.isVisible).toBeFalse();
    });

    it('should emit "cancelled" event', () => {
      let emitted = false;
      component.cancelled.subscribe(() => emitted = true);
      component.cancel();
      expect(emitted).toBeTrue();
    });
  });

  describe('confirmButtonClass', () => {
    it('should return danger button class for danger type', () => {
      component.type = 'danger';
      expect(component.confirmButtonClass).toContain('bg-red-500');
    });

    it('should return default button class for default type', () => {
      component.type = 'default';
      expect(component.confirmButtonClass).toContain('btn-primary');
      expect(component.confirmButtonClass).not.toContain('bg-red-500');
    });
  });
});
