export const generateCSVTemplate = () => {
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
    [
      'Beautiful Downtown Condo',
      'Magnifique Condo au Centre-Ville',
      'sale',
      '450000',
      '',
      '123 Main St',
      'Toronto',
      'ON',
      '2',
      '2',
      '1200',
      '',
      '1',
      'Spacious condo with modern finishes',
      'Condo spacieux avec finitions modernes',
      'https://example.com/img1.jpg,https://example.com/img2.jpg',
      'parking,balcony,gym',
      'draft'
    ],
    [
      'Charming Student Apartment',
      'Charmant Appartement Étudiant',
      'student',
      '1200',
      'monthly',
      '456 University Ave',
      'Montreal',
      'QC',
      '3',
      '1',
      '900',
      '',
      '1',
      'Perfect for students near campus',
      'Parfait pour étudiants près du campus',
      '',
      'internet,laundry,furnished',
      'draft'
    ]
  ];

  const csvContent = [
    headers.join(','),
    ...exampleRows.map(row => row.map(cell => `"${cell}"`).join(','))
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

export const generateExcelTemplate = async () => {
  // For now, we'll just use CSV format
  // In a production app, you could use a library like xlsx to create proper Excel files
  return generateCSVTemplate();
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