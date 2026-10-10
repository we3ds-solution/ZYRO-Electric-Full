import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    
    if (isAuthenticated) {
      return true;
    }

    console.warn(`[AuthGuard] Access denied. Not authenticated. Redirecting to login.`, {
      requestedUrl: state.url,
      isAuthenticated
    });
    
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
