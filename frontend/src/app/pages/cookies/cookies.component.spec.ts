import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookiesComponent } from './cookies.component';
import { COOKIE_TYPES } from './data';

describe('CookiesComponent', () => {
  let component: CookiesComponent;
  let fixture: ComponentFixture<CookiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CookiesComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(CookiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cookie types from data.ts', () => {
    expect(component.cookieTypes).toEqual(COOKIE_TYPES);
    expect(component.cookieTypes.length).toBe(4);
  });

  it('should have all cookie types with required properties', () => {
    component.cookieTypes.forEach(cookieType => {
      expect(cookieType.name).toBeDefined();
      expect(cookieType.duration).toBeDefined();
      expect(cookieType.purpose).toBeDefined();
    });
  });

  it('should have 4 cookie types: Essential, Performance, Marketing, Functional', () => {
    const names = component.cookieTypes.map(c => c.name);
    expect(names).toContain('Essential Cookies');
    expect(names).toContain('Performance Cookies');
    expect(names).toContain('Marketing Cookies');
    expect(names).toContain('Functional Cookies');
  });

  it('should have Essential Cookies with Session/1 year duration', () => {
    const essential = component.cookieTypes.find(c => c.name === 'Essential Cookies');
    expect(essential).toBeDefined();
    if (essential) {
      expect(essential.duration).toBe('Session/1 year');
    }
  });

  it('should have Performance Cookies with 2 years duration', () => {
    const performance = component.cookieTypes.find(c => c.name === 'Performance Cookies');
    expect(performance).toBeDefined();
    if (performance) {
      expect(performance.duration).toBe('2 years');
    }
  });

  it('should have Marketing Cookies with 1-3 years duration', () => {
    const marketing = component.cookieTypes.find(c => c.name === 'Marketing Cookies');
    expect(marketing).toBeDefined();
    if (marketing) {
      expect(marketing.duration).toBe('1-3 years');
    }
  });

  it('should have Functional Cookies with 1 year duration', () => {
    const functional = component.cookieTypes.find(c => c.name === 'Functional Cookies');
    expect(functional).toBeDefined();
    if (functional) {
      expect(functional.duration).toBe('1 year');
    }
  });

  it('should have all cookies with defined purposes', () => {
    component.cookieTypes.forEach(cookieType => {
      expect(cookieType.purpose.length).toBeGreaterThan(0);
    });
  });

  it('should have Essential Cookies covering security and functionality', () => {
    const essential = component.cookieTypes.find(c => c.name === 'Essential Cookies');
    if (essential) {
      expect(essential.purpose).toContain('security');
      expect(essential.purpose).toContain('functionality');
    }
  });
});
