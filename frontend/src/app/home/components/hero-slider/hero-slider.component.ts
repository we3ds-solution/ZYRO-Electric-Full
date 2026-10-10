import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HeroSlide } from '../../models';

@Component({
  selector: 'app-hero-slider',
  templateUrl: './hero-slider.component.html',
  styleUrls: ['./hero-slider.component.scss']
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  private router = inject(Router);

  @Input() heroSlides: HeroSlide[] = [];
  
  activeSlide = 0;
  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    if (this.heroSlides.length > 0) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  goToSlide(index: number): void {
    this.stopAutoPlay();
    this.activeSlide = index;
    this.startAutoPlay();
  }

  nextSlide(): void {
    if (!this.heroSlides.length) return;
    this.activeSlide = (this.activeSlide + 1) % this.heroSlides.length;
  }

  prevSlide(): void {
    if (!this.heroSlides.length) return;
    this.activeSlide = (this.activeSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}
