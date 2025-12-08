import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Loader2, MapPin, XCircle, Sparkles } from 'lucide-react';

interface ImportProgressTrackerProps {
  importLogId: string;
  totalRows: number;
  onComplete: () => void;
}

interface ProgressData {
  status: string;
  success_count: number;
  error_count: number;
  details?: {
    current_row?: number;
    geocoded_count?: number;
  };
}

export const ImportProgressTracker = ({
  importLogId,
  totalRows,
  onComplete,
}: ImportProgressTrackerProps) => {
  const [progress, setProgress] = useState<ProgressData>({
    status: 'processing',
    success_count: 0,
    error_count: 0,
  });

  useEffect(() => {
    // Subscribe to real-time updates for this import log
    const channel = supabase
      .channel(`import-progress-${importLogId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bulk_import_logs',
          filter: `id=eq.${importLogId}`,
        },
        (payload) => {
          const newData = payload.new as any;
          setProgress({
            status: newData.status,
            success_count: newData.success_count || 0,
            error_count: newData.error_count || 0,
            details: newData.details,
          });

          if (newData.status === 'completed' || newData.status === 'failed') {
            onComplete();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [importLogId, onComplete]);

  const processedCount = progress.success_count + progress.error_count;
  const progressPercent = totalRows > 0 ? (processedCount / totalRows) * 100 : 0;
  const currentRow = progress.details?.current_row || processedCount;
  const geocodedCount = progress.details?.geocoded_count || 0;

  const isComplete = progress.status === 'completed';
  const isFailed = progress.status === 'failed';
  const isProcessing = !isComplete && !isFailed;

  return (
    <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-transparent p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isComplete ? (
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          ) : isFailed ? (
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            </div>
          )}
          <div>
            <h3 className="font-semibold">
              {isComplete ? 'Import Complete!' : isFailed ? 'Import Failed' : 'Processing Import...'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isProcessing && 'Creating your listings and geocoding addresses'}
              {isComplete && `Successfully imported ${progress.success_count} listings`}
              {isFailed && 'Some listings could not be imported'}
            </p>
          </div>
        </div>
        <Badge variant={isComplete ? 'default' : isFailed ? 'destructive' : 'secondary'} className="gap-1">
          {isProcessing && <Sparkles className="h-3 w-3" />}
          {currentRow} / {totalRows}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress 
          value={progressPercent} 
          className={`h-2 ${isComplete ? 'bg-green-100 dark:bg-green-900/30' : ''}`}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{Math.round(progressPercent)}% complete</span>
          {isProcessing && <span className="animate-pulse">Estimated time remaining...</span>}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-background/80 p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xl font-bold">{progress.success_count}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Successful</p>
        </div>
        
        <div className="rounded-lg bg-background/80 p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-blue-600 dark:text-blue-400">
            <MapPin className="h-4 w-4" />
            <span className="text-xl font-bold">{geocodedCount}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Geocoded</p>
        </div>
        
        <div className="rounded-lg bg-background/80 p-3 text-center">
          <div className={`flex items-center justify-center gap-1.5 ${
            progress.error_count > 0 ? 'text-destructive' : 'text-muted-foreground'
          }`}>
            <XCircle className="h-4 w-4" />
            <span className="text-xl font-bold">{progress.error_count}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Failed</p>
        </div>
      </div>
    </div>
  );
};
