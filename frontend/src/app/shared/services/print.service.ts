import { Injectable } from '@angular/core';

/**
 * Centralized print service for all print operations in the app.
 * Handles opening print dialogs, loading print styles, and cleaning up.
 */
@Injectable({
  providedIn: 'root'
})
export class PrintService {

  /**
   * Opens a print dialog with the provided HTML content.
   * Automatically loads print-specific styles and cleans up after printing.
   * 
   * @param content - HTML string to print
   * @param title - Document title for the print window
   * @param styleUrls - Optional array of CSS file paths to load
   */
  print(content: string, title = 'Print', styleUrls: string[] = []): void {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!printWindow) {
      console.error('Print window blocked. Please allow popups.');
      return;
    }

    // Build style links
    const styleLinks = styleUrls
      .map(url => `<link rel="stylesheet" href="${url}">`)
      .join('\n    ');

    // Inject content into print window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        ${styleLinks}
      </head>
      <body>
        ${content}
      </body>
      </html>
    `);
    
    printWindow.document.close();

    // Wait for styles and images to load before printing
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        
        // Close window after print dialog closes (user can cancel)
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 250);
    };
  }

  /**
   * Prints content with inline styles (no external CSS files).
   * Useful for quick prints or when styles are embedded in the HTML.
   */
  printWithInlineStyles(content: string, title = 'Print'): void {
    this.print(content, title, []);
  }
}
