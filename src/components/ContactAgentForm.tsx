import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send, Phone, Mail, User } from 'lucide-react';
import { Language } from '@/lib/i18n';
import { z } from 'zod';

interface Agent {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

interface ContactAgentFormProps {
  agent?: Agent;
  propertyTitle: string;
  lang: Language;
}

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().max(20).optional(),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

export function ContactAgentForm({ agent, propertyTitle, lang }: ContactAgentFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: lang === 'fr' 
      ? `Bonjour, je suis intéressé(e) par cette propriété: ${propertyTitle}. Pourriez-vous me contacter pour plus d'informations?`
      : `Hello, I am interested in this property: ${propertyTitle}. Could you please contact me with more information?`
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      contactSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach(error => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    setLoading(true);
    
    // Simulate sending message
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: lang === 'fr' ? 'Message envoyé!' : 'Message sent!',
      description: lang === 'fr' 
        ? 'L\'agent vous contactera bientôt.'
        : 'The agent will contact you shortly.',
    });
    
    setFormData(prev => ({ ...prev, name: '', email: '', phone: '' }));
    setLoading(false);
  };

  const labels = {
    title: lang === 'fr' ? 'Contacter l\'agent' : 'Contact Agent',
    name: lang === 'fr' ? 'Votre nom' : 'Your Name',
    email: lang === 'fr' ? 'Votre email' : 'Your Email',
    phone: lang === 'fr' ? 'Téléphone (optionnel)' : 'Phone (optional)',
    message: lang === 'fr' ? 'Message' : 'Message',
    send: lang === 'fr' ? 'Envoyer le message' : 'Send Message',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          {labels.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {agent && (
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg mb-4">
            <img 
              src={agent.avatar} 
              alt={agent.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{agent.name}</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {agent.phone}
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {agent.email}
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {labels.name}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={lang === 'fr' ? 'Jean Dupont' : 'John Doe'}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {labels.email}
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@example.com"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {labels.phone}
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{labels.message}</Label>
            <Textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            />
            {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            <Send className="h-4 w-4 mr-2" />
            {loading ? (lang === 'fr' ? 'Envoi...' : 'Sending...') : labels.send}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
