import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UiToastComponent, ToastType } from './toast.component';
import { CommonModule } from '@angular/common';

describe('UiToastComponent', () => {
  let component: UiToastComponent;
  let fixture: ComponentFixture<UiToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiToastComponent],
      imports: [CommonModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(UiToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default state', () => {
    it('should start hidden', () => {
      expect(component.isVisible).toBeFalse();
    });

    it('should default type to "info"', () => {
      expect(component.type).toBe('info');
    });

    it('should default duration to 5000ms', () => {
      expect(component.duration).toBe(5000);
    });
  });

  describe('show()', () => {
    it('should set isVisible to true', () => {
      component.show();
      expect(component.isVisible).toBeTrue();
    });

    it('should auto-close after duration', fakeAsync(() => {
      component.duration = 1000;
      component.show();
      expect(component.isVisible).toBeTrue();
      tick(1000);
      expect(component.isVisible).toBeFalse();
    }));

    it('should NOT auto-close when duration is 0', fakeAsync(() => {
      component.duration = 0;
      component.show();
      tick(10000);
      expect(component.isVisible).toBeTrue();
    }));
  });

  describe('close()', () => {
    it('should set isVisible to false', () => {
      component.show();
      component.close();
      expect(component.isVisible).toBeFalse();
    });

    it('should emit "closed" event', () => {
      let emitted = false;
      component.closed.subscribe(() => emitted = true);
      component.show();
      component.close();
      expect(emitted).toBeTrue();
    });
  });

  describe('getToastClasses()', () => {
    const types: ToastType[] = ['success', 'error', 'warning', 'info'];
    types.forEach(type => {
      it(`should return classes for ${type} type`, () => {
        component.type = type;
        const classes = component.getToastClasses();
        expect(classes).toContain('fixed');
        expect(classes.length).toBeGreaterThan(10);
      });
    });
  });

  describe('getIconName()', () => {
    it('should return "check-circle" for success', () => {
      component.type = 'success';
      expect(component.getIconName()).toBe('check-circle');
    });

    it('should return "alert-circle" for error', () => {
      component.type = 'error';
      expect(component.getIconName()).toBe('alert-circle');
    });

    it('should return "alert-triangle" for warning', () => {
      component.type = 'warning';
      expect(component.getIconName()).toBe('alert-triangle');
    });

    it('should return "info" for info', () => {
      component.type = 'info';
      expect(component.getIconName()).toBe('info');
    });
  });
});
