import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TermsComponent } from './terms.component';
import { TERMS_SECTIONS, TERMS_LAST_UPDATED } from './data';

describe('TermsComponent', () => {
  let component: TermsComponent;
  let fixture: ComponentFixture<TermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TermsComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(TermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load terms sections from data.ts', () => {
    expect(component.sections).toEqual(TERMS_SECTIONS);
    expect(component.sections.length).toBe(10);
  });

  it('should have lastUpdated date set', () => {
    expect(component.lastUpdated).toBe(TERMS_LAST_UPDATED);
    expect(component.lastUpdated).toBeDefined();
  });

  it('should have all sections with required properties', () => {
    component.sections.forEach(section => {
      expect(section.title).toBeDefined();
      expect(section.icon).toBeDefined();
    });
  });

  it('should have 10 terms sections', () => {
    expect(component.sections.length).toBe(10);
  });

  it('should have sections with emoji icons', () => {
    const expectedIcons = ['✓', '📋', '⚠️', '🛡️', '✔️', '👤', '💰', '🛒', '📦', '↩️'];
    component.sections.forEach((section, index) => {
      expect(section.icon).toBe(expectedIcons[index]);
    });
  });

  it('should have terms sections in order: Agreement, License, Disclaimer, Liability, Accuracy, Accounts, Products, Orders, Shipping, Returns', () => {
    const expectedTitles = [
      'Agreement to Terms',
      'Use License',
      'Disclaimer of Warranties',
      'Limitation of Liability',
      'Accuracy of Materials',
      'User Accounts',
      'Products & Pricing',
      'Orders & Purchases',
      'Shipping & Delivery',
      'Returns & Refunds'
    ];
    const actualTitles = component.sections.map(s => s.title);
    expect(actualTitles).toEqual(expectedTitles);
  });

  it('should have Agreement section as first', () => {
    expect(component.sections[0].title).toBe('Agreement to Terms');
  });

  it('should have Returns & Refunds as last section', () => {
    expect(component.sections[component.sections.length - 1].title).toBe('Returns & Refunds');
  });

  it('should have unique titles for all sections', () => {
    const titles = component.sections.map(s => s.title);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
  });
});
