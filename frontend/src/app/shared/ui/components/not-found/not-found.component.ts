import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ui-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class UiNotFoundComponent {
  private router = inject(Router);

  message = 'Sorry, the page you are looking for does not exist or has been moved.';
  errorCode = '404_NOT_FOUND';
  timestamp = new Date().toLocaleString();

  goHome(): void {
    this.router.navigate(['/']);
  }

  goProducts(): void {
    this.router.navigate(['/products']);
  }
}
