export interface InvoiceItem {
  name: string;
  description?: string;
  hsnSac?: string;
  quantity: number;
  rate: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  transactionReference: string;
  paymentMethod: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount?: number;
  totalAmount: number;
  type: "subscription" | "order";
}

export function downloadTaxInvoice(data: InvoiceData) {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - ${data.invoiceNumber}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #18181b;
      background: #f4f4f5;
      padding: 40px 20px;
      font-size: 13px;
      line-height: 1.5;
    }
    .invoice-card {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e4e4e7;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
      padding: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #f4f4f5;
      padding-bottom: 24px;
      margin-bottom: 28px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-logo {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #4f46e5 0%, #f59e0b 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-weight: 900;
    }
    .brand-text h1 {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #09090b;
    }
    .brand-text p {
      font-size: 11px;
      color: #71717a;
      font-weight: 500;
    }
    .tax-badge {
      text-align: right;
    }
    .tax-badge .title {
      font-size: 20px;
      font-weight: 800;
      color: #4f46e5;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .tax-badge .original {
      font-size: 11px;
      color: #a1a1aa;
      font-weight: 600;
    }
    
    .grid-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 28px;
    }
    .info-box {
      background: #fafafa;
      border: 1px solid #f4f4f5;
      border-radius: 12px;
      padding: 16px;
    }
    .info-box h3 {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: #71717a;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .info-box p {
      font-size: 12px;
      color: #27272a;
      margin-bottom: 4px;
    }
    .info-box strong {
      color: #09090b;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      background: #f8fafc;
      color: #475569;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
      font-size: 12px;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }

    .summary-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 16px;
      padding-top: 16px;
    }
    .payment-badge {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #065f46;
      padding: 12px 16px;
      border-radius: 12px;
      max-width: 320px;
    }
    .payment-badge h4 {
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .payment-badge p {
      font-size: 11px;
      margin-top: 4px;
      color: #047857;
    }
    .totals-table {
      width: 280px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 12px;
      color: #64748b;
    }
    .totals-row.grand-total {
      border-top: 2px solid #e2e8f0;
      margin-top: 8px;
      padding-top: 8px;
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
    }

    .footer-stamp {
      margin-top: 36px;
      padding-top: 20px;
      border-top: 1px solid #e4e4e7;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 11px;
      color: #71717a;
    }
    .seal {
      text-align: right;
    }
    .seal-sign {
      font-family: cursive;
      font-size: 16px;
      color: #4f46e5;
      font-weight: bold;
    }
    .btn-print {
      display: inline-block;
      margin-bottom: 20px;
      background: #4f46e5;
      color: #ffffff;
      padding: 10px 20px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 700;
      font-size: 12px;
      border: none;
      cursor: pointer;
    }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .invoice-card {
        border: none;
        box-shadow: none;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div style="max-width: 800px; margin: 0 auto;" class="no-print">
    <button onclick="window.print()" class="btn-print">🖨️ Print / Save as PDF</button>
  </div>

  <div class="invoice-card">
    <div class="header">
      <div class="brand">
        <div class="brand-logo">C</div>
        <div class="brand-text">
          <h1>Criation.</h1>
          <p>Handcrafted Artisans & Dropshipping Platform</p>
          <p style="font-size: 10px; color: #a1a1aa; margin-top: 2px;">GSTIN: 07AAACC4123Q1ZP · CIN: U52100DL2024PTC123456</p>
        </div>
      </div>
      <div class="tax-badge">
        <div class="title">Tax Invoice</div>
        <div class="original">Original for Recipient</div>
        <p style="font-size: 12px; font-weight: 700; margin-top: 4px; color: #18181b;">#${data.invoiceNumber}</p>
      </div>
    </div>

    <div class="grid-info">
      <div class="info-box">
        <h3>Billed By (Seller / Cooperative)</h3>
        <p><strong>Criation Crafts India Pvt Ltd</strong></p>
        <p>Tower B, 7th Floor, Innovation Tech Park</p>
        <p>Golf Course Extension Road, Gurugram, Haryana - 122002</p>
        <p>Support: care@criation.example | +91 (800) 456-7890</p>
      </div>

      <div class="info-box">
        <h3>Billed To (Customer Details)</h3>
        <p><strong>${data.customer.name}</strong></p>
        <p>${data.customer.email || "Registered Account"}</p>
        <p>${data.customer.phone || "+91 XXXXX XXXXX"}</p>
        <p>${data.customer.address || "Digital Online Delivery · India"}</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; background: #f8fafc; padding: 12px 16px; border-radius: 10px; font-size: 11px;">
      <div>
        <span style="color: #64748b; display: block;">Invoice Date</span>
        <strong>${data.invoiceDate}</strong>
      </div>
      <div>
        <span style="color: #64748b; display: block;">Txn Reference</span>
        <strong style="font-family: monospace;">${data.transactionReference}</strong>
      </div>
      <div>
        <span style="color: #64748b; display: block;">Payment Mode</span>
        <strong style="text-transform: uppercase;">${data.paymentMethod}</strong>
      </div>
      <div>
        <span style="color: #64748b; display: block;">Place of Supply</span>
        <strong>Haryana (06)</strong>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Item Description</th>
          <th class="text-center">SAC / HSN</th>
          <th class="text-center">Qty</th>
          <th class="text-right">Unit Rate</th>
          <th class="text-right">Tax (18%)</th>
          <th class="text-right">Amount (INR)</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map((item, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td>
              <strong>${item.name}</strong>
              ${item.description ? `<br><span style="font-size: 10px; color: #64748b;">${item.description}</span>` : ""}
            </td>
            <td class="text-center font-mono">${item.hsnSac || "998313"}</td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-right font-mono">₹${item.rate.toLocaleString("en-IN")}</td>
            <td class="text-right font-mono">₹${(item.cgst + item.sgst).toLocaleString("en-IN")}</td>
            <td class="text-right font-mono"><strong>₹${item.total.toLocaleString("en-IN")}</strong></td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="summary-section">
      <div class="payment-badge">
        <h4>✅ Payment Verified & Completed</h4>
        <p>Paid via ${data.paymentMethod.toUpperCase()} (Ref: ${data.transactionReference}). 256-bit encrypted transaction with 100% money-back guarantee.</p>
      </div>

      <div class="totals-table">
        <div class="totals-row">
          <span>Taxable Subtotal:</span>
          <span style="font-family: monospace;">₹${data.subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div class="totals-row">
          <span>CGST (9%):</span>
          <span style="font-family: monospace;">₹${Math.round(data.tax / 2).toLocaleString("en-IN")}</span>
        </div>
        <div class="totals-row">
          <span>SGST (9%):</span>
          <span style="font-family: monospace;">₹${Math.round(data.tax / 2).toLocaleString("en-IN")}</span>
        </div>
        ${data.discount ? `
        <div class="totals-row" style="color: #10b981;">
          <span>Discount / Savings:</span>
          <span style="font-family: monospace;">-₹${data.discount.toLocaleString("en-IN")}</span>
        </div>` : ""}
        <div class="totals-row grand-total">
          <span>Total Paid:</span>
          <span style="color: #4f46e5; font-family: monospace;">₹${data.totalAmount.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>

    <div class="footer-stamp">
      <div>
        <p>This is a computer-generated tax invoice verified by Criation E-Commerce Gateway.</p>
        <p>Subject to Gurugram, Haryana Jurisdiction · Terms of Service apply.</p>
      </div>
      <div class="seal">
        <div class="seal-sign">Criation Auth Signature</div>
        <p><strong>Authorized Signatory</strong></p>
      </div>
    </div>
  </div>
</body>
</html>`;

  // Create downloadable file blob
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  // 1. Trigger File Download
  const link = document.createElement("a");
  link.href = url;
  link.download = `Criation_Tax_Invoice_${data.invoiceNumber}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // 2. Open printable invoice in new tab
  const printWindow = window.open(url, "_blank");
  if (printWindow) {
    printWindow.focus();
  }
}
