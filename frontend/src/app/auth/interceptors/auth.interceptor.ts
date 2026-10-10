import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private router = inject(Router);


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Add auth token to requests
    const token = this.authService.getAuthToken();
    if (token && !request.url.includes('/auth/')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized
        if (error.status === 401) {
          this.authService.logout().subscribe(() => {
            this.router.navigate(['/auth/login']);
          });
        }

        // Handle 403 Forbidden
        if (error.status === 403) {
          this.router.navigate(['/403']);
        }

        return throwError(() => error);
      })
    );
  }
}
