import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';
import { ABOUT_VALUES, ABOUT_STATS, ABOUT_TESTIMONIALS } from './data';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have currentYear set to current year', () => {
    const currentYear = new Date().getFullYear();
    expect(component.currentYear).toBe(currentYear);
  });

  it('should load values from data.ts', () => {
    expect(component.values).toEqual(ABOUT_VALUES);
    expect(component.values.length).toBe(6);
  });

  it('should load stats from data.ts', () => {
    expect(component.stats).toEqual(ABOUT_STATS);
    expect(component.stats.length).toBe(4);
  });

  it('should load testimonials from data.ts', () => {
    expect(component.testimonials).toEqual(ABOUT_TESTIMONIALS);
    expect(component.testimonials.length).toBe(3);
  });

  it('should have all values with required properties', () => {
    component.values.forEach(value => {
      expect(value.title).toBeDefined();
      expect(value.description).toBeDefined();
      expect(value.icon).toBeDefined();
    });
  });

  it('should have all stats with required properties', () => {
    component.stats.forEach(stat => {
      expect(stat.label).toBeDefined();
      expect(stat.value).toBeDefined();
    });
  });

  it('should have all testimonials with required properties', () => {
    component.testimonials.forEach(testimonial => {
      expect(testimonial.name).toBeDefined();
      expect(testimonial.text).toBeDefined();
      expect(testimonial.rating).toBe(5);
    });
  });
});
