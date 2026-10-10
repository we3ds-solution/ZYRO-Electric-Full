import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiBadgeComponent } from './badge.component';
import { CommonModule } from '@angular/common';

describe('UiBadgeComponent', () => {
  let component: UiBadgeComponent;
  let fixture: ComponentFixture<UiBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiBadgeComponent],
      imports: [CommonModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(UiBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default inputs', () => {
    it('should default label to empty string', () => {
      expect(component.label).toBe('');
    });

    it('should default variant to "default"', () => {
      expect(component.variant).toBe('default');
    });

    it('should default icon to undefined', () => {
      expect(component.icon).toBeUndefined();
    });
  });

  describe('getBadgeClasses()', () => {
    it('should always include base classes', () => {
      const classes = component.getBadgeClasses();
      expect(classes).toContain('tag-skill');
      expect(classes).toContain('inline-flex');
    });

    it('should return success classes for success variant', () => {
      component.variant = 'success';
      expect(component.getBadgeClasses()).toContain('!bg-green-500');
    });

    it('should return warning classes for warning variant', () => {
      component.variant = 'warning';
      expect(component.getBadgeClasses()).toContain('!bg-yellow-500');
    });

    it('should return danger classes for danger variant', () => {
      component.variant = 'danger';
      expect(component.getBadgeClasses()).toContain('!bg-red-500');
    });

    it('should return accent classes for accent variant', () => {
      component.variant = 'accent';
      expect(component.getBadgeClasses()).toContain('!bg-accent');
    });
  });
});
