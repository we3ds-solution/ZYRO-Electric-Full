import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { AllProductsComponent } from './products/components/all-products/all-products.component';
import { ProductsDetailsComponent } from './products/components/products-details/products-details.component';
import { CartComponent } from './carts/components/cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { TrackingComponent } from './orders/components/tracking/tracking.component';
import { UiNotFoundComponent } from './shared/ui/components/not-found/not-found.component';
import { AboutComponent } from './pages/about/about.component';
import { HelpComponent } from './pages/help/help.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CareersComponent } from './pages/careers/careers.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { CookiesComponent } from './pages/cookies/cookies.component';
import { ReturnsComponent } from './pages/returns/returns.component';
import { ShippingComponent } from './pages/shipping/shipping.component';
import { FAQComponent } from './pages/faq/faq.component';
import { BlogComponent } from './pages/blog/blog.component';
import { PressComponent } from './pages/press/press.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'products',
    component: AllProductsComponent
  },
  {
    path: 'details/:id',
    component: ProductsDetailsComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders/tracking/:id',
    component: TrackingComponent,
    canActivate: [AuthGuard]
  },
  // Footer Pages
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'help',
    component: HelpComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'careers',
    component: CareersComponent
  },
  // Policy & Info Pages
  {
    path: 'privacy',
    component: PrivacyComponent
  },
  {
    path: 'terms',
    component: TermsComponent
  },
  {
    path: 'cookies',
    component: CookiesComponent
  },
  {
    path: 'returns',
    component: ReturnsComponent
  },
  {
    path: 'shipping',
    component: ShippingComponent
  },
  {
    path: 'faq',
    component: FAQComponent
  },
  {
    path: 'blog',
    component: BlogComponent
  },
  {
    path: 'press',
    component: PressComponent
  },
  {
    path: 'branches',
    loadChildren: () => import('./pages/branches/branches.module').then(m => m.BranchesModule)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '404',
    component: UiNotFoundComponent
  },
  {
    path: '**',
    component: UiNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    useHash: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
