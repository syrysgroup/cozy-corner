import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const ProtectedRoute = ({ children, requireOnboarding = true }: { children: React.ReactNode; requireOnboarding?: boolean }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if onboarding is required and not completed
  if (requireOnboarding && profile && profile.onboarding_step !== 'completed') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
