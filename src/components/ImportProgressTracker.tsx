import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Loader2, MapPin } from 'lucide-react';

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

  const isComplete = progress.status === 'completed' || progress.status === 'failed';

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          )}
          <span className="font-medium">
            {isComplete ? 'Import Complete' : 'Processing Import...'}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {currentRow} / {totalRows} rows
        </span>
      </div>

      <Progress value={progressPercent} className="h-2" />

      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-green-600 font-medium">{progress.success_count}</span>
          <span className="text-muted-foreground">successful</span>
        </div>
        {progress.error_count > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-red-600 font-medium">{progress.error_count}</span>
            <span className="text-muted-foreground">failed</span>
          </div>
        )}
        {geocodedCount > 0 && (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-blue-600 font-medium">{geocodedCount}</span>
            <span className="text-muted-foreground">geocoded</span>
          </div>
        )}
      </div>
    </div>
  );
};
