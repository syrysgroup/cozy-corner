import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Language, useTranslation } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [lang, setLang] = useState<Language>('en');
  const { user, signIn, signUp, resetPassword } = useAuth();
  const t = useTranslation(lang);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'reset') {
      await resetPassword(email);
      setMode('signin');
    } else if (mode === 'signup') {
      await signUp(email, password, firstName, lastName);
    } else {
      await signIn(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {mode === 'reset' 
              ? 'Reset Password' 
              : mode === 'signup' 
              ? t.auth.createAccount 
              : t.auth.welcomeBack}
          </CardTitle>
          <CardDescription>
            {mode === 'reset'
              ? 'Enter your email to receive a password reset link'
              : mode === 'signup'
              ? t.auth.joinCommunity
              : t.auth.signIn}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {mode !== 'reset' && (
              <div className="space-y-2">
                <Label htmlFor="password">{t.auth.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            )}

            <Button type="submit" className="w-full">
              {mode === 'reset'
                ? 'Send Reset Link'
                : mode === 'signup'
                ? t.auth.signUpButton
                : t.auth.signInButton}
            </Button>
          </form>

          <div className="mt-4 space-y-2 text-center text-sm">
            {mode === 'signin' && (
              <button
                onClick={() => setMode('reset')}
                className="text-primary hover:underline block w-full"
              >
                Forgot password?
              </button>
            )}
            <button
              onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
              className="text-primary hover:underline block w-full"
            >
              {mode === 'signup' ? t.auth.haveAccount : t.auth.noAccount}
            </button>
            {mode === 'reset' && (
              <button
                onClick={() => setMode('signin')}
                className="text-primary hover:underline block w-full"
              >
                Back to sign in
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
