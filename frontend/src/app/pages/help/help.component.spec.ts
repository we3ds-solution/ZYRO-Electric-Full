import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpComponent } from './help.component';
import { HELP_FAQS } from './data';

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load FAQs from data.ts', () => {
    expect(component.faqs).toEqual(HELP_FAQS);
    expect(component.faqs.length).toBe(3);
  });

  it('should have expandedFAQ initially null', () => {
    expect(component.expandedFAQ).toBeNull();
  });

  it('should have all FAQ sections with required properties', () => {
    component.faqs.forEach(section => {
      expect(section.category).toBeDefined();
      expect(section.items).toBeDefined();
      expect(Array.isArray(section.items)).toBeTruthy();
    });
  });

  it('should have all FAQ items with required properties', () => {
    component.faqs.forEach(section => {
      section.items.forEach(item => {
        expect(item.question).toBeDefined();
        expect(item.answer).toBeDefined();
      });
    });
  });

  it('should have at least 3 items in each FAQ section', () => {
    component.faqs.forEach(section => {
      expect(section.items.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('should have 3 FAQ categories: Ordering, Shipping, Returns', () => {
    const categories = component.faqs.map(f => f.category);
    expect(categories).toContain('Ordering & Purchases');
    expect(categories).toContain('Shipping & Delivery');
    expect(categories).toContain('Returns & Refunds');
  });
});
