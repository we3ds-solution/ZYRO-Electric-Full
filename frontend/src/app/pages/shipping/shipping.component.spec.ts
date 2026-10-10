import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShippingComponent } from './shipping.component';
import { SHIPPING_OPTIONS } from './data';

describe('ShippingComponent', () => {
  let component: ShippingComponent;
  let fixture: ComponentFixture<ShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShippingComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load shipping options from data.ts', () => {
    expect(component.shippingOptions).toEqual(SHIPPING_OPTIONS);
    expect(component.shippingOptions.length).toBe(4);
  });

  it('should have all shipping options with required properties', () => {
    component.shippingOptions.forEach(option => {
      expect(option.name).toBeDefined();
      expect(option.processing).toBeDefined();
      expect(option.delivery).toBeDefined();
      expect(option.cost).toBeDefined();
      expect(option.coverage).toBeDefined();
    });
  });

  it('should have 4 Egypt shipping options', () => {
    const names = component.shippingOptions.map(o => o.name);
    expect(names).toContain('Standard Shipping');
    expect(names).toContain('Express Cairo / Giza');
    expect(names).toContain('Express Alexandria / Delta');
    expect(names).toContain('Cash on Delivery');
  });

  it('should have Standard Shipping with 1-2 days processing', () => {
    const standard = component.shippingOptions.find(o => o.name === 'Standard Shipping');
    expect(standard).toBeDefined();
    if (standard) {
      expect(standard.processing).toContain('1-2');
    }
  });

  it('should have Standard Shipping with free option over 3 items', () => {
    const standard = component.shippingOptions.find(o => o.name === 'Standard Shipping');
    expect(standard).toBeDefined();
    if (standard) {
      expect(standard.cost).toContain('free over 3 items');
    }
  });

  it('should have Express Cairo with next-day delivery', () => {
    const expedited = component.shippingOptions.find(o => o.name === 'Express Cairo / Giza');
    expect(expedited).toBeDefined();
    if (expedited) {
      expect(expedited.delivery).toContain('Next business day');
    }
  });

  it('should have COD option', () => {
    const cod = component.shippingOptions.find(o => o.name === 'Cash on Delivery');
    expect(cod).toBeDefined();
    if (cod) {
      expect(cod.cost).toContain('60 LE');
    }
  });

  it('should cover Egypt', () => {
    const standard = component.shippingOptions.find(o => o.name === 'Standard Shipping');
    expect(standard).toBeDefined();
    if (standard) {
      expect(standard.coverage).toContain('Egypt');
    }
  });

  it('should have all options covering Egypt', () => {
    component.shippingOptions.forEach(option => {
      expect(option.coverage).toMatch(/Egypt|Cairo|Alex/);
    });
  });

  it('should have delivery times properly labeled', () => {
    const standard = component.shippingOptions.find(o => o.name === 'Standard Shipping');
    const express = component.shippingOptions.find(o => o.name === 'Express Cairo / Giza');
    const cod = component.shippingOptions.find(o => o.name === 'Cash on Delivery');
    
    expect(standard?.delivery).toContain('2-5');
    expect(express?.delivery).toContain('Next business day');
    expect(cod?.delivery).toContain('2-5');
  });
});
