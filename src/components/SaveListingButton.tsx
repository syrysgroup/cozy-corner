import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface SaveListingButtonProps {
  listingId: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function SaveListingButton({ listingId, variant = 'ghost', size = 'icon' }: SaveListingButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkIfSaved();
  }, [listingId, user]);

  const checkIfSaved = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('saved_listings')
      .select('id')
      .eq('user_id', user.id)
      .eq('listing_id', listingId)
      .maybeSingle();

    setIsSaved(!!data);
  };

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please sign in to save listings');
      navigate('/auth');
      return;
    }

    setLoading(true);

    if (isSaved) {
      const { error } = await supabase
        .from('saved_listings')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);

      if (error) {
        toast.error('Failed to unsave listing');
      } else {
        setIsSaved(false);
        toast.success('Listing removed from favorites');
      }
    } else {
      const { error } = await supabase
        .from('saved_listings')
        .insert({
          user_id: user.id,
          listing_id: listingId
        });

      if (error) {
        toast.error('Failed to save listing');
      } else {
        setIsSaved(true);
        toast.success('Listing saved to favorites');
      }
    }

    setLoading(false);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleSave}
      disabled={loading}
      className="relative"
    >
      <Heart
        className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`}
      />
    </Button>
  );
}
