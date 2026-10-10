import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AllProductsComponent } from './all-products.component';
import { PRODUCT_SERVICE_TOKEN, CART_SERVICE_TOKEN, SORT_STRATEGY_TOKEN, FILTER_STRATEGY_TOKEN } from '../../../shared/interfaces/dependency-injection';

describe('AllProductsComponent', () => {
  let component: AllProductsComponent;
  let fixture: ComponentFixture<AllProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllProductsComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: PRODUCT_SERVICE_TOKEN, useValue: {
          getProducts: () => of({ items: [], total: 0, page: 1, pages: 1 }),
          getProductById: () => of(null),
          getCategories: () => of([])
        }},
        { provide: CART_SERVICE_TOKEN, useValue: {
          addToCart: () => of({})
        }},
        { provide: SORT_STRATEGY_TOKEN, useValue: { sort: (items: any[]) => items } },
        { provide: FILTER_STRATEGY_TOKEN, useValue: { filter: (items: any[]) => items } }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
