import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { RetryImportDialog } from '@/components/RetryImportDialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

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
}

export const ImportHistory = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ImportLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [retryDialogOpen, setRetryDialogOpen] = useState(false);
  const [selectedLogForRetry, setSelectedLogForRetry] = useState<ImportLog | null>(null);

  const fetchLogs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bulk_import_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching import logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('import-history-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bulk_import_logs',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const toggleExpand = (logId: string) => {
    setExpandedLogs(prev => {
      const next = new Set(prev);
      if (next.has(logId)) {
        next.delete(logId);
      } else {
        next.add(logId);
      }
      return next;
    });
  };

  const getFailedRows = (log: ImportLog) => {
    if (!log.details?.parsed_rows) return [];
    return log.details.parsed_rows.filter(
      (row: any) => row.status === 'error'
    ).map((row: any) => ({
      row_number: row.row_number,
      data: row.data,
      errors: row.errors || [],
    }));
  };

  const handleRetryClick = (log: ImportLog) => {
    setSelectedLogForRetry(log);
    setRetryDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        No import history yet. Upload your first file to get started.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Import History</h3>
      <div className="space-y-2">
        {logs.map((log) => {
          const isExpanded = expandedLogs.has(log.id);
          const failedRows = getFailedRows(log);
          const hasFailedRows = failedRows.length > 0;
          const importErrors = log.details?.import_errors || [];

          return (
            <Collapsible
              key={log.id}
              open={isExpanded}
              onOpenChange={() => toggleExpand(log.id)}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{log.file_name}</h4>
                      <Badge
                        variant={
                          log.status === 'completed'
                            ? 'default'
                            : log.status === 'failed'
                            ? 'destructive'
                            : log.status === 'processing'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {log.status}
                      </Badge>
                    </div>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Total: {log.row_count}</span>
                      <span className="text-green-600">Success: {log.success_count}</span>
                      {log.warning_count > 0 && (
                        <span className="text-yellow-600">Warnings: {log.warning_count}</span>
                      )}
                      {log.error_count > 0 && (
                        <span className="text-red-600">Errors: {log.error_count}</span>
                      )}
                      {log.details?.geocoded_count && log.details.geocoded_count > 0 && (
                        <span className="text-blue-600">Geocoded: {log.details.geocoded_count}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </span>
                    {(hasFailedRows || importErrors.length > 0) && (
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    )}
                  </div>
                </div>

                <CollapsibleContent className="mt-4 pt-4 border-t space-y-3">
                  {/* Import Errors */}
                  {importErrors.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-red-600">Import Errors:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {importErrors.slice(0, 5).map((err: any, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-red-600">Row {err.row_number}:</span>
                            <span>{err.error}</span>
                          </li>
                        ))}
                        {importErrors.length > 5 && (
                          <li className="text-muted-foreground">
                            ... and {importErrors.length - 5} more errors
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Retry Button */}
                  {hasFailedRows && log.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRetryClick(log)}
                      className="mt-2"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry Failed Rows ({failedRows.length})
                    </Button>
                  )}
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>

      {/* Retry Dialog */}
      {selectedLogForRetry && (
        <RetryImportDialog
          open={retryDialogOpen}
          onOpenChange={setRetryDialogOpen}
          importLogId={selectedLogForRetry.id}
          failedRows={getFailedRows(selectedLogForRetry)}
          onRetryComplete={fetchLogs}
        />
      )}
    </div>
  );
};
