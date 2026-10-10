import { Injectable, inject } from '@angular/core';
import { PrintService } from '../../shared/services/print.service';
import { Order } from '../models';

/**
 * Generates invoice HTML for orders.
 * Uses centralized print service and template.
 */
@Injectable({
  providedIn: 'root'
})
export class InvoiceGeneratorService {
  private printService = inject(PrintService);

  /**
   * Generates and prints an invoice for the given order.
   */
  generateInvoice(order: Order): void {
    const html = this.buildInvoiceHTML(order);
    const title = `Invoice-${order.id}`;
    
    // Use inline styles for print window (external CSS doesn't always load in print)
    this.printService.printWithInlineStyles(html, title);
  }

  /**
   * Builds the invoice HTML from order data.
   * Includes inline dark theme styles that work in print.
   */
  private buildInvoiceHTML(order: Order): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice-${order.id}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body {
            font-family: 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            padding: 40px;
            background: #0A0A0A !important;
            color: #FAFAFA !important;
            line-height: 1.6;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .print-document {
            max-width: 800px;
            margin: 0 auto;
            background: #0A0A0A !important;
            padding: 40px;
            border-radius: 8px;
          }
          
          .print-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #E8C547 !important;
          }
          
          .print-logo {
            font-size: 28px;
            font-weight: 900;
            color: #E8C547 !important;
            letter-spacing: 0.5px;
          }
          
          .print-title {
            font-size: 24px;
            font-weight: 700;
            color: #FAFAFA !important;
            text-align: right;
          }
          
          .print-subtitle {
            font-size: 14px;
            color: #888 !important;
            margin-top: 4px;
          }
          
          .print-section {
            margin-bottom: 30px;
          }
          
          .print-section-title {
            font-size: 16px;
            font-weight: 700;
            color: #E8C547 !important;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .print-info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 20px;
          }
          
          .print-info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          
          .print-label {
            font-size: 12px;
            color: #888 !important;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .print-value {
            font-size: 14px;
            color: #FAFAFA !important;
            font-weight: 600;
          }
          
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            background: #1A1A1A !important;
          }
          
          .print-table thead {
            background: #1A1A1A !important;
          }
          
          .print-table th {
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: 700;
            color: #E8C547 !important;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #E8C547 !important;
            background: #1A1A1A !important;
          }
          
          .print-table td {
            padding: 12px;
            font-size: 14px;
            color: #FAFAFA !important;
            border-bottom: 1px solid #2A2A2A !important;
            background: #1A1A1A !important;
          }
          
          .print-summary {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-left: auto;
            max-width: 300px;
            padding: 20px;
            background: #1A1A1A !important;
            border-radius: 8px;
            border: 1px solid #2A2A2A !important;
          }
          
          .print-summary-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
          }
          
          .print-summary-label {
            color: #888 !important;
          }
          
          .print-summary-value {
            color: #FAFAFA !important;
            font-weight: 600;
          }
          
          .print-summary-total {
            padding-top: 12px;
            margin-top: 12px;
            border-top: 2px solid #E8C547 !important;
            font-size: 18px;
            font-weight: 700;
          }
          
          .print-summary-total .print-summary-value {
            color: #E8C547 !important;
          }
          
          .print-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #2A2A2A !important;
            text-align: center;
            font-size: 12px;
            color: #666 !important;
          }
          
          /* Print-specific styles */
          @media print {
            body {
              background: #0A0A0A !important;
              color: #FAFAFA !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .print-document {
              background: #0A0A0A !important;
            }
            
            @page {
              size: A4 portrait;
              margin: 1cm;
              background: #0A0A0A;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-document">
          ${this.buildHeader(order)}
          ${this.buildOrderInfo(order)}
          ${this.buildShippingAddress(order)}
          ${this.buildItemsTable(order)}
          ${this.buildSummary(order)}
          ${this.buildFooter()}
        </div>
      </body>
      </html>
    `;
  }

  private buildHeader(order: Order): string {
    return `
      <div class="print-header">
        <div>
          <div class="print-logo">Haxel</div>
          <div class="print-subtitle">Performance Activewear</div>
        </div>
        <div>
          <div class="print-title">INVOICE</div>
          <div class="print-subtitle">${order.id}</div>
        </div>
      </div>
    `;
  }

  private buildOrderInfo(order: Order): string {
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <div class="print-section">
        <div class="print-section-title">Order Information</div>
        <div class="print-info-grid">
          <div class="print-info-item">
            <span class="print-label">Order ID</span>
            <span class="print-value">${order.id}</span>
          </div>
          <div class="print-info-item">
            <span class="print-label">Order Date</span>
            <span class="print-value">${orderDate}</span>
          </div>
          <div class="print-info-item">
            <span class="print-label">Status</span>
            <span class="print-value">${order.status}</span>
          </div>
          <div class="print-info-item">
            <span class="print-label">Payment Method</span>
            <span class="print-value">${order.paymentMethod}</span>
          </div>
        </div>
      </div>
    `;
  }

  private buildShippingAddress(order: Order): string {
    return `
      <div class="print-section">
        <div class="print-section-title">Shipping Address</div>
        <div class="print-value">
          ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
          ${order.shippingAddress.street}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
          ${order.shippingAddress.country}<br>
          ${order.shippingAddress.phone}
        </div>
      </div>
    `;
  }

  private buildItemsTable(order: Order): string {
    const itemsRows = order.items
      .map(item => `
        <tr>
          <td>${item.title}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">$${item.price.toFixed(2)}</td>
          <td style="text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `)
      .join('');

    return `
      <div class="print-section">
        <div class="print-section-title">Order Items</div>
        <table class="print-table">
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align: center;">Quantity</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>
      </div>
    `;
  }

  private buildSummary(order: Order): string {
    const discount = order.discount || 0;
    
    return `
      <div class="print-summary">
        <div class="print-summary-row">
          <span class="print-summary-label">Subtotal</span>
          <span class="print-summary-value">$${order.subtotal.toFixed(2)}</span>
        </div>
        <div class="print-summary-row">
          <span class="print-summary-label">Shipping</span>
          <span class="print-summary-value">$${order.shipping.toFixed(2)}</span>
        </div>
        ${discount > 0 ? `
        <div class="print-summary-row">
          <span class="print-summary-label">Discount</span>
          <span class="print-summary-value" style="color: #10b981;">-$${discount.toFixed(2)}</span>
        </div>
        ` : ''}
        <div class="print-summary-row print-summary-total">
          <span class="print-summary-label">Total</span>
          <span class="print-summary-value">$${order.total.toFixed(2)}</span>
        </div>
      </div>
    `;
  }

  private buildFooter(): string {
    return `
      <div class="print-footer">
        <p>Thank you for shopping Haxel — proudly 100% local!</p>
        <p>Haxel • support@haxel.me • www.haxel.me • Sun-Thu 9am-6pm</p>
        <p>Free shipping over 3 items • Easy exchange & returns</p>
      </div>
    `;
  }
}
