import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  History, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Clock,
  FileSpreadsheet,
  MapPin
} from 'lucide-react';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default' as const;
      case 'failed':
        return 'destructive' as const;
      case 'processing':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <History className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-1">No Import History</h3>
        <p className="text-muted-foreground text-sm">
          Your completed imports will appear here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Import History</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchLogs} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>
      
      <div className="space-y-3">
        {logs.map((log) => {
          const isExpanded = expandedLogs.has(log.id);
          const failedRows = getFailedRows(log);
          const hasFailedRows = failedRows.length > 0;
          const importErrors = log.details?.import_errors || [];
          const hasExpandableContent = hasFailedRows || importErrors.length > 0;

          return (
            <Collapsible
              key={log.id}
              open={isExpanded}
              onOpenChange={() => hasExpandableContent && toggleExpand(log.id)}
            >
              <Card className={`overflow-hidden transition-all duration-200 ${
                isExpanded ? 'ring-1 ring-primary/20' : ''
              }`}>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium truncate">{log.file_name}</h4>
                          <Badge variant={getStatusBadgeVariant(log.status)} className="gap-1">
                            {getStatusIcon(log.status)}
                            {log.status}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
                          <span className="text-muted-foreground">
                            {log.row_count} rows
                          </span>
                          {log.success_count > 0 && (
                            <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              {log.success_count} imported
                            </span>
                          )}
                          {log.warning_count > 0 && (
                            <span className="text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {log.warning_count} warnings
                            </span>
                          )}
                          {log.error_count > 0 && (
                            <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              {log.error_count} failed
                            </span>
                          )}
                          {log.details?.geocoded_count > 0 && (
                            <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {log.details.geocoded_count} geocoded
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                      </span>
                      {hasExpandableContent && (
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
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
                </div>

                <CollapsibleContent>
                  <div className="px-4 pb-4 pt-2 border-t bg-muted/30 space-y-4">
                    {/* Import Errors */}
                    {importErrors.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-destructive flex items-center gap-2">
                          <XCircle className="h-4 w-4" />
                          Import Errors
                        </h5>
                        <div className="rounded-lg bg-destructive/10 p-3 space-y-1.5">
                          {importErrors.slice(0, 5).map((err: any, i: number) => (
                            <div key={i} className="text-sm flex gap-2">
                              <span className="text-destructive font-mono text-xs bg-destructive/20 px-1.5 rounded">
                                Row {err.row_number}
                              </span>
                              <span className="text-muted-foreground">{err.error}</span>
                            </div>
                          ))}
                          {importErrors.length > 5 && (
                            <p className="text-sm text-muted-foreground pt-1">
                              ... and {importErrors.length - 5} more errors
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Retry Button */}
                    {hasFailedRows && log.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetryClick(log)}
                        className="gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Retry {failedRows.length} Failed Row{failedRows.length > 1 ? 's' : ''}
                      </Button>
                    )}
                  </div>
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
