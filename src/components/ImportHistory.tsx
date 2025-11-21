import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
}

export const ImportHistory = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ImportLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchLogs();
  }, [user]);

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
        {logs.map((log) => (
          <Card key={log.id} className="p-4">
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
                        : 'secondary'
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
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};