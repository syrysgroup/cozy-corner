import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, FileText, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const getKYCColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-yellow-500';
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
