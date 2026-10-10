import { Component } from '@angular/core';
import { PRESS_RELEASES, MEDIA_CONTACTS, PressRelease, MediaContact } from './data';

@Component({
  selector: 'app-press',
  templateUrl: './press.component.html',
  styleUrls: ['./press.component.scss']
})
export class PressComponent {
  pressReleases: PressRelease[] = PRESS_RELEASES;
  mediaContacts: MediaContact[] = MEDIA_CONTACTS;
}
