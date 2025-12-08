import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle, Info } from 'lucide-react';
import { ReactNode } from 'react';

interface BulkUploadTooltipProps {
  content: string | ReactNode;
  children?: ReactNode;
  variant?: 'help' | 'info';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const BulkUploadTooltip = ({ 
  content, 
  children, 
  variant = 'help',
  side = 'top' 
}: BulkUploadTooltipProps) => {
  const Icon = variant === 'help' ? HelpCircle : Info;
  
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <button 
              type="button" 
              className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon className="h-4 w-4" />
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          {typeof content === 'string' ? (
            <p className="text-sm">{content}</p>
          ) : (
            content
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Pre-defined tooltips for common elements
export const tooltips = {
  templateDownload: 'Download a pre-formatted file with example data and all required columns. The Excel template includes an instructions sheet.',
  csvVsExcel: 'CSV is simpler but Excel includes multiple sheets with instructions and valid values for reference.',
  fileUpload: 'Drag and drop your file here or click to browse. We accept CSV (.csv) and Excel (.xlsx) files up to 10MB.',
  maxRows: 'Each file can contain up to 1,000 listing rows. For larger imports, split into multiple files.',
  dailyLimit: 'You can perform up to 10 imports per day. This limit resets at midnight UTC.',
  fileSize: 'Maximum file size is 10MB. If your file is larger, try removing unnecessary columns or splitting into multiple files.',
  draftMode: 'Draft listings are only visible to you. This allows you to review and edit before making them public.',
  validStatus: 'This row passed all validation checks and will be imported successfully.',
  warningStatus: 'Minor issues detected but the row can still be imported. Review the warnings to ensure data quality.',
  errorStatus: 'Critical issues prevent this row from being imported. Fix the errors and re-upload.',
  geocoding: 'We automatically convert addresses to map coordinates. If geocoding fails, the listing is still created but won\'t appear on maps.',
  imageUrls: 'Add publicly accessible image URLs separated by commas. Supported formats: JPG, PNG, GIF, WEBP.',
  retryImport: 'Retry previously failed rows with corrected data without re-uploading the entire file.',
  importProgress: 'Real-time progress showing how many listings have been processed, geocoded, and any errors encountered.',
};
