import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Search } from 'lucide-react';

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast.error('Error fetching users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // Update profile role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Update user_roles table
      await supabase.from('user_roles').delete().eq('user_id', userId);
      await supabase.from('user_roles').insert([{
        user_id: userId,
        role: newRole as any,
      }]);

      toast.success('User role updated');
      fetchUsers();
    } catch (error: any) {
      toast.error('Error updating role: ' + error.message);
    }
  };

  const updateKYCStatus = async (userId: string, status: string, level?: string) => {
    try {
      const updates: any = { kyc_status: status };
      if (level) updates.kyc_level = level;

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      toast.success('KYC status updated');
      fetchUsers();
    } catch (error: any) {
      toast.error('Error updating KYC: ' + error.message);
    }
  };

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.first_name?.toLowerCase().includes(search) ||
      user.last_name?.toLowerCase().includes(search) ||
      user.role?.toLowerCase().includes(search)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Shield className="h-8 w-8" />
              User Management
            </h1>
            <p className="text-muted-foreground">Manage users, roles, and KYC status</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={fetchUsers}>Refresh</Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>KYC Level</TableHead>
                    <TableHead>Onboarding</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">{user.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role || 'tenant'}
                          onValueChange={(value) => updateUserRole(user.id, value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tenant">Tenant</SelectItem>
                            <SelectItem value="landlord">Landlord</SelectItem>
                            <SelectItem value="agent">Agent</SelectItem>
                            <SelectItem value="artisan">Artisan</SelectItem>
                            <SelectItem value="business_manager">Business Manager</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="investor">Investor</SelectItem>
                            <SelectItem value="government_ppp">Government/PPP</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.kyc_status || 'pending'}
                          onValueChange={(value) => updateKYCStatus(user.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.kyc_level || 'none'}
                          onValueChange={(value) => updateKYCStatus(user.id, user.kyc_status, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="tier1">Tier 1</SelectItem>
                            <SelectItem value="tier2">Tier 2</SelectItem>
                            <SelectItem value="tier3">Tier 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.onboarding_step === 'completed' ? 'default' : 'secondary'}>
                          {user.onboarding_step || 'Not Started'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/dashboard?user=${user.id}`, '_blank')}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
