import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CartsModule } from './carts/carts.module';
import { ProductsModule } from './products/products.module';
import { SharedModule } from './shared/shared.module';
import { CheckoutModule } from './checkout/checkout.module';
import { OrdersModule } from './orders/orders.module';
import { HomeModule } from './home/home.module';
import { AuthInterceptor } from './auth/interceptors/auth.interceptor';
import { AboutModule } from './pages/about/about.module';
import { HelpModule } from './pages/help/help.module';
import { ContactModule } from './pages/contact/contact.module';
import { CareersModule } from './pages/careers/careers.module';
import { PrivacyModule } from './pages/privacy/privacy.module';
import { TermsModule } from './pages/terms/terms.module';
import { CookiesModule } from './pages/cookies/cookies.module';
import { ReturnsModule } from './pages/returns/returns.module';
import { ShippingModule } from './pages/shipping/shipping.module';
import { FAQModule } from './pages/faq/faq.module';
import { BlogModule } from './pages/blog/blog.module';
import { PressModule } from './pages/press/press.module';
import { SessionTimeoutWarningComponent } from './shared/components/session-timeout-warning/session-timeout-warning.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ProductsModule,
    CartsModule,
    CheckoutModule,
    OrdersModule,
    HomeModule,
    AboutModule,
    HelpModule,
    ContactModule,
    CareersModule,
    PrivacyModule,
    TermsModule,
    CookiesModule,
    ReturnsModule,
    ShippingModule,
    FAQModule,
    BlogModule,
    PressModule,
    SharedModule,
    SessionTimeoutWarningComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
