import { Component } from '@angular/core';
import { COOKIE_TYPES, CookieType } from './data';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss']
})
export class CookiesComponent {
  cookieTypes: CookieType[] = COOKIE_TYPES;
}
