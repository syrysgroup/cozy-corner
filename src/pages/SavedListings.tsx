import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { PropertyCard } from '@/components/PropertyCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Language } from '@/lib/i18n';

interface Listing {
  id: string;
  title_en: string;
  title_fr: string;
  description_en: string | null;
  description_fr: string | null;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  property_size: number | null;
  listing_type: string;
  city: string;
  province: string;
  image_urls: string[] | null;
  status: string;
}

export default function SavedListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    if (user) {
      fetchSavedListings();
    }
  }, [user]);

  const fetchSavedListings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_listings')
        .select(`
          listing_id,
          listings (
            id,
            title_en,
            title_fr,
            description_en,
            description_fr,
            price,
            bedrooms,
            bathrooms,
            property_size,
            listing_type,
            city,
            province,
            image_urls,
            status
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const savedListings = data
        ?.map((item: any) => item.listings)
        .filter((listing: any) => listing !== null) as Listing[];

      setListings(savedListings || []);
    } catch (error) {
      console.error('Error fetching saved listings:', error);
      toast.error('Failed to load saved listings');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = () => {
    // Refresh the list when a listing is unsaved
    fetchSavedListings();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Saved Listings</h1>
          <p className="text-muted-foreground mt-2">
            Your favorite properties all in one place
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No saved listings yet. Start exploring properties and save your favorites!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <PropertyCard
                key={listing.id}
                listing={listing}
                lang={lang}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
