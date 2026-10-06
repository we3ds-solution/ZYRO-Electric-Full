import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CART_SERVICE_TOKEN, AUTH_SERVICE_TOKEN, PRODUCT_SERVICE_TOKEN } from './shared/interfaces/dependency-injection';
import { of } from 'rxjs';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent
      ],
      providers: [
        { provide: CART_SERVICE_TOKEN, useValue: {
          cartItemCount$: of(0), cartItems$: of([]), cartTotal$: of(0),
          addToCart: () => of({}), removeFromCart: () => of({}),
          updateCartItem: () => of({}), clearCart: () => of({})
        }},
        { provide: AUTH_SERVICE_TOKEN, useValue: {
          getCurrentUser: () => null, isAuthenticated: () => false,
          authState$: of({ isAuthenticated: false, user: null }),
          login: () => of({}), logout: () => of({}), register: () => of({})
        }},
        { provide: PRODUCT_SERVICE_TOKEN, useValue: {
          getProductById: () => of({}), getProducts: () => of({ items: [], total: 0, page: 1, pages: 1 })
        }}
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'market'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('market');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
  });
});
