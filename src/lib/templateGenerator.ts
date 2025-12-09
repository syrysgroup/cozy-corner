import * as XLSX from 'xlsx';
import { Language } from './i18n';

// Bilingual field documentation
const FIELD_DOCUMENTATION = {
  en: {
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
    image_urls: 'Comma-separated URLs (optional)',
    amenities: 'Comma-separated amenities, e.g. parking,balcony,gym (optional)',
    status: 'draft or published (defaults to draft)',
  },
  fr: {
    title_en: 'Titre anglais (requis, max 200 caractères)',
    title_fr: 'Titre français (requis, max 200 caractères)',
    listing_type: 'Type: sale, rent, student, commercial (requis)',
    price: 'Prix en CAD, numérique seulement (requis)',
    rent_frequency: 'Pour locations: monthly, weekly, yearly (vide pour ventes)',
    address_text: 'Adresse de rue (requis)',
    city: 'Nom de la ville (requis)',
    province: 'Code de province: ON, QC, BC, AB, etc. (requis)',
    bedrooms: 'Nombre de chambres (optionnel)',
    bathrooms: 'Nombre de salles de bain, peut être décimal ex. 1.5 (optionnel)',
    property_size: 'Superficie en pieds carrés (optionnel)',
    lot_size: 'Taille du terrain en pieds carrés (optionnel)',
    unit_count: 'Nombre d\'unités pour propriétés multi-unités (optionnel)',
    description_en: 'Description anglaise (optionnel)',
    description_fr: 'Description française (optionnel)',
    image_urls: 'URLs séparées par virgules (optionnel)',
    amenities: 'Commodités séparées par virgules, ex. parking,balcony,gym (optionnel)',
    status: 'draft ou published (draft par défaut)',
  }
};

// Bilingual instructions
const INSTRUCTIONS = {
  en: {
    title: 'Bulk Listing Import - Instructions',
    requiredFields: 'REQUIRED FIELDS:',
    optionalFields: 'OPTIONAL FIELDS:',
    imageUrls: 'IMAGE URLS:',
    tips: 'TIPS:',
    required: [
      '- title_en: English title for the listing',
      '- title_fr: French title for the listing',
      '- listing_type: Must be one of: sale, rent, student, commercial',
      '- price: Numeric value in CAD (no commas or currency symbols)',
      '- address_text: Street address',
      '- city: City name',
      '- province: Two-letter province code (ON, QC, BC, AB, etc.)',
    ],
    optional: [
      '- rent_frequency: For rentals only - monthly, weekly, or yearly',
      '- bedrooms: Number of bedrooms (whole number)',
      '- bathrooms: Number of bathrooms (can be decimal, e.g., 1.5)',
      '- property_size: Size in square feet',
      '- lot_size: Lot size in square feet',
      '- unit_count: Number of units (for multi-unit properties)',
      '- description_en: English description',
      '- description_fr: French description',
      '- image_urls: Comma-separated image URLs (must be publicly accessible)',
      '- amenities: Comma-separated list of amenities',
      '- status: "draft" or "published" (defaults to draft)',
    ],
    imageUrlTips: [
      '- Must start with http:// or https://',
      '- Supported formats: .jpg, .jpeg, .png, .gif, .webp',
      '- Multiple images separated by commas',
      '- Example: https://example.com/img1.jpg,https://example.com/img2.jpg',
    ],
    tipsList: [
      '- Delete the example rows before importing',
      '- Maximum 1000 rows per import',
      '- Maximum file size: 10MB',
      '- Addresses will be automatically geocoded if valid',
      '- Invalid rows will be skipped with error messages',
    ],
    sheetNames: {
      listings: 'Listings',
      instructions: 'Instructions',
      validValues: 'Valid Values',
    },
    validValuesHeaders: ['Listing Types', 'Provinces', 'Rent Frequency', 'Common Amenities'],
  },
  fr: {
    title: 'Importation en Lot - Instructions',
    requiredFields: 'CHAMPS OBLIGATOIRES:',
    optionalFields: 'CHAMPS OPTIONNELS:',
    imageUrls: 'URLS D\'IMAGES:',
    tips: 'CONSEILS:',
    required: [
      '- title_en: Titre anglais de l\'annonce',
      '- title_fr: Titre français de l\'annonce',
      '- listing_type: Doit être: sale, rent, student, commercial',
      '- price: Valeur numérique en CAD (sans virgules ni symboles)',
      '- address_text: Adresse de rue',
      '- city: Nom de la ville',
      '- province: Code de province à deux lettres (ON, QC, BC, AB, etc.)',
    ],
    optional: [
      '- rent_frequency: Pour locations seulement - monthly, weekly ou yearly',
      '- bedrooms: Nombre de chambres (nombre entier)',
      '- bathrooms: Nombre de salles de bain (peut être décimal, ex. 1.5)',
      '- property_size: Superficie en pieds carrés',
      '- lot_size: Taille du terrain en pieds carrés',
      '- unit_count: Nombre d\'unités (pour propriétés multi-unités)',
      '- description_en: Description anglaise',
      '- description_fr: Description française',
      '- image_urls: URLs d\'images séparées par virgules (doivent être accessibles)',
      '- amenities: Liste de commodités séparées par virgules',
      '- status: "draft" ou "published" (draft par défaut)',
    ],
    imageUrlTips: [
      '- Doit commencer par http:// ou https://',
      '- Formats supportés: .jpg, .jpeg, .png, .gif, .webp',
      '- Images multiples séparées par virgules',
      '- Exemple: https://exemple.com/img1.jpg,https://exemple.com/img2.jpg',
    ],
    tipsList: [
      '- Supprimez les lignes d\'exemple avant l\'importation',
      '- Maximum 1000 lignes par importation',
      '- Taille de fichier maximum: 10MB',
      '- Les adresses seront géocodées automatiquement si valides',
      '- Les lignes invalides seront ignorées avec messages d\'erreur',
    ],
    sheetNames: {
      listings: 'Annonces',
      instructions: 'Instructions',
      validValues: 'Valeurs Valides',
    },
    validValuesHeaders: ['Types d\'Annonces', 'Provinces', 'Fréquence de Location', 'Commodités Courantes'],
  }
};

// Valid values (same for both languages - these are system values)
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
    description_en: 'Spacious condo with modern finishes and stunning city views.',
    description_fr: 'Condo spacieux avec finitions modernes et vues sur la ville.',
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
    description_en: 'Perfect for students, walking distance to campus.',
    description_fr: 'Parfait pour étudiants, à distance de marche du campus.',
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
    description_en: 'Stunning family home with heated pool and mountain views.',
    description_fr: 'Maison familiale avec piscine chauffée et vue sur les montagnes.',
    image_urls: 'https://example.com/house1.jpg',
    amenities: 'pool,parking,ac,security',
    status: 'draft'
  },
];

export const generateCSVTemplate = (lang: Language = 'en') => {
  const docs = FIELD_DOCUMENTATION[lang];
  const commentRow = headers.map(h => docs[h as keyof typeof docs]);
  
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

export const downloadCSVTemplate = (lang: Language = 'en') => {
  const blob = generateCSVTemplate(lang);
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  const fileName = lang === 'fr' ? 'modele_importation_annonces.csv' : 'listing_import_template.csv';
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateExcelTemplate = async (lang: Language = 'en'): Promise<Blob> => {
  const workbook = XLSX.utils.book_new();
  const instructions = INSTRUCTIONS[lang];
  
  // Sheet 1: Data Template
  const dataSheet = XLSX.utils.aoa_to_sheet([
    headers,
    ...exampleRows.map(row => headers.map(h => row[h as keyof typeof row] || ''))
  ]);
  
  // Set column widths
  dataSheet['!cols'] = headers.map(h => ({ wch: Math.max(h.length, 15) }));
  
  XLSX.utils.book_append_sheet(workbook, dataSheet, instructions.sheetNames.listings);
  
  // Sheet 2: Instructions
  const instructionsData = [
    [instructions.title],
    [''],
    [instructions.requiredFields],
    ...instructions.required.map(r => [r]),
    [''],
    [instructions.optionalFields],
    ...instructions.optional.map(o => [o]),
    [''],
    [instructions.imageUrls],
    ...instructions.imageUrlTips.map(t => [t]),
    [''],
    [instructions.tips],
    ...instructions.tipsList.map(t => [t]),
  ];
  
  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsData);
  instructionsSheet['!cols'] = [{ wch: 80 }];
  XLSX.utils.book_append_sheet(workbook, instructionsSheet, instructions.sheetNames.instructions);
  
  // Sheet 3: Valid Values
  const maxLength = Math.max(
    VALID_VALUES.listing_type.length,
    VALID_VALUES.province.length,
    VALID_VALUES.amenities_common.length
  );
  
  const validValuesData = [
    instructions.validValuesHeaders,
    ...Array.from({ length: maxLength }, (_, i) => [
      VALID_VALUES.listing_type[i] || '',
      VALID_VALUES.province[i] || '',
      VALID_VALUES.rent_frequency[i] || '',
      VALID_VALUES.amenities_common[i] || '',
    ])
  ];
  
  const validValuesSheet = XLSX.utils.aoa_to_sheet(validValuesData);
  validValuesSheet['!cols'] = [{ wch: 18 }, { wch: 12 }, { wch: 20 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(workbook, validValuesSheet, instructions.sheetNames.validValues);
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  return blob;
};

export const downloadExcelTemplate = async (lang: Language = 'en') => {
  const blob = await generateExcelTemplate(lang);
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  const fileName = lang === 'fr' ? 'modele_importation_annonces.xlsx' : 'listing_import_template.xlsx';
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
