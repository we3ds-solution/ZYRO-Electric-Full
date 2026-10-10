import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturedProductsComponent } from './featured-products.component';
import { HomeModule } from '../../home.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('FeaturedProductsComponent', () => {
  let component: FeaturedProductsComponent;
  let fixture: ComponentFixture<FeaturedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeModule, RouterTestingModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedProductsComponent);
    component = fixture.componentInstance;
    component.featuredProducts = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
