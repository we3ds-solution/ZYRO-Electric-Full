import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ProductsService } from './products.service';
import { SORT_STRATEGY_TOKEN, FILTER_STRATEGY_TOKEN } from '../../shared/interfaces/dependency-injection';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        { provide: SORT_STRATEGY_TOKEN, useValue: { sort: (items: any[]) => items } },
        { provide: FILTER_STRATEGY_TOKEN, useValue: { filter: (items: any[]) => items } }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    service = TestBed.inject(ProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
