import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

const ROLES = [
  { value: 'tenant', label: 'Tenant', description: 'Looking for a place to rent' },
  { value: 'landlord', label: 'Landlord', description: 'Property owner looking to rent out' },
  { value: 'agent', label: 'Real Estate Agent', description: 'Professional property agent' },
  { value: 'artisan', label: 'Artisan', description: 'Service provider for properties' },
  { value: 'business_manager', label: 'Business Manager', description: 'Managing commercial properties' },
  { value: 'student', label: 'Student', description: 'Student looking for accommodation' },
  { value: 'investor', label: 'Investor', description: 'Property investment opportunities' },
  { value: 'government_ppp', label: 'Government/PPP', description: 'Government or public-private partnership' },
];

export default function OnboardingWizard() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    role: '',
    firstName: '',
    lastName: '',
    phone: '',
    preferredLanguage: 'en',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        role: profile.role || '',
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phone: profile.phone || '',
        preferredLanguage: profile.preferred_language || 'en',
      });
      
      // Determine current step based on profile data
      if (!profile.role) {
        setStep(1);
      } else if (!profile.first_name || !profile.last_name) {
        setStep(2);
      } else if (profile.kyc_status === 'pending' && profile.kyc_level === 'none') {
        setStep(3);
      } else {
        setStep(4);
      }
    }
  }, [profile]);

  const updateProfile = async (updates: any, nextStep?: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          onboarding_step: nextStep || updates.onboarding_step,
        })
        .eq('id', user?.id);

      if (error) throw error;

      // Also update user_roles table if role is being set
      if (updates.role) {
        // First, remove existing roles
        await supabase.from('user_roles').delete().eq('user_id', user?.id);
        
        // Then add the new role
        await supabase.from('user_roles').insert({
          user_id: user?.id,
          role: updates.role,
        });
      }

      await refreshProfile();
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelection = async () => {
    if (!formData.role) {
      toast.error('Please select a role');
      return;
    }

    const success = await updateProfile({ role: formData.role }, 'profile_info');
    if (success) {
      setStep(2);
    }
  };

  const handleProfileInfo = async () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error('Please fill in all required fields');
      return;
    }

    const success = await updateProfile({
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      preferred_language: formData.preferredLanguage,
      full_name: `${formData.firstName} ${formData.lastName}`,
    }, 'kyc_upload');

    if (success) {
      setStep(3);
    }
  };

  const handleSkipKYC = async () => {
    const success = await updateProfile({}, 'completed');
    if (success) {
      toast.success('Onboarding completed!');
      navigate('/dashboard');
    }
  };

  const handleCompleteOnboarding = async () => {
    const success = await updateProfile({}, 'completed');
    if (success) {
      toast.success('Welcome to Multilisting!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Welcome to Multilisting</CardTitle>
          <CardDescription>Let's get you set up in a few simple steps</CardDescription>
          
          {/* Progress indicator */}
          <div className="flex items-center justify-between mt-6">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step > s ? <CheckCircle className="h-5 w-5" /> : s}
                </div>
                {s < 4 && (
                  <div className={`w-12 h-1 ${step > s ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Your Role</h3>
              <p className="text-sm text-muted-foreground">Choose the role that best describes you</p>
              
              <div className="grid gap-3">
                {ROLES.map((role) => (
                  <div
                    key={role.value}
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.role === role.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium">{role.label}</div>
                    <div className="text-sm text-muted-foreground">{role.description}</div>
                  </div>
                ))}
              </div>
              
              <Button onClick={handleRoleSelection} disabled={loading} className="w-full">
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Complete Your Profile</h3>
              <p className="text-sm text-muted-foreground">Tell us a bit more about yourself</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select
                    value={formData.preferredLanguage}
                    onValueChange={(value) => setFormData({ ...formData, preferredLanguage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleProfileInfo} disabled={loading} className="flex-1">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Identity Verification (KYC)</h3>
              <p className="text-sm text-muted-foreground">
                Upload your documents to verify your identity. This helps build trust in our community.
              </p>
              
              <div className="p-6 border border-dashed border-border rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  You can upload your KYC documents now or do it later from your dashboard.
                </p>
                <Button 
                  onClick={() => navigate('/dashboard/kyc')}
                  className="mr-2"
                >
                  Upload Documents Now
                </Button>
                <Button variant="outline" onClick={handleSkipKYC} disabled={loading}>
                  Skip for Now
                </Button>
              </div>
              
              <Button variant="outline" onClick={() => setStep(2)} className="w-full">
                Back
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold">All Set!</h3>
              <p className="text-sm text-muted-foreground">
                Your profile is complete. You can now explore Multilisting and start your journey.
              </p>
              
              <Button onClick={handleCompleteOnboarding} disabled={loading} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
