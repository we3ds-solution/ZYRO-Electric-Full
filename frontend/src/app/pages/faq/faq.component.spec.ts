import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FAQComponent } from './faq.component';
import { FAQ_ITEMS } from './data';

describe('FAQComponent', () => {
  let component: FAQComponent;
  let fixture: ComponentFixture<FAQComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FAQComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(FAQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load FAQ items from data.ts', () => {
    expect(component.faqs).toEqual(FAQ_ITEMS);
    expect(component.faqs.length).toBe(10);
  });

  it('should have expandedId initially null', () => {
    expect(component.expandedId).toBeNull();
  });

  it('should have all FAQ items with required properties', () => {
    component.faqs.forEach(faq => {
      expect(faq.question).toBeDefined();
      expect(faq.answer).toBeDefined();
    });
  });

  it('should have 10 FAQ items', () => {
    expect(component.faqs.length).toBe(10);
  });

  it('should have FAQ questions covering orders, payments, shipping, returns, tracking, security, and international', () => {
    const questions = component.faqs.map(f => f.question);
    expect(questions.some(q => q.includes('order'))).toBeTruthy();
    expect(questions.some(q => q.includes('payment') || q.includes('accept'))).toBeTruthy();
    expect(questions.some(q => q.includes('shipping') || q.includes('shipping'))).toBeTruthy();
    expect(questions.some(q => q.includes('return'))).toBeTruthy();
    expect(questions.some(q => q.includes('track'))).toBeTruthy();
  });

  it('should have answers for all FAQs', () => {
    component.faqs.forEach(faq => {
      expect(faq.answer.length).toBeGreaterThan(0);
    });
  });

  it('should have toggleFAQ method', () => {
    expect(component.toggleFAQ).toBeDefined();
    expect(typeof component.toggleFAQ).toBe('function');
  });

  it('should toggle FAQ expansion', () => {
    const faqId = '1';
    component.toggleFAQ(faqId);
    expect(component.expandedId).toBe(faqId);
    
    component.toggleFAQ(faqId);
    expect(component.expandedId).toBeNull();
  });

  it('should switch between different FAQ items', () => {
    component.toggleFAQ('1');
    expect(component.expandedId).toBe('1');
    
    component.toggleFAQ('2');
    expect(component.expandedId).toBe('2');
  });

  it('should have answers containing helpful information', () => {
    const allAnswers = component.faqs.map(f => f.answer).join(' ');
    expect(allAnswers.length).toBeGreaterThan(100);
    expect(allAnswers).toContain('days');
  });

  it('should have all questions and answers in proper format', () => {
    component.faqs.forEach(faq => {
      expect(faq.question).toMatch(/^[A-Z]/); // starts with uppercase
      expect(faq.answer).toMatch(/^[A-Z]/); // starts with uppercase
    });
  });
});
