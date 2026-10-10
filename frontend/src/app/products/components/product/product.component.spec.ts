import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ProductComponent } from './product.component';
import { Product } from '../../models';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductComponent ],
      imports: [ RouterTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    component.product = {
      id: '1',
      title: 'Test Product',
      stock: 10,
      price: 99.99,
      category: 'electronics',
      rating: { average: 4.5, count: 20 }
    } as unknown as Product;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
