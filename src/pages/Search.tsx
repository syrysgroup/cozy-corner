import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PropertyCard } from '@/components/PropertyCard';
import { ListingsMap } from '@/components/ListingsMap';
import { SearchFiltersComponent, SearchFilters } from '@/components/SearchFilters';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Language } from '@/lib/i18n';
import { Search as SearchIcon, Map, Grid3X3, X, Sparkles } from 'lucide-react';
import { MOCK_PROPERTIES, convertMockToListing } from '@/data/mockData';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 12;

export default function Search() {
  const [lang] = useState<Language>('en');
  const [listings, setListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usingMockData, setUsingMockData] = useState(false);
  const [mapBounds, setMapBounds] = useState<{
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  } | null>(null);

  const [filters, setFilters] = useState<SearchFilters>({
    minPrice: '',
    maxPrice: '',
    bedrooms: 'any',
    bathrooms: 'any',
    listingType: 'all',
    city: '',
    hasImages: false,
    studentOnly: false,
    coOwnershipOnly: false,
  });

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [listings, filters, searchTerm, mapBounds]);

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

  const applyFilters = () => {
    let results = [...listings];

    // Search term
    if (searchTerm) {
      results = results.filter(listing =>
        listing.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.title_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.address_text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price range
    if (filters.minPrice) {
      results = results.filter(listing => listing.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      results = results.filter(listing => listing.price <= parseFloat(filters.maxPrice));
    }

    // Bedrooms
    if (filters.bedrooms !== 'any') {
      results = results.filter(listing => 
        listing.bedrooms && listing.bedrooms >= parseInt(filters.bedrooms)
      );
    }

    // Bathrooms
    if (filters.bathrooms !== 'any') {
      results = results.filter(listing => 
        listing.bathrooms && listing.bathrooms >= parseInt(filters.bathrooms)
      );
    }

    // Listing type
    if (filters.listingType !== 'all') {
      results = results.filter(listing => listing.listing_type === filters.listingType);
    }

    // City
    if (filters.city) {
      results = results.filter(listing =>
        listing.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Has images
    if (filters.hasImages) {
      results = results.filter(listing => 
        listing.image_urls && listing.image_urls.length > 0
      );
    }

    // Student housing
    if (filters.studentOnly) {
      results = results.filter(listing => listing.listing_type === 'student');
    }

    // Co-ownership
    if (filters.coOwnershipOnly) {
      results = results.filter(listing => listing.listing_type === 'co_ownership');
    }

    // Map bounds
    if (mapBounds && showMap) {
      results = results.filter(listing =>
        listing.latitude &&
        listing.longitude &&
        listing.latitude >= mapBounds.minLat &&
        listing.latitude <= mapBounds.maxLat &&
        listing.longitude >= mapBounds.minLng &&
        listing.longitude <= mapBounds.maxLng
      );
    }

    setFilteredListings(results);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      bedrooms: 'any',
      bathrooms: 'any',
      listingType: 'all',
      city: '',
      hasImages: false,
      studentOnly: false,
      coOwnershipOnly: false,
    });
    setSearchTerm('');
    setMapBounds(null);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.bedrooms !== 'any') count++;
    if (filters.bathrooms !== 'any') count++;
    if (filters.listingType !== 'all') count++;
    if (filters.city) count++;
    if (filters.hasImages) count++;
    if (filters.studentOnly) count++;
    if (filters.coOwnershipOnly) count++;
    return count;
  };

  const removeFilter = (key: keyof SearchFilters) => {
    if (key === 'minPrice' || key === 'maxPrice' || key === 'city') {
      setFilters({ ...filters, [key]: '' });
    } else if (key === 'bedrooms' || key === 'bathrooms') {
      setFilters({ ...filters, [key]: 'any' });
    } else if (key === 'listingType') {
      setFilters({ ...filters, [key]: 'all' });
    } else {
      setFilters({ ...filters, [key]: false });
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedListings = filteredListings.slice(startIndex, endIndex);

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Search Properties</h1>
              <p className="text-muted-foreground">
                Found {filteredListings.length} properties
              </p>
            </div>
            {usingMockData && (
              <Badge variant="secondary" className="gap-1.5">
                <Sparkles className="h-3 w-3" />
                Sample Listings
              </Badge>
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, city, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showMap ? 'default' : 'outline'}
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? <Grid3X3 className="h-4 w-4 mr-2" /> : <Map className="h-4 w-4 mr-2" />}
              {showMap ? 'List View' : 'Map View'}
            </Button>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {filters.minPrice && (
                <Badge variant="secondary">
                  Min: ${filters.minPrice}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => removeFilter('minPrice')}
                  />
                </Badge>
              )}
              {filters.maxPrice && (
                <Badge variant="secondary">
                  Max: ${filters.maxPrice}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => removeFilter('maxPrice')}
                  />
                </Badge>
              )}
              {filters.bedrooms !== 'any' && (
                <Badge variant="secondary">
                  {filters.bedrooms}+ Beds
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => removeFilter('bedrooms')}
                  />
                </Badge>
              )}
              {filters.bathrooms !== 'any' && (
                <Badge variant="secondary">
                  {filters.bathrooms}+ Baths
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => removeFilter('bathrooms')}
                  />
                </Badge>
              )}
              {filters.listingType !== 'all' && (
                <Badge variant="secondary">
                  {filters.listingType}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => removeFilter('listingType')}
                  />
                </Badge>
              )}
              {filters.city && (
                <Badge variant="secondary">
                  {filters.city}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => removeFilter('city')}
                  />
                </Badge>
              )}
              {filters.hasImages && (
                <Badge variant="secondary">
                  Has Images
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => removeFilter('hasImages')}
                  />
                </Badge>
              )}
              {filters.studentOnly && (
                <Badge variant="secondary">
                  Student Housing
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => removeFilter('studentOnly')}
                  />
                </Badge>
              )}
              {filters.coOwnershipOnly && (
                <Badge variant="secondary">
                  Co-ownership
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => removeFilter('coOwnershipOnly')}
                  />
                </Badge>
              )}
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <SearchFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
              />
            </div>

            {/* Results */}
            <div className="lg:col-span-3 space-y-6">
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
                  <p className="text-xl font-semibold mb-2">No properties found</p>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <>
                  {!showMap && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {paginatedListings.map(listing => (
                        <PropertyCard
                          key={listing.id}
                          listing={listing}
                          lang={lang}
                        />
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && !showMap && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
