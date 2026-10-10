import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiDrawerComponent } from './drawer.component';
import { CommonModule } from '@angular/common';

describe('UiDrawerComponent', () => {
  let component: UiDrawerComponent;
  let fixture: ComponentFixture<UiDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiDrawerComponent],
      imports: [CommonModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(UiDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default state', () => {
    it('should start with isOpen = false', () => {
      expect(component.isOpen).toBeFalse();
    });

    it('should default title to "Drawer"', () => {
      expect(component.title).toBe('Drawer');
    });

    it('should default position to "right"', () => {
      expect(component.position).toBe('right');
    });

    it('should default badge to undefined', () => {
      expect(component.badge).toBeUndefined();
    });
  });

  describe('getTranslationClass()', () => {
    it('should return translate-x-0 when isOpen is true', () => {
      component.isOpen = true;
      expect(component.getTranslationClass()).toBe('translate-x-0');
    });

    it('should return translate-x-full when closed and position is right', () => {
      component.isOpen = false;
      component.position = 'right';
      expect(component.getTranslationClass()).toBe('translate-x-full');
    });

    it('should return -translate-x-full when closed and position is left', () => {
      component.isOpen = false;
      component.position = 'left';
      expect(component.getTranslationClass()).toBe('-translate-x-full');
    });
  });

  describe('getDrawerClasses()', () => {
    it('should include right-0 when position is right', () => {
      component.position = 'right';
      expect(component.getDrawerClasses()).toContain('right-0');
    });

    it('should include left-0 when position is left', () => {
      component.position = 'left';
      expect(component.getDrawerClasses()).toContain('left-0');
    });
  });

  describe('close()', () => {
    it('should emit closed event', () => {
      let emitted = false;
      component.closed.subscribe(() => emitted = true);
      component.close();
      expect(emitted).toBeTrue();
    });
  });

  describe('onEscapeKey()', () => {
    it('should call close when isOpen is true', () => {
      spyOn(component, 'close');
      component.isOpen = true;
      component.onEscapeKey();
      expect(component.close).toHaveBeenCalled();
    });

    it('should NOT call close when isOpen is false', () => {
      spyOn(component, 'close');
      component.isOpen = false;
      component.onEscapeKey();
      expect(component.close).not.toHaveBeenCalled();
    });
  });
});
