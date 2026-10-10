import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiSkeletonComponent, UiSkeletonGroupComponent } from './skeleton.component';
import { CommonModule } from '@angular/common';

describe('UiSkeletonComponent', () => {
  let component: UiSkeletonComponent;
  let fixture: ComponentFixture<UiSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiSkeletonComponent, UiSkeletonGroupComponent],
      imports: [CommonModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(UiSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default inputs', () => {
    it('should default variant to "text"', () => {
      expect(component.variant).toBe('text');
    });

    it('should default width to "100%"', () => {
      expect(component.width).toBe('100%');
    });

    it('should default height to "1rem"', () => {
      expect(component.height).toBe('1rem');
    });
  });

  describe('getSkeletonClasses()', () => {
    it('should always include base animate-pulse class', () => {
      const classes = component.getSkeletonClasses();
      expect(classes).toContain('animate-pulse');
      expect(classes).toContain('bg-muted');
    });

    it('should include text classes for text variant', () => {
      component.variant = 'text';
      expect(component.getSkeletonClasses()).toContain('h-4');
    });

    it('should include card classes for card variant', () => {
      component.variant = 'card';
      expect(component.getSkeletonClasses()).toContain('h-48');
    });

    it('should include avatar classes for avatar variant', () => {
      component.variant = 'avatar';
      const classes = component.getSkeletonClasses();
      expect(classes).toContain('rounded-full');
      expect(classes).toContain('h-12');
    });

    it('should include button classes for button variant', () => {
      component.variant = 'button';
      expect(component.getSkeletonClasses()).toContain('h-10');
    });
  });
});

describe('UiSkeletonGroupComponent', () => {
  let component: UiSkeletonGroupComponent;
  let fixture: ComponentFixture<UiSkeletonGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiSkeletonComponent, UiSkeletonGroupComponent],
      imports: [CommonModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(UiSkeletonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default inputs', () => {
    it('should default count to 3', () => {
      expect(component.count).toBe(3);
    });

    it('should default variant to "text"', () => {
      expect(component.variant).toBe('text');
    });

    it('should default gap to "md"', () => {
      expect(component.gap).toBe('md');
    });
  });

  describe('skeletons getter', () => {
    it('should return array with length equal to count', () => {
      component.count = 5;
      component.ngOnChanges();
      expect(component.skeletons.length).toBe(5);
    });

    it('should use card height 200px for card variant', () => {
      component.variant = 'card';
      component.count = 2;
      component.ngOnChanges();
      component.skeletons.forEach(s => {
        expect(s.height).toBe('200px');
      });
    });

    it('should use 1rem height for text variant', () => {
      component.variant = 'text';
      component.count = 3;
      component.ngOnChanges();
      component.skeletons.forEach(s => {
        expect(s.height).toBe('1rem');
      });
    });
  });
});
