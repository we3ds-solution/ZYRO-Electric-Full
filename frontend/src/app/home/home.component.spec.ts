import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load categories from mock data', () => {
      expect(component.categories.length).toBeGreaterThan(0);
    });

    it('should load featured products from mock data', () => {
      expect(component.featuredProducts.length).toBeGreaterThan(0);
    });

    it('should load promo offers from mock data', () => {
      expect(component.promoOffers.length).toBeGreaterThan(0);
    });

    it('should have hero slides defined', () => {
      expect(component.heroSlides.length).toBeGreaterThan(0);
    });
  });
});
