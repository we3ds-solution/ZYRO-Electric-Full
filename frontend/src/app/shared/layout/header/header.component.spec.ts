import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Renderer2, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { HeaderComponent } from './header.component';
import { CART_SERVICE_TOKEN, AUTH_SERVICE_TOKEN, PRODUCT_SERVICE_TOKEN } from '../../../shared/interfaces/dependency-injection';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: CART_SERVICE_TOKEN, useValue: {
          cartItemCount$: of(0), cartItems$: of([]), cartTotal$: of(0),
          addToCart: () => of({}), removeFromCart: () => of({}),
          updateCartItem: () => of({})
        }},
        { provide: AUTH_SERVICE_TOKEN, useValue: {
          getCurrentUser: () => null, isAuthenticated: () => false,
          authState$: of({ isAuthenticated: false, user: null }),
          login: () => of({}), logout: () => of({}), register: () => of({})
        }},
        { provide: PRODUCT_SERVICE_TOKEN, useValue: {
          getProductById: () => of(null)
        }},
        Renderer2
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
