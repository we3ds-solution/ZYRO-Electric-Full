import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiButtonComponent } from './button.component';
import { CommonModule } from '@angular/common';

describe('UiButtonComponent', () => {
  let component: UiButtonComponent;
  let fixture: ComponentFixture<UiButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiButtonComponent],
      imports: [CommonModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(UiButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default inputs', () => {
    it('should default label to "Button"', () => {
      expect(component.label).toBe('Button');
    });

    it('should default variant to "primary"', () => {
      expect(component.variant).toBe('primary');
    });

    it('should default size to "md"', () => {
      expect(component.size).toBe('md');
    });

    it('should default disabled to false', () => {
      expect(component.disabled).toBeFalse();
    });

    it('should default icon to undefined', () => {
      expect(component.icon).toBeUndefined();
    });
  });

  describe('getButtonClasses()', () => {
    it('should always include base classes', () => {
      const classes = component.getButtonClasses();
      expect(classes).toContain('inline-flex');
      expect(classes).toContain('font-bold');
    });

    it('should include btn-primary for primary variant', () => {
      component.variant = 'primary';
      expect(component.getButtonClasses()).toContain('btn-primary');
    });

    it('should include btn-outline for outline variant', () => {
      component.variant = 'outline';
      expect(component.getButtonClasses()).toContain('btn-outline');
    });

    it('should include bg-red for danger variant', () => {
      component.variant = 'danger';
      expect(component.getButtonClasses()).toContain('bg-red-500');
    });

    it('should include small padding for sm size', () => {
      component.size = 'sm';
      expect(component.getButtonClasses()).toContain('px-2');
    });

    it('should include large padding for lg size', () => {
      component.size = 'lg';
      expect(component.getButtonClasses()).toContain('px-6');
    });

    it('should include medium padding for md size (default)', () => {
      component.size = 'md';
      expect(component.getButtonClasses()).toContain('px-4');
    });
  });

  describe('clicked handler', () => {
    it('should emit clicked event when invoked', () => {
      const spy = jasmine.createSpy('clickedFn');
      component.clicked.subscribe(spy);
      component.clicked.emit();
      expect(spy).toHaveBeenCalled();
    });
  });
});
