import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FailedRow {
  row_number: number;
  data: Record<string, any>;
  errors: string[];
}

interface RetryImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importLogId: string;
  failedRows: FailedRow[];
  onRetryComplete: () => void;
}

export const RetryImportDialog = ({
  open,
  onOpenChange,
  importLogId,
  failedRows,
  onRetryComplete,
}: RetryImportDialogProps) => {
  const [editedRows, setEditedRows] = useState<FailedRow[]>(failedRows);
  const [processing, setProcessing] = useState(false);

  const updateRowField = (rowIndex: number, field: string, value: string) => {
    setEditedRows(prev => {
      const updated = [...prev];
      updated[rowIndex] = {
        ...updated[rowIndex],
        data: { ...updated[rowIndex].data, [field]: value }
      };
      return updated;
    });
  };

  const handleRetry = async () => {
    setProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in');
        return;
      }

      // Create a new import log for the retry
      const { data: newLog, error: logError } = await supabase
        .from('bulk_import_logs')
        .insert({
          user_id: session.user.id,
          file_name: `Retry of import ${importLogId.slice(0, 8)}`,
          status: 'pending',
          row_count: editedRows.length,
          details: {
            parsed_rows: editedRows.map((row, idx) => ({
              row_number: idx + 1,
              data: row.data,
              status: 'valid',
              errors: [],
              warnings: []
            })),
            original_import_id: importLogId
          }
        })
        .select()
        .single();

      if (logError) throw logError;

      // Process the retry
      const response = await fetch(
        `https://jwmvnsyvtprtheawgsan.supabase.co/functions/v1/process-bulk-import`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parsed_data_id: newLog.id,
            publish_as_draft: true,
            skip_warnings: false,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process retry');
      }

      const result = await response.json();
      toast.success(`Retry complete: ${result.results.success_count} listings imported`);
      onRetryComplete();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error retrying import:', error);
      toast.error(error.message || 'Failed to retry import');
    } finally {
      setProcessing(false);
    }
  };

  const editableFields = ['title_en', 'title_fr', 'price', 'address_text', 'city', 'province'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Retry Failed Rows ({editedRows.length})
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[50vh]">
          <div className="space-y-4">
            {editedRows.map((row, rowIndex) => (
              <div key={row.row_number} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Row {row.row_number}</span>
                  <div className="flex gap-1">
                    {row.errors.map((err, i) => (
                      <Badge key={i} variant="destructive" className="text-xs">
                        {err}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {editableFields.map(field => (
                    <div key={field}>
                      <label className="text-xs text-muted-foreground">{field}</label>
                      <Input
                        value={row.data[field] || ''}
                        onChange={(e) => updateRowField(rowIndex, field, e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
            Cancel
          </Button>
          <Button onClick={handleRetry} disabled={processing}>
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Import
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
