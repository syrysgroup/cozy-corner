// PDF Guide Generator for Bulk Upload Documentation
// Uses jsPDF-compatible format for client-side PDF generation

export interface GuideSection {
  title: string;
  content: string[];
}

export const bulkUploadGuideContent: GuideSection[] = [
  {
    title: 'MULTILISTING BULK UPLOAD GUIDE',
    content: [
      'Complete Documentation for Importing Multiple Listings',
      '',
      'Version 1.0 | Last Updated: December 2024',
    ],
  },
  {
    title: '1. GETTING STARTED',
    content: [
      'The bulk upload feature allows you to import multiple property listings at once using CSV or Excel files.',
      '',
      'Who can use bulk upload:',
      '• Landlords',
      '• Real Estate Agents',
      '• Business Managers',
      '• Students (for shared housing)',
      '• Administrators',
      '',
      'System Requirements:',
      '• File format: CSV (.csv) or Excel (.xlsx)',
      '• Maximum file size: 10 MB',
      '• Maximum rows per file: 1,000 listings',
      '• Daily import limit: 10 imports per user',
    ],
  },
  {
    title: '2. TEMPLATE FIELDS REFERENCE',
    content: [
      'REQUIRED FIELDS (must be filled for every listing):',
      '',
      'title_en - English listing title (max 200 characters)',
      'title_fr - French listing title (max 200 characters)',
      'listing_type - Type of listing: sale, rent, student, shared, co_ownership, auction, or ppp',
      'price - Price in CAD (numbers only, no symbols)',
      'address_text - Street address (max 500 characters)',
      'city - City name (max 100 characters)',
      'province - Two-letter province code (ON, QC, BC, AB, MB, SK, NS, NB, NL, PE, NT, YT, NU)',
      '',
      'OPTIONAL FIELDS:',
      '',
      'description_en - English description (detailed property info)',
      'description_fr - French description',
      'bedrooms - Number of bedrooms (0-99)',
      'bathrooms - Number of bathrooms (0-99)',
      'property_size - Size in square feet',
      'lot_size - Lot size in square feet',
      'rent_frequency - For rentals: monthly, weekly, or yearly',
      'image_urls - Comma-separated list of image URLs',
      'amenities - Comma-separated list (e.g., "parking,pool,gym")',
    ],
  },
  {
    title: '3. IMAGE URL REQUIREMENTS',
    content: [
      'Images are optional but highly recommended for better listing visibility.',
      '',
      'Format:',
      '• Separate multiple URLs with commas (no spaces)',
      '• Example: https://example.com/img1.jpg,https://example.com/img2.jpg',
      '',
      'Requirements:',
      '• Must start with http:// or https://',
      '• Supported formats: .jpg, .jpeg, .png, .gif, .webp',
      '• Images must be publicly accessible (no login required)',
      '• Maximum 20 images per listing',
      '• Recommended image size: 1200x800 pixels or larger',
      '',
      'Tips for hosting images:',
      '• Use cloud storage services (Google Drive with public links, Dropbox, etc.)',
      '• Ensure links are direct image URLs, not page URLs',
      '• Test each URL in a browser to verify accessibility',
    ],
  },
  {
    title: '4. STEP-BY-STEP IMPORT PROCESS',
    content: [
      'Step 1: Download Template',
      '• Click "Download CSV Template" or "Download Excel Template"',
      '• Excel template includes instructions and valid values sheets',
      '',
      'Step 2: Fill In Your Data',
      '• Delete the example rows',
      '• Enter your listing information',
      '• Save the file (keep CSV or XLSX format)',
      '',
      'Step 3: Upload File',
      '• Drag and drop your file onto the upload area, or click to browse',
      '• Wait for validation to complete',
      '',
      'Step 4: Review Preview',
      '• Check the validation results',
      '• Fix any errors and re-upload if needed',
      '• Warnings can be ignored but should be reviewed',
      '',
      'Step 5: Confirm Import',
      '• Choose whether to import as drafts (recommended)',
      '• Click "Import" to create your listings',
      '• Monitor progress in real-time',
    ],
  },
  {
    title: '5. VALIDATION STATUS EXPLAINED',
    content: [
      'Valid (Green checkmark):',
      '• Row passes all validation checks',
      '• Will be imported successfully',
      '',
      'Warning (Yellow triangle):',
      '• Minor issues detected but not critical',
      '• Examples: missing optional fields, unusual values',
      '• Row will still be imported',
      '',
      'Error (Red X):',
      '• Critical issues prevent import',
      '• Examples: missing required fields, invalid data formats',
      '• Row will be skipped - fix and re-upload',
    ],
  },
  {
    title: '6. COMMON ERRORS AND SOLUTIONS',
    content: [
      'ERROR: "Missing required field: title_en"',
      'Solution: Ensure every row has an English title filled in',
      '',
      'ERROR: "Invalid listing_type"',
      'Solution: Use only: sale, rent, student, shared, co_ownership, auction, ppp',
      '',
      'ERROR: "Price must be a number"',
      'Solution: Remove currency symbols and commas (use 250000, not $250,000)',
      '',
      'ERROR: "Invalid province code"',
      'Solution: Use 2-letter codes (ON, QC, BC, etc.)',
      '',
      'ERROR: "Invalid image URL format"',
      'Solution: Ensure URLs start with http:// or https:// and end with image extension',
      '',
      'ERROR: "Row limit exceeded"',
      'Solution: Split your file into multiple files with under 1,000 rows each',
    ],
  },
  {
    title: '7. AFTER IMPORT',
    content: [
      'Reviewing Imported Listings:',
      '• Go to Dashboard > My Properties to see all your listings',
      '• Draft listings are visible only to you until published',
      '• Edit individual listings to add more details or fix issues',
      '',
      'Publishing Listings:',
      '• Open each listing and change status from "draft" to "published"',
      '• Published listings appear in search results immediately',
      '',
      'Handling Failed Rows:',
      '• Check Import History for details on failed imports',
      '• Use the Retry feature to attempt importing failed rows again',
      '• Export error report to see specific issues per row',
    ],
  },
  {
    title: '8. BEST PRACTICES',
    content: [
      '• Start with a small test import (5-10 listings) before large batches',
      '• Use the Excel template for built-in instructions and validation hints',
      '• Import as drafts first, then review before publishing',
      '• Keep a backup of your original file',
      '• Use consistent formatting for addresses and descriptions',
      '• Include high-quality images for better listing performance',
      '• Review geocoding results - some addresses may need manual adjustment',
    ],
  },
  {
    title: '9. CONTACT & SUPPORT',
    content: [
      'If you encounter issues not covered in this guide:',
      '',
      '• Use the in-app Help button for quick reference',
      '• Check the FAQ section in the Bulk Upload page',
      '• Contact support through your dashboard',
      '',
      'For technical issues:',
      '• Note the exact error message',
      '• Save your import file for troubleshooting',
      '• Check your import history for detailed logs',
    ],
  },
];

export const generatePDFContent = (): string => {
  let content = '';
  
  bulkUploadGuideContent.forEach((section, index) => {
    if (index === 0) {
      content += `${'='.repeat(60)}\n`;
      content += `${section.title}\n`;
      content += `${'='.repeat(60)}\n\n`;
    } else {
      content += `\n${'-'.repeat(40)}\n`;
      content += `${section.title}\n`;
      content += `${'-'.repeat(40)}\n\n`;
    }
    
    section.content.forEach(line => {
      content += `${line}\n`;
    });
  });
  
  return content;
};

export const downloadTextGuide = () => {
  const content = generatePDFContent();
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'multilisting-bulk-upload-guide.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate HTML content that can be printed as PDF
export const downloadHTMLGuide = () => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Multilisting Bulk Upload Guide</title>
  <style>
    @media print {
      body { margin: 0; padding: 20px; }
      .page-break { page-break-after: always; }
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1 {
      color: #1a365d;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }
    h2 {
      color: #1e40af;
      margin-top: 40px;
      border-left: 4px solid #2563eb;
      padding-left: 15px;
    }
    .subtitle {
      color: #64748b;
      font-size: 1.1em;
      margin-bottom: 40px;
    }
    ul, ol {
      margin: 15px 0;
    }
    li {
      margin: 8px 0;
    }
    code {
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Consolas', monospace;
      font-size: 0.9em;
    }
    .field-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .field-table th, .field-table td {
      border: 1px solid #e2e8f0;
      padding: 10px;
      text-align: left;
    }
    .field-table th {
      background: #f8fafc;
      font-weight: 600;
    }
    .required { color: #dc2626; }
    .optional { color: #059669; }
    .tip {
      background: #eff6ff;
      border-left: 4px solid #2563eb;
      padding: 15px;
      margin: 20px 0;
    }
    .warning {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
    }
    .error-box {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 15px;
      margin: 15px 0;
    }
    .error-box strong {
      color: #dc2626;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      color: #64748b;
      font-size: 0.9em;
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>Multilisting Bulk Upload Guide</h1>
  <p class="subtitle">Complete Documentation for Importing Multiple Listings<br>Version 1.0 | December 2024</p>

  <h2>1. Getting Started</h2>
  <p>The bulk upload feature allows you to import multiple property listings at once using CSV or Excel files.</p>
  
  <h3>Who Can Use Bulk Upload</h3>
  <ul>
    <li>Landlords</li>
    <li>Real Estate Agents</li>
    <li>Business Managers</li>
    <li>Students (for shared housing)</li>
    <li>Administrators</li>
  </ul>

  <h3>System Requirements</h3>
  <table class="field-table">
    <tr><th>Requirement</th><th>Limit</th></tr>
    <tr><td>File Format</td><td>CSV (.csv) or Excel (.xlsx)</td></tr>
    <tr><td>Maximum File Size</td><td>10 MB</td></tr>
    <tr><td>Maximum Rows</td><td>1,000 listings per file</td></tr>
    <tr><td>Daily Import Limit</td><td>10 imports per user</td></tr>
  </table>

  <h2>2. Template Fields Reference</h2>
  
  <h3>Required Fields</h3>
  <table class="field-table">
    <tr><th>Field</th><th>Description</th><th>Example</th></tr>
    <tr><td><code>title_en</code></td><td>English title (max 200 chars)</td><td>Beautiful 3BR Apartment</td></tr>
    <tr><td><code>title_fr</code></td><td>French title (max 200 chars)</td><td>Bel appartement 3 chambres</td></tr>
    <tr><td><code>listing_type</code></td><td>Type of listing</td><td>sale, rent, student, shared</td></tr>
    <tr><td><code>price</code></td><td>Price in CAD (numbers only)</td><td>250000</td></tr>
    <tr><td><code>address_text</code></td><td>Street address</td><td>123 Main Street</td></tr>
    <tr><td><code>city</code></td><td>City name</td><td>Toronto</td></tr>
    <tr><td><code>province</code></td><td>2-letter province code</td><td>ON, QC, BC, AB</td></tr>
  </table>

  <h3>Optional Fields</h3>
  <table class="field-table">
    <tr><th>Field</th><th>Description</th></tr>
    <tr><td><code>description_en</code></td><td>English property description</td></tr>
    <tr><td><code>description_fr</code></td><td>French property description</td></tr>
    <tr><td><code>bedrooms</code></td><td>Number of bedrooms (0-99)</td></tr>
    <tr><td><code>bathrooms</code></td><td>Number of bathrooms (0-99)</td></tr>
    <tr><td><code>property_size</code></td><td>Size in square feet</td></tr>
    <tr><td><code>rent_frequency</code></td><td>monthly, weekly, or yearly</td></tr>
    <tr><td><code>image_urls</code></td><td>Comma-separated image URLs</td></tr>
    <tr><td><code>amenities</code></td><td>Comma-separated list</td></tr>
  </table>

  <h2>3. Image URL Requirements</h2>
  <div class="tip">
    <strong>Tip:</strong> Include high-quality images to improve your listing visibility and engagement.
  </div>
  <ul>
    <li>Separate multiple URLs with commas (no spaces)</li>
    <li>Must start with <code>http://</code> or <code>https://</code></li>
    <li>Supported formats: .jpg, .jpeg, .png, .gif, .webp</li>
    <li>Images must be publicly accessible</li>
    <li>Maximum 20 images per listing</li>
  </ul>

  <h2>4. Step-by-Step Import Process</h2>
  <ol>
    <li><strong>Download Template:</strong> Choose CSV or Excel format</li>
    <li><strong>Fill In Data:</strong> Delete examples, add your listings</li>
    <li><strong>Upload File:</strong> Drag and drop or click to browse</li>
    <li><strong>Review Preview:</strong> Check validation results</li>
    <li><strong>Confirm Import:</strong> Click Import to create listings</li>
  </ol>

  <h2>5. Common Errors and Solutions</h2>
  
  <div class="error-box">
    <strong>ERROR:</strong> "Missing required field: title_en"<br>
    <em>Solution:</em> Ensure every row has an English title
  </div>
  
  <div class="error-box">
    <strong>ERROR:</strong> "Invalid listing_type"<br>
    <em>Solution:</em> Use only: sale, rent, student, shared, co_ownership, auction, ppp
  </div>
  
  <div class="error-box">
    <strong>ERROR:</strong> "Price must be a number"<br>
    <em>Solution:</em> Remove currency symbols and commas (use 250000, not $250,000)
  </div>

  <h2>6. Best Practices</h2>
  <ul>
    <li>Start with a small test import (5-10 listings)</li>
    <li>Use Excel template for built-in instructions</li>
    <li>Import as drafts first, then review before publishing</li>
    <li>Keep a backup of your original file</li>
    <li>Include high-quality images</li>
  </ul>

  <div class="footer">
    <p>Multilisting Platform | Bulk Upload Documentation<br>
    For support, contact us through your dashboard</p>
  </div>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  // Open in new tab for printing as PDF
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
  
  // Also offer direct download
  const link = document.createElement('a');
  link.href = url;
  link.download = 'multilisting-bulk-upload-guide.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
