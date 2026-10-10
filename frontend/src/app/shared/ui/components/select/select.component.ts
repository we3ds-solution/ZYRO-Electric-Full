import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {
  @Input() title = ''
  @Input() data: unknown[] = []
  @Output() selectedValue = new EventEmitter<unknown>()

  detectChanges(event: unknown) {
    this.selectedValue.emit(event)
  }
}

