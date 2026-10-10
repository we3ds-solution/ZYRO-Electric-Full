import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-table',
  template: `
    <div class="overflow-x-auto">
      <table class="w-full text-sm border-collapse">
        <thead class="border-b-2 border-border bg-muted">
          <tr>
            @for (column of columns; track column) {
              <th
                class="text-left p-3 font-bold text-accent">
                {{ column }}
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of rows; track row) {
            <tr
              class="border-b border-border hover:bg-muted transition-colors">
              @for (column of columns; track column) {
                <td
                  class="p-3">
                  @if (row[column] | async; as data) {
                    {{ data }}
                  }
                  @if ((row[column] | async) === null || (row[column] | async) === undefined) {
                    {{ row[column] }}
                  }
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
    `,
  styles: []
})
export class UiTableComponent {
  @Input() columns: string[] = [];
  @Input() rows: Record<string, unknown>[] = [];
}
