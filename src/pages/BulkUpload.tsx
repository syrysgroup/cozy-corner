import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BulkUploadPreview } from '@/components/BulkUploadPreview';
import { ImportHistory } from '@/components/ImportHistory';
import { downloadCSVTemplate, downloadExcelTemplate } from '@/lib/templateGenerator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export default function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [parsedDataId, setParsedDataId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [publishAsDraft, setPublishAsDraft] = useState(true);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0];
      if (uploadedFile.name.endsWith('.csv') || uploadedFile.name.endsWith('.xlsx')) {
        setFile(uploadedFile);
        setPreview(null);
        setParsedDataId(null);
      } else {
        toast.error('Invalid file type. Please upload CSV or Excel files only.');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
  });

  const handleParseFile = async () => {
    if (!file) return;

    setUploading(true);
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to parse file');
      }

      const result = await response.json();
      setPreview(result.preview);
      setParsedDataId(result.parsed_data_id);
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
    } catch (error: any) {
      console.error('Error processing import:', error);
      toast.error(error.message || 'Failed to process import');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
    setParsedDataId(null);
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
          <h2 className="text-xl font-semibold mb-4">Step 1: Download Template</h2>
          <p className="text-muted-foreground mb-4">
            Start by downloading a template file with example data and field descriptions.
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
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
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
                  Accepts CSV and XLSX files (max 10MB)
                </p>
              </div>
            )}
          </div>
          {file && !preview && (
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
          </Card>
        )}

        {/* Import History */}
        <ImportHistory />
      </div>
    </DashboardLayout>
  );
}