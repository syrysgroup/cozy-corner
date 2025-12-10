import * as XLSX from 'xlsx';
import { Language } from './i18n';

interface Listing {
  id: string;
  title_en: string;
  title_fr: string;
  listing_type: string;
  price: number;
  rent_frequency?: string | null;
  address_text: string;
  city: string;
  province: string;
  country: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  property_size?: number | null;
  lot_size?: number | null;
  unit_count?: number | null;
  description_en?: string | null;
  description_fr?: string | null;
  image_urls?: string[] | null;
  amenities?: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const EXPORT_HEADERS = {
  en: {
    id: 'ID',
    title_en: 'Title (EN)',
    title_fr: 'Title (FR)',
    listing_type: 'Listing Type',
    price: 'Price (CAD)',
    rent_frequency: 'Rent Frequency',
    address_text: 'Address',
    city: 'City',
    province: 'Province',
    country: 'Country',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    property_size: 'Property Size (sqft)',
    lot_size: 'Lot Size (sqft)',
    unit_count: 'Unit Count',
    description_en: 'Description (EN)',
    description_fr: 'Description (FR)',
    image_urls: 'Image URLs',
    amenities: 'Amenities',
    status: 'Status',
    created_at: 'Created At',
    updated_at: 'Updated At',
  },
  fr: {
    id: 'ID',
    title_en: 'Titre (EN)',
    title_fr: 'Titre (FR)',
    listing_type: 'Type d\'annonce',
    price: 'Prix (CAD)',
    rent_frequency: 'Fréquence de location',
    address_text: 'Adresse',
    city: 'Ville',
    province: 'Province',
    country: 'Pays',
    bedrooms: 'Chambres',
    bathrooms: 'Salles de bain',
    property_size: 'Superficie (pi²)',
    lot_size: 'Terrain (pi²)',
    unit_count: 'Nombre d\'unités',
    description_en: 'Description (EN)',
    description_fr: 'Description (FR)',
    image_urls: 'URLs des images',
    amenities: 'Commodités',
    status: 'Statut',
    created_at: 'Créé le',
    updated_at: 'Mis à jour le',
  }
};

const fieldOrder = [
  'id', 'title_en', 'title_fr', 'listing_type', 'price', 'rent_frequency',
  'address_text', 'city', 'province', 'country', 'bedrooms', 'bathrooms',
  'property_size', 'lot_size', 'unit_count', 'description_en', 'description_fr',
  'image_urls', 'amenities', 'status', 'created_at', 'updated_at'
];

export const exportListingsToCSV = (listings: Listing[], lang: Language = 'en') => {
  const headers = EXPORT_HEADERS[lang];
  const headerRow = fieldOrder.map(f => headers[f as keyof typeof headers]);
  
  const rows = listings.map(listing => 
    fieldOrder.map(field => {
      const value = listing[field as keyof Listing];
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      if (value === null || value === undefined) {
        return '';
      }
      return String(value);
    })
  );

  const csvContent = [
    headerRow.map(h => `"${h}"`).join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  const fileName = lang === 'fr' ? `annonces_export_${new Date().toISOString().split('T')[0]}.csv` : `listings_export_${new Date().toISOString().split('T')[0]}.csv`;
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportListingsToExcel = async (listings: Listing[], lang: Language = 'en') => {
  const workbook = XLSX.utils.book_new();
  const headers = EXPORT_HEADERS[lang];
  
  const headerRow = fieldOrder.map(f => headers[f as keyof typeof headers]);
  
  const rows = listings.map(listing => 
    fieldOrder.map(field => {
      const value = listing[field as keyof Listing];
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      if (value === null || value === undefined) {
        return '';
      }
      return value;
    })
  );

  const data = [headerRow, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  
  // Set column widths
  worksheet['!cols'] = fieldOrder.map(f => ({ wch: Math.max(f.length + 5, 15) }));
  
  XLSX.utils.book_append_sheet(workbook, worksheet, lang === 'fr' ? 'Annonces' : 'Listings');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  const fileName = lang === 'fr' ? `annonces_export_${new Date().toISOString().split('T')[0]}.xlsx` : `listings_export_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
