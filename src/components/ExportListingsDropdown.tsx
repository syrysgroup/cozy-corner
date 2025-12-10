import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { exportListingsToCSV, exportListingsToExcel } from '@/lib/listingExporter';
import { toast } from 'sonner';

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

interface ExportListingsDropdownProps {
  listings: Listing[];
  selectedIds?: string[];
  lang?: 'en' | 'fr';
}

export function ExportListingsDropdown({ listings, selectedIds, lang = 'en' }: ExportListingsDropdownProps) {
  const [exporting, setExporting] = useState(false);

  const getListingsToExport = () => {
    if (selectedIds && selectedIds.length > 0) {
      return listings.filter(l => selectedIds.includes(l.id));
    }
    return listings;
  };

  const handleExportCSV = () => {
    const toExport = getListingsToExport();
    if (toExport.length === 0) {
      toast.error('No listings to export');
      return;
    }
    setExporting(true);
    try {
      exportListingsToCSV(toExport, lang);
      toast.success(`Exported ${toExport.length} listings to CSV`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export listings');
    } finally {
      setExporting(false);
    }
  };

  const handleExportExcel = async () => {
    const toExport = getListingsToExport();
    if (toExport.length === 0) {
      toast.error('No listings to export');
      return;
    }
    setExporting(true);
    try {
      await exportListingsToExcel(toExport, lang);
      toast.success(`Exported ${toExport.length} listings to Excel`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export listings');
    } finally {
      setExporting(false);
    }
  };

  const count = selectedIds && selectedIds.length > 0 ? selectedIds.length : listings.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={exporting || listings.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          {exporting ? 'Exporting...' : `Export${count > 0 ? ` (${count})` : ''}`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileText className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
