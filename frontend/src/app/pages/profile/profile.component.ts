import { Component, OnInit, inject } from '@angular/core';
import { UserProfile } from '../../auth/models';
import { Order } from '../../orders/models';
import { AUTH_SERVICE_TOKEN, ORDER_SERVICE_TOKEN } from '../../shared/interfaces/dependency-injection';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // DIP: Inject via tokens (abstraction), not concrete classes
  private authService = inject(AUTH_SERVICE_TOKEN);
  private orderService = inject(ORDER_SERVICE_TOKEN);

  userProfile: UserProfile | null = null;
  orders: Order[] = [];
  isLoading = true;

  ngOnInit(): void {
    console.log('[ProfileComponent] Initializing profile page');
    
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        console.log('[ProfileComponent] User profile loaded:', profile);
        this.userProfile = profile;
      },
      error: (err) => {
        console.error('[ProfileComponent] Failed to load user profile:', err);
        this.isLoading = false;
      }
    });

    this.orderService.getOrders(1, 50).subscribe({
      next: (page) => {
        console.log('[ProfileComponent] Orders loaded:', page);
        this.orders = page.items;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[ProfileComponent] Failed to load orders:', err);
        this.isLoading = false;
      }
    });
  }
}
