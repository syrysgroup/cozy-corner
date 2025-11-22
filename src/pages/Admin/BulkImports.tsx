import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, RefreshCw, Search, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ImportDetailsModal } from '@/components/ImportDetailsModal';
import { useNavigate } from 'react-router-dom';

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
  profiles?: {
    full_name: string | null;
    first_name: string | null;
    last_name: string | null;
  };
}

export default function BulkImports() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<ImportLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<ImportLog | null>(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);

  const pageSize = 50;

  useEffect(() => {
    checkAdminAccess();
    fetchUsers();
    fetchLogs();
  }, [user, page, searchTerm, statusFilter, userFilter]);

  const checkAdminAccess = async () => {
    if (!user) return;
    
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin' as any,
    });

    if (error || !data) {
      navigate('/dashboard');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, first_name, last_name')
        .order('full_name', { ascending: true });

      if (error) throw error;

      setUsers(
        data.map((u) => ({
          id: u.id,
          name: u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Unknown User',
        }))
      );
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('bulk_import_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (searchTerm) {
        query = query.ilike('file_name', `%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (userFilter !== 'all') {
        query = query.eq('user_id', userFilter);
      }

      const { data: logsData, error, count } = await query;

      if (error) throw error;

      // Fetch user profiles separately
      if (logsData && logsData.length > 0) {
        const userIds = [...new Set(logsData.map(log => log.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, first_name, last_name')
          .in('id', userIds);

        const profilesMap = new Map(
          profilesData?.map(p => [p.id, p]) || []
        );

        const enrichedLogs = logsData.map(log => ({
          ...log,
          profiles: profilesMap.get(log.user_id),
        }));

        setLogs(enrichedLogs as any);
      } else {
        setLogs([]);
      }

      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching import logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (log: ImportLog) => {
    if (log.profiles?.full_name) return log.profiles.full_name;
    if (log.profiles?.first_name || log.profiles?.last_name) {
      return `${log.profiles.first_name || ''} ${log.profiles.last_name || ''}`.trim();
    }
    return 'Unknown User';
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

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Bulk Import Management</h1>
          <Button onClick={fetchLogs} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by file name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(0);
                  }}
                  className="pl-9"
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setPage(0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={userFilter}
                onValueChange={(value) => {
                  setUserFilter(value);
                  setPage(0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground flex items-center">
                Total: {totalCount} imports
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                No imports found matching your filters.
              </div>
            ) : (
              <>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>File Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Success</TableHead>
                        <TableHead className="text-right">Errors</TableHead>
                        <TableHead className="text-right">Warnings</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">
                            {getUserName(log)}
                          </TableCell>
                          <TableCell>{log.file_name}</TableCell>
                          <TableCell>{getStatusBadge(log.status)}</TableCell>
                          <TableCell className="text-right">{log.row_count}</TableCell>
                          <TableCell className="text-right text-green-600">
                            {log.success_count}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {log.error_count}
                          </TableCell>
                          <TableCell className="text-right text-yellow-600">
                            {log.warning_count}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(log.created_at), {
                              addSuffix: true,
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedLog(log)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Page {page + 1} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        {selectedLog && (
          <ImportDetailsModal
            log={selectedLog}
            open={!!selectedLog}
            onOpenChange={(open) => !open && setSelectedLog(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
