import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { BulkUploadPreview } from '@/components/BulkUploadPreview';
import { ImportHistory } from '@/components/ImportHistory';
import { BulkUploadHelpModal } from '@/components/BulkUploadHelpModal';
import { ImportProgressTracker } from '@/components/ImportProgressTracker';
import { BulkUploadTooltip, tooltips } from '@/components/BulkUploadTooltip';
import { downloadCSVTemplate, downloadExcelTemplate } from '@/lib/templateGenerator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  Loader2, 
  AlertTriangle, 
  Clock, 
  FileWarning, 
  CheckCircle2,
  FileText,
  Eye,
  Sparkles
} from 'lucide-react';
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

  // Determine current step
  const currentStep = preview ? 3 : file ? 2 : 1;

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header with gradient accent */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Bulk Upload Listings</h1>
                <p className="text-muted-foreground mt-2 max-w-xl">
                  Import multiple property listings at once using CSV or Excel files. 
                  Perfect for agents and landlords with large portfolios.
                </p>
              </div>
              <BulkUploadHelpModal />
            </div>
            
            {/* Step Indicator */}
            <div className="flex items-center gap-2 mt-6">
              {[
                { num: 1, label: 'Template', icon: Download },
                { num: 2, label: 'Upload', icon: Upload },
                { num: 3, label: 'Review', icon: Eye },
              ].map((step, idx) => (
                <div key={step.num} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    currentStep >= step.num 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > step.num ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">{step.label}</span>
                    <span className="sm:hidden">{step.num}</span>
                  </div>
                  {idx < 2 && (
                    <div className={`w-8 h-0.5 mx-1 ${
                      currentStep > step.num ? 'bg-primary' : 'bg-border'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 1: Download Template */}
        <Card className={`p-6 transition-all duration-300 ${currentStep === 1 ? 'ring-2 ring-primary/20 shadow-lg' : ''}`}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold">Download Template</h2>
                <BulkUploadTooltip content={tooltips.templateDownload} />
                {currentStep > 1 && (
                  <Badge variant="secondary" className="bg-success-soft text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Get a pre-formatted file with all required columns and example data.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={downloadCSVTemplate} variant="outline" size="sm" className="gap-2">
                  <FileText className="h-4 w-4" />
                  CSV Template
                </Button>
                <Button onClick={downloadExcelTemplate} variant="outline" size="sm" className="gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                  Excel Template
                  <Badge variant="secondary" className="ml-1 text-xs">Recommended</Badge>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Step 2: Upload File */}
        <Card className={`p-6 transition-all duration-300 ${currentStep === 2 ? 'ring-2 ring-primary/20 shadow-lg' : ''}`}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold">Upload Your File</h2>
                <BulkUploadTooltip content={tooltips.fileUpload} />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your completed file or click to browse.
              </p>
              
              {/* Error Alert */}
              {uploadError && (
                <Alert variant="destructive" className="mb-4">
                  {uploadError.type === 'RATE_LIMIT' && <Clock className="h-4 w-4" />}
                  {uploadError.type === 'FILE_SIZE' && <FileWarning className="h-4 w-4" />}
                  {uploadError.type === 'FILE_TYPE' && <FileWarning className="h-4 w-4" />}
                  {uploadError.type === 'PERMISSION' && <AlertTriangle className="h-4 w-4" />}
                  {uploadError.type === 'ROW_LIMIT' && <FileWarning className="h-4 w-4" />}
                  <AlertTitle className="font-medium">
                    {uploadError.type === 'RATE_LIMIT' && 'Rate Limit Exceeded'}
                    {uploadError.type === 'FILE_SIZE' && 'File Too Large'}
                    {uploadError.type === 'FILE_TYPE' && 'Invalid File Type'}
                    {uploadError.type === 'PERMISSION' && 'Permission Denied'}
                    {uploadError.type === 'ROW_LIMIT' && 'Too Many Rows'}
                  </AlertTitle>
                  <AlertDescription>{uploadError.message}</AlertDescription>
                </Alert>
              )}
              
              {/* Upload Zone */}
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragActive
                    ? 'border-primary bg-upload-active shadow-upload'
                    : uploadError 
                      ? 'border-destructive/50 bg-error-soft'
                      : file
                        ? 'border-primary/50 bg-success-soft'
                        : 'border-upload-border bg-upload-zone hover:border-primary/50 hover:bg-upload-active'
                }`}
              >
                <input {...getInputProps()} />
                
                {file ? (
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileSpreadsheet className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB • Ready to validate
                      </p>
                    </div>
                    <CheckCircle2 className="h-6 w-6 text-green-600 ml-2" />
                  </div>
                ) : (
                  <div>
                    <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                      <Upload className={`h-8 w-8 transition-transform duration-200 ${isDragActive ? 'scale-110 text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <p className="text-base font-medium text-foreground">
                      {isDragActive ? 'Drop your file here' : 'Drag and drop your file here'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or <span className="text-primary font-medium">browse</span> to select
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" /> CSV, XLSX
                      </span>
                      <span>•</span>
                      <span>Max 10MB</span>
                      <span>•</span>
                      <span>Max 1,000 rows</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Limits with tooltips */}
              <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
                <BulkUploadTooltip content={tooltips.fileSize} side="bottom">
                  <span className="flex items-center gap-1.5 cursor-help hover:text-foreground transition-colors">
                    <FileWarning className="h-3.5 w-3.5" />
                    10MB limit
                  </span>
                </BulkUploadTooltip>
                <BulkUploadTooltip content={tooltips.maxRows} side="bottom">
                  <span className="flex items-center gap-1.5 cursor-help hover:text-foreground transition-colors">
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    1,000 rows max
                  </span>
                </BulkUploadTooltip>
                <BulkUploadTooltip content={tooltips.dailyLimit} side="bottom">
                  <span className="flex items-center gap-1.5 cursor-help hover:text-foreground transition-colors">
                    <Clock className="h-3.5 w-3.5" />
                    10 imports/day
                  </span>
                </BulkUploadTooltip>
              </div>
              
              {file && !preview && !uploadError && (
                <Button
                  onClick={handleParseFile}
                  disabled={uploading}
                  className="mt-4 w-full gap-2"
                  size="lg"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Validating your file...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Validate & Preview
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Step 3: Preview & Confirm */}
        {preview && (
          <Card className="p-6 ring-2 ring-primary/20 shadow-lg animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-semibold">Review & Import</h2>
                </div>
                
                {/* Progress Tracker */}
                {importInProgress && parsedDataId && (
                  <div className="mb-6">
                    <ImportProgressTracker
                      importLogId={parsedDataId}
                      totalRows={totalRows}
                      onComplete={handleImportComplete}
                    />
                  </div>
                )}

                {!importInProgress && (
                  <>
                    <div className="flex items-center space-x-3 mb-6 p-3 rounded-lg bg-muted/50">
                      <Checkbox
                        id="publishAsDraft"
                        checked={publishAsDraft}
                        onCheckedChange={(checked) => setPublishAsDraft(checked as boolean)}
                      />
                      <div className="flex items-center gap-2">
                        <label htmlFor="publishAsDraft" className="text-sm font-medium cursor-pointer">
                          Import as drafts
                        </label>
                        <Badge variant="outline" className="text-xs">Recommended</Badge>
                        <BulkUploadTooltip content={tooltips.draftMode} />
                      </div>
                    </div>
                    <BulkUploadPreview
                      preview={preview}
                      onConfirm={handleConfirmImport}
                      onCancel={handleCancel}
                      processing={processing}
                    />
                  </>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Import History */}
        <div className="pt-4">
          <ImportHistory key={refreshKey} />
        </div>
      </div>
    </DashboardLayout>
  );
}
