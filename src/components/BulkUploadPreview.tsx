import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronRight, Info } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BulkUploadTooltip, tooltips } from '@/components/BulkUploadTooltip';

interface ParsedRow {
  row_number: number;
  data: any;
  status: 'valid' | 'error' | 'warning';
  errors: string[];
  warnings: string[];
}

interface PreviewData {
  valid_rows: ParsedRow[];
  error_rows: ParsedRow[];
  warning_rows: ParsedRow[];
  total: number;
  valid_count: number;
  error_count: number;
  warning_count: number;
}

interface BulkUploadPreviewProps {
  preview: PreviewData;
  onConfirm: (skipWarnings: boolean) => void;
  onCancel: () => void;
  processing: boolean;
}

export const BulkUploadPreview = ({ preview, onConfirm, onCancel, processing }: BulkUploadPreviewProps) => {
  const [filter, setFilter] = useState<'all' | 'valid' | 'errors'>('all');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (rowNumber: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowNumber)) {
      newExpanded.delete(rowNumber);
    } else {
      newExpanded.add(rowNumber);
    }
    setExpandedRows(newExpanded);
  };

  const getFilteredRows = () => {
    const allRows = [...preview.valid_rows, ...preview.warning_rows, ...preview.error_rows];
    switch (filter) {
      case 'valid':
        return preview.valid_rows;
      case 'errors':
        return preview.error_rows;
      default:
        return allRows.sort((a, b) => a.row_number - b.row_number);
    }
  };

  const filteredRows = getFilteredRows();

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Rows</div>
          <div className="text-2xl font-bold">{preview.total}</div>
        </Card>
        <Card className="p-4 border-green-500/20 bg-green-500/5">
          <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Valid
            <BulkUploadTooltip content={tooltips.validStatus} variant="info">
              <Info className="h-3 w-3 opacity-60" />
            </BulkUploadTooltip>
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{preview.valid_count}</div>
        </Card>
        <Card className="p-4 border-yellow-500/20 bg-yellow-500/5">
          <div className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Warnings
            <BulkUploadTooltip content={tooltips.warningStatus} variant="info">
              <Info className="h-3 w-3 opacity-60" />
            </BulkUploadTooltip>
          </div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{preview.warning_count}</div>
        </Card>
        <Card className="p-4 border-red-500/20 bg-red-500/5">
          <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Errors
            <BulkUploadTooltip content={tooltips.errorStatus} variant="info">
              <Info className="h-3 w-3 opacity-60" />
            </BulkUploadTooltip>
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{preview.error_count}</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All Rows
        </Button>
        <Button
          variant={filter === 'valid' ? 'default' : 'outline'}
          onClick={() => setFilter('valid')}
          size="sm"
        >
          Valid Only
        </Button>
        <Button
          variant={filter === 'errors' ? 'default' : 'outline'}
          onClick={() => setFilter('errors')}
          size="sm"
        >
          Errors Only
        </Button>
      </div>

      {/* Preview Table */}
      <Card className="overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {filteredRows.map((row) => (
            <Collapsible key={row.row_number}>
              <div
                className={`border-b ${
                  row.status === 'valid'
                    ? 'bg-green-500/5 border-green-500/20'
                    : row.status === 'warning'
                    ? 'bg-yellow-500/5 border-yellow-500/20'
                    : 'bg-red-500/5 border-red-500/20'
                }`}
              >
                <CollapsibleTrigger
                  onClick={() => toggleRow(row.row_number)}
                  className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {expandedRows.has(row.row_number) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="font-mono text-sm text-muted-foreground">Row {row.row_number}</span>
                    <Badge variant={row.status === 'error' ? 'destructive' : 'secondary'}>
                      {row.status}
                    </Badge>
                    <span className="truncate max-w-md">{row.data.title_en}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {row.status === 'valid' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {row.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                    {row.status === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 space-y-2 bg-background/50">
                    {row.errors.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-red-600 mb-1">Errors:</h4>
                        {row.errors.map((error, idx) => (
                          <p key={idx} className="text-sm text-red-600 ml-4">• {error}</p>
                        ))}
                      </div>
                    )}
                    {row.warnings.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-yellow-600 mb-1">Warnings:</h4>
                        {row.warnings.map((warning, idx) => (
                          <p key={idx} className="text-sm text-yellow-600 ml-4">• {warning}</p>
                        ))}
                      </div>
                    )}
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold mb-1">Data Preview:</h4>
                      <div className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                        <pre>{JSON.stringify(row.data, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      {preview.error_count > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            {preview.error_count} row(s) have errors and cannot be imported. Fix these errors and re-upload the file.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4">
        <Button
          onClick={() => onConfirm(false)}
          disabled={preview.valid_count === 0 || processing}
          size="lg"
          className="flex-1"
        >
          {processing ? 'Processing...' : `Import ${preview.valid_count + preview.warning_count} Listings`}
        </Button>
        {preview.warning_count > 0 && (
          <Button
            onClick={() => onConfirm(true)}
            disabled={preview.valid_count === 0 || processing}
            variant="outline"
            size="lg"
          >
            Import {preview.valid_count} Valid Only
          </Button>
        )}
        <Button onClick={onCancel} variant="ghost" size="lg" disabled={processing}>
          Cancel
        </Button>
      </div>
    </div>
  );
};