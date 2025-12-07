import * as XLSX from 'xlsx';

// Field documentation for templates
const FIELD_DOCUMENTATION = {
  title_en: 'English title (required, max 200 chars)',
  title_fr: 'French title (required, max 200 chars)',
  listing_type: 'Type: sale, rent, student, commercial (required)',
  price: 'Price in CAD, numeric only (required)',
  rent_frequency: 'For rentals: monthly, weekly, yearly (leave empty for sales)',
  address_text: 'Street address (required)',
  city: 'City name (required)',
  province: 'Province code: ON, QC, BC, AB, etc. (required)',
  bedrooms: 'Number of bedrooms (optional)',
  bathrooms: 'Number of bathrooms, can be decimal e.g. 1.5 (optional)',
  property_size: 'Property size in sqft (optional)',
  lot_size: 'Lot size in sqft (optional)',
  unit_count: 'Number of units for multi-unit properties (optional)',
  description_en: 'English description (optional)',
  description_fr: 'French description (optional)',
  image_urls: 'Comma-separated URLs, e.g. https://example.com/img1.jpg,https://example.com/img2.jpg (optional)',
  amenities: 'Comma-separated amenities, e.g. parking,balcony,gym (optional)',
  status: 'draft or published (defaults to draft)',
};

// Valid values for dropdown fields
const VALID_VALUES = {
  listing_type: ['sale', 'rent', 'student', 'commercial'],
  rent_frequency: ['monthly', 'weekly', 'yearly', ''],
  province: ['ON', 'QC', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'NT', 'YT', 'NU'],
  status: ['draft', 'published'],
  amenities_common: [
    'parking', 'balcony', 'gym', 'pool', 'laundry', 'dishwasher', 'ac', 'heating',
    'internet', 'furnished', 'pet_friendly', 'wheelchair_accessible', 'elevator',
    'security', 'concierge', 'storage', 'bike_storage', 'rooftop_access'
  ],
};

const headers = [
  'title_en',
  'title_fr',
  'listing_type',
  'price',
  'rent_frequency',
  'address_text',
  'city',
  'province',
  'bedrooms',
  'bathrooms',
  'property_size',
  'lot_size',
  'unit_count',
  'description_en',
  'description_fr',
  'image_urls',
  'amenities',
  'status'
];

const exampleRows = [
  {
    title_en: 'Beautiful Downtown Condo',
    title_fr: 'Magnifique Condo au Centre-Ville',
    listing_type: 'sale',
    price: '450000',
    rent_frequency: '',
    address_text: '123 Main Street',
    city: 'Toronto',
    province: 'ON',
    bedrooms: '2',
    bathrooms: '2',
    property_size: '1200',
    lot_size: '',
    unit_count: '1',
    description_en: 'Spacious condo with modern finishes and stunning city views. Recently renovated kitchen and bathroom.',
    description_fr: 'Condo spacieux avec finitions modernes et vues imprenables sur la ville. Cuisine et salle de bain récemment rénovées.',
    image_urls: 'https://example.com/condo1.jpg,https://example.com/condo2.jpg',
    amenities: 'parking,balcony,gym,concierge',
    status: 'draft'
  },
  {
    title_en: 'Charming Student Apartment Near McGill',
    title_fr: 'Charmant Appartement Étudiant Près de McGill',
    listing_type: 'student',
    price: '1200',
    rent_frequency: 'monthly',
    address_text: '456 University Ave',
    city: 'Montreal',
    province: 'QC',
    bedrooms: '3',
    bathrooms: '1',
    property_size: '900',
    lot_size: '',
    unit_count: '1',
    description_en: 'Perfect for students, walking distance to campus. All utilities included.',
    description_fr: 'Parfait pour étudiants, à distance de marche du campus. Tous les services inclus.',
    image_urls: '',
    amenities: 'internet,laundry,furnished',
    status: 'draft'
  },
  {
    title_en: 'Modern Family Home with Pool',
    title_fr: 'Maison Familiale Moderne avec Piscine',
    listing_type: 'sale',
    price: '895000',
    rent_frequency: '',
    address_text: '789 Maple Drive',
    city: 'Vancouver',
    province: 'BC',
    bedrooms: '4',
    bathrooms: '3.5',
    property_size: '2800',
    lot_size: '6500',
    unit_count: '1',
    description_en: 'Stunning family home with heated pool, gourmet kitchen, and mountain views.',
    description_fr: 'Magnifique maison familiale avec piscine chauffée, cuisine gastronomique et vue sur les montagnes.',
    image_urls: 'https://example.com/house1.jpg,https://example.com/house2.jpg,https://example.com/house3.jpg',
    amenities: 'pool,parking,ac,security',
    status: 'draft'
  },
  {
    title_en: 'Prime Commercial Space Downtown',
    title_fr: 'Espace Commercial de Premier Choix au Centre-Ville',
    listing_type: 'commercial',
    price: '5500',
    rent_frequency: 'monthly',
    address_text: '100 Business Blvd',
    city: 'Calgary',
    province: 'AB',
    bedrooms: '',
    bathrooms: '2',
    property_size: '3000',
    lot_size: '',
    unit_count: '1',
    description_en: 'High-visibility retail space in busy downtown area. Triple net lease available.',
    description_fr: 'Espace commercial très visible dans un quartier animé du centre-ville. Bail triple net disponible.',
    image_urls: '',
    amenities: 'parking,wheelchair_accessible,elevator',
    status: 'draft'
  },
  {
    title_en: 'Cozy Rental Apartment',
    title_fr: 'Appartement Locatif Confortable',
    listing_type: 'rent',
    price: '1800',
    rent_frequency: 'monthly',
    address_text: '222 Oak Street',
    city: 'Ottawa',
    province: 'ON',
    bedrooms: '1',
    bathrooms: '1',
    property_size: '650',
    lot_size: '',
    unit_count: '1',
    description_en: 'Bright one-bedroom in quiet neighborhood. Close to transit and shopping.',
    description_fr: 'Lumineux une chambre dans un quartier tranquille. Proche des transports et commerces.',
    image_urls: 'https://example.com/apt1.jpg',
    amenities: 'laundry,heating,pet_friendly',
    status: 'draft'
  }
];

export const generateCSVTemplate = () => {
  // Add comment row explaining fields
  const commentRow = headers.map(h => FIELD_DOCUMENTATION[h as keyof typeof FIELD_DOCUMENTATION]);
  
  const csvContent = [
    headers.join(','),
    commentRow.map(cell => `"${cell}"`).join(','),
    ...exampleRows.map(row => 
      headers.map(h => `"${row[h as keyof typeof row] || ''}"`).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  return blob;
};

export const downloadCSVTemplate = () => {
  const blob = generateCSVTemplate();
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'listing_import_template.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateExcelTemplate = async (): Promise<Blob> => {
  const workbook = XLSX.utils.book_new();
  
  // Sheet 1: Data Template
  const dataSheet = XLSX.utils.aoa_to_sheet([
    headers,
    ...exampleRows.map(row => headers.map(h => row[h as keyof typeof row] || ''))
  ]);
  
  // Set column widths
  dataSheet['!cols'] = headers.map(h => ({ wch: Math.max(h.length, 15) }));
  
  XLSX.utils.book_append_sheet(workbook, dataSheet, 'Listings');
  
  // Sheet 2: Instructions
  const instructionsData = [
    ['Bulk Listing Import - Instructions'],
    [''],
    ['REQUIRED FIELDS:'],
    ['- title_en: English title for the listing'],
    ['- title_fr: French title for the listing'],
    ['- listing_type: Must be one of: sale, rent, student, commercial'],
    ['- price: Numeric value in CAD (no commas or currency symbols)'],
    ['- address_text: Street address'],
    ['- city: City name'],
    ['- province: Two-letter province code (ON, QC, BC, AB, etc.)'],
    [''],
    ['OPTIONAL FIELDS:'],
    ['- rent_frequency: For rentals only - monthly, weekly, or yearly'],
    ['- bedrooms: Number of bedrooms (whole number)'],
    ['- bathrooms: Number of bathrooms (can be decimal, e.g., 1.5)'],
    ['- property_size: Size in square feet'],
    ['- lot_size: Lot size in square feet'],
    ['- unit_count: Number of units (for multi-unit properties)'],
    ['- description_en: English description'],
    ['- description_fr: French description'],
    ['- image_urls: Comma-separated image URLs (must be publicly accessible)'],
    ['- amenities: Comma-separated list of amenities'],
    ['- status: "draft" or "published" (defaults to draft)'],
    [''],
    ['IMAGE URLS:'],
    ['- Must start with http:// or https://'],
    ['- Supported formats: .jpg, .jpeg, .png, .gif, .webp'],
    ['- Multiple images separated by commas'],
    ['- Example: https://example.com/img1.jpg,https://example.com/img2.jpg'],
    [''],
    ['TIPS:'],
    ['- Delete the example rows before importing'],
    ['- Maximum 1000 rows per import'],
    ['- Maximum file size: 10MB'],
    ['- Addresses will be automatically geocoded if valid'],
    ['- Invalid rows will be skipped with error messages'],
  ];
  
  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsData);
  instructionsSheet['!cols'] = [{ wch: 80 }];
  XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');
  
  // Sheet 3: Valid Values
  const maxLength = Math.max(
    VALID_VALUES.listing_type.length,
    VALID_VALUES.province.length,
    VALID_VALUES.amenities_common.length
  );
  
  const validValuesData = [
    ['Listing Types', 'Provinces', 'Rent Frequency', 'Common Amenities'],
    ...Array.from({ length: maxLength }, (_, i) => [
      VALID_VALUES.listing_type[i] || '',
      VALID_VALUES.province[i] || '',
      VALID_VALUES.rent_frequency[i] || '',
      VALID_VALUES.amenities_common[i] || '',
    ])
  ];
  
  const validValuesSheet = XLSX.utils.aoa_to_sheet(validValuesData);
  validValuesSheet['!cols'] = [{ wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(workbook, validValuesSheet, 'Valid Values');
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  return blob;
};

export const downloadExcelTemplate = async () => {
  const blob = await generateExcelTemplate();
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'listing_import_template.xlsx');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
