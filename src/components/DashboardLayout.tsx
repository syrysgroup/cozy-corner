import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Shield, User, Settings, Menu, X, Users, Heart, Upload, FolderUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Language, useTranslation } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { supabase } from '@/integrations/supabase/client';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [lang, setLang] = useState<Language>('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [canBulkUpload, setCanBulkUpload] = useState(false);
  const { signOut, user, profile } = useAuth();
  const location = useLocation();
  const t = useTranslation(lang);

  useEffect(() => {
    checkPermissions();
  }, [user]);

  const checkPermissions = async () => {
    if (!user) return;
    
    try {
      const { data: isAdminData } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin',
      });
      
      if (isAdminData) {
        setIsAdmin(true);
        setCanBulkUpload(true);
        return;
      }

      // Check for bulk upload permissions
      const allowedRoles = ['agent', 'landlord', 'business_manager'];
      for (const role of allowedRoles) {
        const { data } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: role as any,
        });
        if (data) {
          setCanBulkUpload(true);
          break;
        }
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const baseMenuItems = [
    { icon: Home, label: t.dashboard.overview, path: '/dashboard' },
    { icon: FileText, label: t.dashboard.properties, path: '/dashboard/properties' },
    { icon: Heart, label: t.dashboard.savedListings, path: '/dashboard/saved' },
    { icon: Shield, label: t.dashboard.kyc, path: '/dashboard/kyc' },
    { icon: User, label: t.dashboard.profile, path: '/dashboard/profile' },
    { icon: Settings, label: t.dashboard.settings, path: '/dashboard/settings' },
  ];

  const bulkUploadItem = { icon: Upload, label: 'Bulk Upload', path: '/dashboard/bulk-upload' };

  const adminMenuItems = [
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Shield, label: 'KYC Review', path: '/admin/kyc-review' },
    { icon: FolderUp, label: 'Bulk Imports', path: '/admin/bulk-imports' },
  ];

  let menuItems = [...baseMenuItems];
  if (canBulkUpload) menuItems.push(bulkUploadItem);
  if (isAdmin) menuItems = [...menuItems, ...adminMenuItems];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            {sidebarOpen ? <X /> : <Menu />}
          </Button>
          <Link to="/" className="text-2xl font-bold text-primary">
            Multilisting
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
          <Button variant="ghost" onClick={signOut}>
            {t.nav.signOut}
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-card border-r border-border transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-4">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">{t.dashboard.welcome}</p>
            <p className="font-semibold text-foreground truncate">{user?.email}</p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="pt-16 lg:pl-64">
        <div className="p-6">{children}</div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
