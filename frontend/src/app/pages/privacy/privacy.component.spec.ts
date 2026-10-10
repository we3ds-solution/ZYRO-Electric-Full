import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivacyComponent } from './privacy.component';
import { PRIVACY_SECTIONS, PRIVACY_LAST_UPDATED, PRIVACY_EFFECTIVE_DATE } from './data';

describe('PrivacyComponent', () => {
  let component: PrivacyComponent;
  let fixture: ComponentFixture<PrivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacyComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load privacy sections from data.ts', () => {
    expect(component.sections).toEqual(PRIVACY_SECTIONS);
    expect(component.sections.length).toBe(5);
  });

  it('should have lastUpdated date set', () => {
    expect(component.lastUpdated).toBe(PRIVACY_LAST_UPDATED);
    expect(component.lastUpdated).toBeDefined();
  });

  it('should have effectiveDate set', () => {
    expect(component.effectiveDate).toBe(PRIVACY_EFFECTIVE_DATE);
    expect(component.effectiveDate).toBeDefined();
  });

  it('should have all sections with required properties', () => {
    component.sections.forEach(section => {
      expect(section.title).toBeDefined();
      expect(section.content).toBeDefined();
      expect(Array.isArray(section.content)).toBeTruthy();
    });
  });

  it('should have all sections with content items', () => {
    component.sections.forEach(section => {
      expect(section.content.length).toBeGreaterThan(0);
      section.content.forEach(item => {
        expect(typeof item).toBe('string');
        expect(item.length).toBeGreaterThan(0);
      });
    });
  });

  it('should have 5 privacy sections: Information, Use, Security, Rights, Sharing', () => {
    const titles = component.sections.map(s => s.title);
    expect(titles).toContain('Information We Collect');
    expect(titles).toContain('How We Use Your Information');
    expect(titles).toContain('Data Security');
    expect(titles).toContain('Your Rights');
    expect(titles).toContain('Third-Party Sharing');
  });

  it('should have Information section covering account, payment, and device data', () => {
    const infoSection = component.sections.find(s => s.title === 'Information We Collect');
    expect(infoSection).toBeDefined();
    if (infoSection) {
      const content = infoSection.content.join(' ');
      expect(content).toContain('Account');
      expect(content).toContain('Payment');
      expect(content).toContain('Device');
    }
  });

  it('should have Security section covering encryption and compliance', () => {
    const securitySection = component.sections.find(s => s.title === 'Data Security');
    expect(securitySection).toBeDefined();
    if (securitySection) {
      const content = securitySection.content.join(' ');
      expect(content).toContain('SSL');
      expect(content).toContain('PCI');
      expect(content).toContain('GDPR');
    }
  });
});
