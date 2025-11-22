import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Download, ExternalLink, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface ImportLog {
  id: string;
  file_name: string;
  row_count: number;
  success_count: number;
  error_count: number;
  warning_count: number;
  status: string;
  created_at: string;
  completed_at: string | null;
  details?: any;
  user_id: string;
}

interface ImportDetailsModalProps {
  log: ImportLog;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportDetailsModal({ log, open, onOpenChange }: ImportDetailsModalProps) {
  const [listings, setListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);

  useEffect(() => {
    if (open && log.status === 'completed') {
      fetchCreatedListings();
    }
  }, [open, log.id]);

  const fetchCreatedListings = async () => {
    try {
      setLoadingListings(true);
      
      // Fetch listings created around the same time as this import
      const { data, error } = await supabase
        .from('listings')
        .select('id, title_en, status, created_at')
        .eq('user_id', log.user_id)
        .gte('created_at', log.created_at)
        .lte('created_at', log.completed_at || new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(log.success_count);

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoadingListings(false);
    }
  };

  const exportErrorReport = () => {
    try {
      const errors = log.details?.errors || [];
      const warnings = log.details?.warnings || [];
      
      let csvContent = 'Row Number,Type,Field,Message\n';
      
      errors.forEach((error: any) => {
        csvContent += `${error.row || 'N/A'},Error,${error.field || 'N/A'},"${error.message || 'N/A'}"\n`;
      });
      
      warnings.forEach((warning: any) => {
        csvContent += `${warning.row || 'N/A'},Warning,${warning.field || 'N/A'},"${warning.message || 'N/A'}"\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `import-errors-${log.id}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Error report downloaded');
    } catch (error) {
      toast.error('Failed to export error report');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Import Details</DialogTitle>
          <DialogDescription>
            Detailed information about this bulk import
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Summary */}
            <div>
              <h3 className="font-semibold mb-3">Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">File Name:</span>
                  <p className="font-medium">{log.file_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className="mt-1">{getStatusBadge(log.status)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Started:</span>
                  <p className="font-medium">
                    {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                  </p>
                </div>
                {log.completed_at && (
                  <div>
                    <span className="text-muted-foreground">Completed:</span>
                    <p className="font-medium">
                      {formatDistanceToNow(new Date(log.completed_at), { addSuffix: true })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Statistics */}
            <div>
              <h3 className="font-semibold mb-3">Statistics</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{log.row_count}</p>
                  <p className="text-sm text-muted-foreground">Total Rows</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{log.success_count}</p>
                  <p className="text-sm text-muted-foreground">Success</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{log.error_count}</p>
                  <p className="text-sm text-muted-foreground">Errors</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{log.warning_count}</p>
                  <p className="text-sm text-muted-foreground">Warnings</p>
                </div>
              </div>
              {log.details?.geocoded_count > 0 && (
                <div className="mt-4 text-center">
                  <p className="text-lg font-semibold text-blue-600">
                    {log.details.geocoded_count} addresses geocoded
                  </p>
                </div>
              )}
            </div>

            {/* Created Listings */}
            {log.status === 'completed' && log.success_count > 0 && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Created Listings</h3>
                  </div>
                  {loadingListings ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {listings.map((listing) => (
                        <div
                          key={listing.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium">{listing.title_en}</p>
                            <p className="text-sm text-muted-foreground">
                              Status: {listing.status}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/properties/${listing.id}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Errors and Warnings */}
            {(log.error_count > 0 || log.warning_count > 0) && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Errors & Warnings</h3>
                    <Button variant="outline" size="sm" onClick={exportErrorReport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {log.details?.errors?.map((error: any, index: number) => (
                      <div key={`error-${index}`} className="p-3 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-start gap-2">
                          <Badge variant="destructive" className="shrink-0">Error</Badge>
                          <div className="flex-1 text-sm">
                            <p className="font-medium">Row {error.row}</p>
                            <p className="text-muted-foreground">{error.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {log.details?.warnings?.map((warning: any, index: number) => (
                      <div key={`warning-${index}`} className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                        <div className="flex items-start gap-2">
                          <Badge variant="secondary" className="shrink-0 bg-yellow-500 text-white">
                            Warning
                          </Badge>
                          <div className="flex-1 text-sm">
                            <p className="font-medium">Row {warning.row}</p>
                            <p className="text-muted-foreground">{warning.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
