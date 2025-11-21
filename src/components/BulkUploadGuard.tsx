import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const ALLOWED_ROLES = ['agent', 'landlord', 'business_manager', 'admin'];

export const BulkUploadGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      if (!user) {
        setHasPermission(false);
        setLoading(false);
        return;
      }

      try {
        let authorized = false;
        for (const role of ALLOWED_ROLES) {
          const { data } = await supabase.rpc('has_role', {
            _user_id: user.id,
            _role: role as any,
          });
          if (data) {
            authorized = true;
            break;
          }
        }
        setHasPermission(authorized);
      } catch (error) {
        console.error('Error checking permissions:', error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert className="max-w-lg">
          <AlertDescription>
            <h2 className="text-lg font-semibold mb-2">Access Restricted</h2>
            <p>This feature is only available to agents, landlords, business managers, and administrators.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};