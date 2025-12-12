import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PropertyCard } from '@/components/PropertyCard';
import { ListingsMap } from '@/components/ListingsMap';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Language } from '@/lib/i18n';
import { Search, Map, Sparkles } from 'lucide-react';
import { MOCK_PROPERTIES, convertMockToListing } from '@/data/mockData';

export default function Properties() {
  const [lang] = useState<Language>('en');
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showMap, setShowMap] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  const [mapBounds, setMapBounds] = useState<{
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  } | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching listings:', error);
      // Fall back to mock data on error
      setListings(MOCK_PROPERTIES.map(convertMockToListing));
      setUsingMockData(true);
      setLoading(false);
      return;
    }

    // If no data, use mock data
    if (!data || data.length === 0) {
      setListings(MOCK_PROPERTIES.map(convertMockToListing));
      setUsingMockData(true);
    } else {
      setListings(data);
      setUsingMockData(false);
    }
    setLoading(false);
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      listing.title_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.title_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || listing.listing_type === filterType;
    
    // Apply map bounds filter if map view is active
    const matchesBounds = !mapBounds || !listing.latitude || !listing.longitude || (
      listing.latitude >= mapBounds.minLat &&
      listing.latitude <= mapBounds.maxLat &&
      listing.longitude >= mapBounds.minLng &&
      listing.longitude <= mapBounds.maxLng
    );
    
    return matchesSearch && matchesType && matchesBounds;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Browse Properties</h1>
              <p className="text-muted-foreground">Find your perfect property from our listings</p>
            </div>
            {usingMockData && (
              <Badge variant="secondary" className="gap-1.5">
                <Sparkles className="h-3 w-3" />
                Sample Listings
              </Badge>
            )}
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
                <SelectItem value="shared">Shared</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="co_ownership">Co-ownership</SelectItem>
                <SelectItem value="auction">Auction</SelectItem>
                <SelectItem value="ppp">PPP</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={showMap ? 'default' : 'outline'}
              onClick={() => setShowMap(!showMap)}
            >
              <Map className="h-4 w-4 mr-2" />
              {showMap ? 'List View' : 'Map View'}
            </Button>
          </div>

          {showMap && (
            <ListingsMap
              listings={filteredListings}
              onBoundsChange={setMapBounds}
              lang={lang}
            />
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No properties found</p>
            </div>
          ) : showMap ? null : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map(listing => (
                <PropertyCard
                  key={listing.id}
                  listing={listing}
                  lang={lang}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
