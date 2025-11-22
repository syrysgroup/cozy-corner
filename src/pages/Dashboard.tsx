import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, FileText, Shield, AlertCircle, CheckCircle, Upload, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [canBulkUpload, setCanBulkUpload] = useState(false);
  const [recentImports, setRecentImports] = useState<any[]>([]);

  useEffect(() => {
    checkBulkUploadPermission();
  }, [user]);

  useEffect(() => {
    if (canBulkUpload && user) {
      fetchRecentImports();
    }
  }, [canBulkUpload, user]);

  const checkBulkUploadPermission = async () => {
    if (!user) return;

    const roles = ['agent', 'landlord', 'business_manager', 'admin'];
    
    for (const role of roles) {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: role as any,
      });

      if (!error && data) {
        setCanBulkUpload(true);
        return;
      }
    }
  };

  const fetchRecentImports = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bulk_import_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRecentImports(data || []);
    } catch (error) {
      console.error('Error fetching recent imports:', error);
    }
  };

  const getKYCColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-yellow-500';
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
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.first_name || 'User'}!
          </p>
        </div>

        {/* Quick Actions */}
        {canBulkUpload && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto flex flex-col items-start p-4 hover:bg-accent"
                  onClick={() => navigate('/dashboard/bulk-upload')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Upload className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Bulk Upload Listings</span>
                  </div>
                  <span className="text-sm text-muted-foreground text-left">
                    Import multiple properties at once from CSV or Excel
                  </span>
                </Button>

                {recentImports.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Recent Imports</h4>
                    {recentImports.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => navigate('/dashboard/bulk-upload')}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{log.file_name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(log.status)}
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Info Card */}
        {profile && (
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge>{profile.role || 'Not Set'}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">KYC Status</p>
                  <Badge variant={profile.kyc_status === 'approved' ? 'default' : 'secondary'}>
                    {profile.kyc_status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">KYC Level</p>
                  <Badge variant="outline">{profile.kyc_level}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Language</p>
                  <Badge variant="outline">{profile.preferred_language?.toUpperCase()}</Badge>
                </div>
              </div>

              {/* Action Items */}
              {profile.kyc_status !== 'approved' && (
                <div className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">Action Required</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile.kyc_status === 'pending' 
                          ? 'Your KYC documents are under review. This usually takes 24-48 hours.'
                          : profile.kyc_status === 'rejected'
                          ? 'Your KYC was rejected. Please upload new documents addressing the issues mentioned.'
                          : 'Complete your KYC verification to unlock all features.'}
                      </p>
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => navigate('/dashboard/kyc')}
                      >
                        Go to KYC
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {profile.kyc_status === 'approved' && (
                <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-foreground">Verified Account</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your identity has been verified. You can now access all features.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No properties listed yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No applications pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">KYC Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${profile ? getKYCColor(profile.kyc_status) : ''}`}>
                {profile?.kyc_status || 'Pending'}
              </div>
              <p className="text-xs text-muted-foreground">
                {profile?.kyc_level || 'none'} tier
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
