import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BulkUploadPreview } from '@/components/BulkUploadPreview';
import { ImportHistory } from '@/components/ImportHistory';
import { BulkUploadHelpModal } from '@/components/BulkUploadHelpModal';
import { ImportProgressTracker } from '@/components/ImportProgressTracker';
import { downloadCSVTemplate, downloadExcelTemplate } from '@/lib/templateGenerator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Download, FileSpreadsheet, Loader2, AlertTriangle, Clock, FileWarning } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_ROWS = 1000;

export default function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [parsedDataId, setParsedDataId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [publishAsDraft, setPublishAsDraft] = useState(true);
  const [importInProgress, setImportInProgress] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [uploadError, setUploadError] = useState<{ type: string; message: string } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadError(null);
    
    if (acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0];
      
      // Client-side file type validation
      if (!uploadedFile.name.endsWith('.csv') && !uploadedFile.name.endsWith('.xlsx')) {
        setUploadError({
          type: 'FILE_TYPE',
          message: 'Invalid file type. Please upload CSV (.csv) or Excel (.xlsx) files only.'
        });
        return;
      }
      
      // Client-side file size validation
      if (uploadedFile.size > MAX_FILE_SIZE) {
        setUploadError({
          type: 'FILE_SIZE',
          message: `File size (${(uploadedFile.size / 1024 / 1024).toFixed(2)}MB) exceeds the 10MB limit. Please use a smaller file.`
        });
        return;
      }
      
      setFile(uploadedFile);
      setPreview(null);
      setParsedDataId(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const handleParseFile = async () => {
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to upload files');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `https://jwmvnsyvtprtheawgsan.supabase.co/functions/v1/parse-bulk-listings`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error types
        if (response.status === 429) {
          setUploadError({
            type: 'RATE_LIMIT',
            message: result.error || 'Rate limit exceeded. Maximum 10 imports per day.'
          });
          return;
        }
        if (response.status === 403) {
          setUploadError({
            type: 'PERMISSION',
            message: result.error || 'You do not have permission to use bulk upload.'
          });
          return;
        }
        if (result.code === 'ROW_LIMIT_EXCEEDED') {
          setUploadError({
            type: 'ROW_LIMIT',
            message: result.error || `File has too many rows. Maximum ${MAX_ROWS} rows allowed.`
          });
          return;
        }
        throw new Error(result.error || 'Failed to parse file');
      }

      setPreview(result.preview);
      setParsedDataId(result.parsed_data_id);
      setTotalRows(result.preview?.total || 0);
      toast.success('File parsed successfully!');
    } catch (error: any) {
      console.error('Error parsing file:', error);
      toast.error(error.message || 'Failed to parse file');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmImport = async (skipWarnings: boolean) => {
    if (!parsedDataId) return;

    setProcessing(true);
    setImportInProgress(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to import listings');
        return;
      }

      const response = await fetch(
        `https://jwmvnsyvtprtheawgsan.supabase.co/functions/v1/process-bulk-import`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parsed_data_id: parsedDataId,
            publish_as_draft: publishAsDraft,
            skip_warnings: skipWarnings,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process import');
      }

      const result = await response.json();
      toast.success(`Successfully imported ${result.results.success_count} listings!`);
      
      // Reset state
      setFile(null);
      setPreview(null);
      setParsedDataId(null);
      setImportInProgress(false);
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      console.error('Error processing import:', error);
      toast.error(error.message || 'Failed to process import');
      setImportInProgress(false);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
    setParsedDataId(null);
    setImportInProgress(false);
    setUploadError(null);
  };

  const handleImportComplete = () => {
    setImportInProgress(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Bulk Upload Listings</h1>
          <p className="text-muted-foreground mt-2">
            Upload multiple listings at once using CSV or Excel files
          </p>
        </div>

        {/* Step 1: Download Template */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Step 1: Download Template</h2>
            <BulkUploadHelpModal />
          </div>
          <p className="text-muted-foreground mb-4">
            Start by downloading a template file with example data and field descriptions.
            The Excel template includes instructions and valid values on separate sheets.
          </p>
          <div className="flex gap-4">
            <Button onClick={downloadCSVTemplate} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download CSV Template
            </Button>
            <Button onClick={downloadExcelTemplate} variant="outline">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Download Excel Template
            </Button>
          </div>
        </Card>

        {/* Step 2: Upload File */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Step 2: Upload File</h2>
          
          {/* Error Alert */}
          {uploadError && (
            <Alert variant="destructive" className="mb-4">
              {uploadError.type === 'RATE_LIMIT' && <Clock className="h-4 w-4" />}
              {uploadError.type === 'FILE_SIZE' && <FileWarning className="h-4 w-4" />}
              {uploadError.type === 'FILE_TYPE' && <FileWarning className="h-4 w-4" />}
              {uploadError.type === 'PERMISSION' && <AlertTriangle className="h-4 w-4" />}
              {uploadError.type === 'ROW_LIMIT' && <FileWarning className="h-4 w-4" />}
              <AlertTitle>
                {uploadError.type === 'RATE_LIMIT' && 'Rate Limit Exceeded'}
                {uploadError.type === 'FILE_SIZE' && 'File Too Large'}
                {uploadError.type === 'FILE_TYPE' && 'Invalid File Type'}
                {uploadError.type === 'PERMISSION' && 'Permission Denied'}
                {uploadError.type === 'ROW_LIMIT' && 'Too Many Rows'}
              </AlertTitle>
              <AlertDescription>{uploadError.message}</AlertDescription>
            </Alert>
          )}
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : uploadError 
                  ? 'border-destructive/50 bg-destructive/5'
                  : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {file ? (
              <div>
                <p className="text-lg font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium">
                  {isDragActive
                    ? 'Drop the file here'
                    : 'Drag and drop a file here, or click to select'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Accepts CSV and XLSX files (max 10MB, 1000 rows)
                </p>
              </div>
            )}
          </div>
          
          {/* File Limits Info */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileWarning className="h-3 w-3" />
              Max file size: 10MB
            </span>
            <span className="flex items-center gap-1">
              <FileWarning className="h-3 w-3" />
              Max rows: 1000
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Daily limit: 10 imports
            </span>
          </div>
          
          {file && !preview && !uploadError && (
            <Button
              onClick={handleParseFile}
              disabled={uploading}
              className="mt-4 w-full"
              size="lg"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                'Validate & Preview'
              )}
            </Button>
          )}
        </Card>

        {/* Step 3: Preview & Confirm */}
        {preview && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Step 3: Preview & Confirm</h2>
            
            {/* Progress Tracker */}
            {importInProgress && parsedDataId && (
              <div className="mb-4">
                <ImportProgressTracker
                  importLogId={parsedDataId}
                  totalRows={totalRows}
                  onComplete={handleImportComplete}
                />
              </div>
            )}

            {!importInProgress && (
              <>
                <div className="mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={publishAsDraft}
                      onChange={(e) => setPublishAsDraft(e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm">Import as drafts (recommended)</span>
                  </label>
                </div>
                <BulkUploadPreview
                  preview={preview}
                  onConfirm={handleConfirmImport}
                  onCancel={handleCancel}
                  processing={processing}
                />
              </>
            )}
          </Card>
        )}

        {/* Import History */}
        <ImportHistory key={refreshKey} />
      </div>
    </DashboardLayout>
  );
}
