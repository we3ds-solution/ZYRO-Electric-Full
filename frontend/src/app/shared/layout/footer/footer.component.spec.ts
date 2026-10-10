import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [RouterTestingModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('currentYear', () => {
    it('should be set to the current year', () => {
      expect(component.currentYear).toBe(new Date().getFullYear());
    });
  });

  describe('footerLinks', () => {
    it('should have company links', () => {
      expect(component.footerLinks.company.length).toBeGreaterThan(0);
    });

    it('should include Branches link in company links', () => {
      const branchesLink = component.footerLinks.company.find(l => l.route === '/branches');
      expect(branchesLink).toBeTruthy();
      expect(branchesLink?.label).toBe('Our Branches');
    });

    it('should have support links', () => {
      expect(component.footerLinks.support.length).toBeGreaterThan(0);
    });

    it('should have legal links', () => {
      expect(component.footerLinks.legal.length).toBeGreaterThan(0);
    });

    it('should have social links', () => {
      expect(component.footerLinks.social.length).toBeGreaterThan(0);
    });

    it('every company link should have a label and route', () => {
      component.footerLinks.company.forEach(link => {
        expect(link.label).toBeTruthy();
        expect(link.route).toBeTruthy();
      });
    });

    it('every social link should have a url', () => {
      component.footerLinks.social.forEach(link => {
        expect(link.url).toContain('http');
      });
    });
  });

  describe('navigateTo()', () => {
    it('should call router.navigate with given route', () => {
      spyOn(router, 'navigate');
      component.navigateTo('/about');
      expect(router.navigate).toHaveBeenCalledWith(['/about']);
    });
  });

  describe('openExternal()', () => {
    it('should open external URL in new tab', () => {
      spyOn(window, 'open');
      component.openExternal('https://facebook.com');
      expect(window.open).toHaveBeenCalledWith('https://facebook.com', '_blank');
    });
  });
});
