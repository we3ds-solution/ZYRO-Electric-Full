import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

const AUTH_COMPONENTS = [
  LoginComponent,
  RegisterComponent
];

const AUTH_SERVICES = [
  AuthService,
  AuthGuard
];

@NgModule({
  declarations: [...AUTH_COMPONENTS],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [
    ...AUTH_SERVICES,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AuthModule { }
