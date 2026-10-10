import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroSliderComponent } from './hero-slider.component';
import { HomeModule } from '../../home.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('HeroSliderComponent', () => {
  let component: HeroSliderComponent;
  let fixture: ComponentFixture<HeroSliderComponent>;
  let router: Router;

  // Helper to create mock hero slide data
  const createMockSlide = (index: number) => ({
    badge: index.toString(),
    badgeIcon: 'zap',
    badgeBg: '',
    badgeBorder: '',
    badgeText: '',
    titlePrefix: `Slide ${index}`,
    titleHighlight: '',
    titleSuffix: '',
    description: `Sub ${index}`,
    ctaPrimary: `Go ${index}`,
    ctaSecondary: '',
    image: `img${index}.jpg`,
    bgGradient: '',
    accentColor: '',
    tags: []
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeModule, RouterTestingModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSliderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    component.heroSlides = [
      createMockSlide(1),
      createMockSlide(2),
      createMockSlide(3)
    ];
    jasmine.clock().install();
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start autoplay on init if slides exist', () => {
    spyOn(component, 'startAutoPlay');
    component.ngOnInit();
    expect(component.startAutoPlay).toHaveBeenCalled();
  });

  it('should stop autoplay on destroy', () => {
    spyOn(component, 'stopAutoPlay');
    component.ngOnDestroy();
    expect(component.stopAutoPlay).toHaveBeenCalled();
  });

  it('should go to specific slide and restart autoplay', () => {
    spyOn(component, 'stopAutoPlay');
    spyOn(component, 'startAutoPlay');
    
    component.goToSlide(2);
    
    expect(component.stopAutoPlay).toHaveBeenCalled();
    expect(component.activeSlide).toBe(2);
    expect(component.startAutoPlay).toHaveBeenCalled();
  });

  it('should go to next slide', () => {
    component.activeSlide = 0;
    component.nextSlide();
    expect(component.activeSlide).toBe(1);
    
    component.activeSlide = 2; // last slide
    component.nextSlide();
    expect(component.activeSlide).toBe(0); // wrap around
  });

  it('should not go to next slide if no slides', () => {
    component.heroSlides = [];
    component.activeSlide = 0;
    component.nextSlide();
    expect(component.activeSlide).toBe(0);
  });

  it('should go to prev slide', () => {
    component.activeSlide = 1;
    component.prevSlide();
    expect(component.activeSlide).toBe(0);
    
    component.activeSlide = 0; // first slide
    component.prevSlide();
    expect(component.activeSlide).toBe(2); // wrap around
  });

  it('should not go to prev slide if no slides', () => {
    component.heroSlides = [];
    component.activeSlide = 0;
    component.prevSlide();
    expect(component.activeSlide).toBe(0);
  });

  it('should change slide on interval', () => {
    component.activeSlide = 0;
    jasmine.clock().tick(5000);
    expect(component.activeSlide).toBe(1);
    jasmine.clock().tick(5000);
    expect(component.activeSlide).toBe(2);
  });

  it('should navigate to products', () => {
    component.goToProducts();
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });
});

