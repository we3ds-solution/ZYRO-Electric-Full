import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiModule } from './ui/ui.module';
import { ProfileDropdownComponent } from './ui/components/profile-dropdown/profile-dropdown.component';

// DIP: Import all injection tokens
import {
  PRODUCT_SERVICE_TOKEN,
  CART_SERVICE_TOKEN,
  AUTH_SERVICE_TOKEN,
  ORDER_SERVICE_TOKEN,
  NOTIFICATION_SERVICE_TOKEN,
  CALCULATION_SERVICE_TOKEN,
  PERSISTENCE_SERVICE_TOKEN,
  FILTER_STRATEGY_TOKEN,
  SORT_STRATEGY_TOKEN,
  PRODUCT_REPOSITORY_TOKEN,
  CART_REPOSITORY_TOKEN,
  ORDER_REPOSITORY_TOKEN
} from './interfaces/dependency-injection';

// Domain Services
import { ProductsService } from '../products/services/products.service';
import { CartsService } from '../carts/services/carts.service';
import { AuthService } from '../auth/services/auth.service';
import { OrderService } from '../orders/services/order.service';

// Infrastructure Services
import { NotificationService } from './services/notification.service';
import { CalculationService } from './services/calculation.service';
import { PersistenceService } from './services/persistence.service';
import { FilterStrategyService } from './services/filter-strategy.service';
import { SortStrategyService } from './services/sort-strategy.service';

// Caching Services
import { CacheService } from './services/cache.service';
import { StorageService } from './services/storage.service';
import { CookieService } from './services/cookie.service';
import { SessionService } from './services/session.service';

// Interceptors
import { CacheInterceptor } from './interceptors/cache.interceptor';

// DIP: Configure all service providers using injection tokens
const DIP_PROVIDERS: Provider[] = [
  // Domain Services
  { provide: PRODUCT_SERVICE_TOKEN, useClass: ProductsService },
  { provide: CART_SERVICE_TOKEN, useClass: CartsService },
  { provide: AUTH_SERVICE_TOKEN, useClass: AuthService },
  { provide: ORDER_SERVICE_TOKEN, useClass: OrderService },
  
  // Infrastructure Services
  { provide: NOTIFICATION_SERVICE_TOKEN, useClass: NotificationService },
  { provide: CALCULATION_SERVICE_TOKEN, useClass: CalculationService },
  { provide: PERSISTENCE_SERVICE_TOKEN, useClass: PersistenceService },
  
  // Strategy Services
  { provide: FILTER_STRATEGY_TOKEN, useClass: FilterStrategyService },
  { provide: SORT_STRATEGY_TOKEN, useClass: SortStrategyService },
  
  // Repository Implementations
  { provide: PRODUCT_REPOSITORY_TOKEN, useClass: ProductsService },
  { provide: CART_REPOSITORY_TOKEN, useClass: CartsService },
  { provide: ORDER_REPOSITORY_TOKEN, useClass: OrderService },
  
  // Caching Services (singleton scope)
  CacheService,
  StorageService,
  CookieService,
  SessionService,
  
  // HTTP Interceptors
  { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
];

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    UiModule,
    ProfileDropdownComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    UiModule
  ],
  providers: DIP_PROVIDERS,
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class SharedModule { }
