import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Bed, Bath, Maximize, Calendar, Share2, Heart, Scale, Check, ArrowLeft, Star } from 'lucide-react';
import { Language } from '@/lib/i18n';
import { PropertyMap } from '@/components/PropertyMap';
import { ImageGallery } from '@/components/ImageGallery';
import { ContactAgentForm } from '@/components/ContactAgentForm';
import { SimilarProperties } from '@/components/SimilarProperties';
import { SaveListingButton } from '@/components/SaveListingButton';
import { useCompare, CompareProperty } from '@/contexts/CompareContext';
import { MOCK_PROPERTIES, MOCK_AGENTS, getPropertyTitle, getPropertyDescription, convertMockToListing } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface Listing {
  id: string;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  price: number;
  listing_type: string;
  rent_frequency?: string;
  address_text: string;
  city: string;
  province: string;
  image_urls: string[];
  bedrooms?: number;
  bathrooms?: number;
  property_size?: number;
  lot_size?: number;
  amenities: string[];
  unit_count: number;
  created_at: string;
  latitude?: number;
  longitude?: number;
  formatted_address?: string;
}

interface Unit {
  id: string;
  unit_name: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  available: boolean;
}

export default function PropertyDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const [listing, setListing] = useState<Listing | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [agent, setAgent] = useState<typeof MOCK_AGENTS[0] | null>(null);
  const [lang] = useState<Language>('en');
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  
  const { addToCompare, removeFromCompare, isInCompare, compareList, maxCompare } = useCompare();

  useEffect(() => {
    const fetchListing = async () => {
      // First try to find in mock data
      const mockProperty = MOCK_PROPERTIES.find(p => p.id === id);
      
      if (mockProperty) {
        // Use mock data
        const converted = convertMockToListing(mockProperty) as Listing;
        setListing(converted);
        setAllListings(MOCK_PROPERTIES.map(convertMockToListing));
        
        // Find associated agent
        const mockAgent = MOCK_AGENTS.find(a => a.id === mockProperty.agent_id);
        if (mockAgent) setAgent(mockAgent);
        
        setUsingMockData(true);
        setLoading(false);
        return;
      }

      // Try database
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Error fetching listing:', error);
        setLoading(false);
        return;
      }

      setListing(data);

      if (data.unit_count > 1) {
        const { data: unitsData } = await supabase
          .from('listing_units')
          .select('*')
          .eq('listing_id', id);

        if (unitsData) setUnits(unitsData);
      }

      // Fetch all listings for similar properties
      const { data: allData } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'published')
        .limit(10);
      
      if (allData) setAllListings(allData);

      setLoading(false);
    };

    if (id) fetchListing();
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: listing ? getPropertyTitle(listing as any, lang) : 'Property',
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: lang === 'fr' ? 'Lien copié!' : 'Link copied!',
        description: lang === 'fr' ? 'Le lien a été copié dans le presse-papier.' : 'The link has been copied to your clipboard.',
      });
    }
  };

  const handleCompareToggle = () => {
    if (!listing) return;
    
    const compareProperty: CompareProperty = {
      id: listing.id,
      title_en: listing.title_en,
      title_fr: listing.title_fr,
      price: listing.price,
      listing_type: listing.listing_type,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      property_size: listing.property_size,
      city: listing.city,
      province: listing.province,
      image_urls: listing.image_urls,
      amenities: listing.amenities,
    };

    if (isInCompare(listing.id)) {
      removeFromCompare(listing.id);
    } else {
      addToCompare(compareProperty);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-12 px-4">
          <div className="container mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-[500px] bg-muted rounded-xl" />
              <div className="h-8 w-1/2 bg-muted rounded" />
              <div className="h-4 w-1/3 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-12 px-4">
          <div className="container mx-auto text-center py-20">
            <h1 className="text-2xl font-bold mb-4">
              {lang === 'fr' ? 'Propriété non trouvée' : 'Property not found'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {lang === 'fr' 
                ? 'La propriété que vous recherchez n\'existe pas ou a été supprimée.'
                : 'The property you are looking for does not exist or has been removed.'}
            </p>
            <Link to="/properties">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {lang === 'fr' ? 'Retour aux propriétés' : 'Back to Properties'}
              </Button>
            </Link>
          </div>
        </div>
        <Footer lang={lang} />
      </div>
    );
  }

  const title = lang === 'en' ? listing.title_en : listing.title_fr;
  const description = lang === 'en' ? listing.description_en : listing.description_fr;
  const inCompare = isInCompare(listing.id);
  const canAddMore = compareList.length < maxCompare;

  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat(lang === 'fr' ? 'fr-CA' : 'en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
    }).format(price);

    if (listing.listing_type === 'rent' || listing.listing_type === 'student' || listing.listing_type === 'shared') {
      return `${formatted}/${lang === 'fr' ? 'mois' : 'mo'}`;
    }
    return formatted;
  };

  const getListingTypeBadge = (type: string) => {
    const labels: Record<string, { en: string; fr: string }> = {
      sale: { en: "For Sale", fr: "À vendre" },
      rent: { en: "For Rent", fr: "À louer" },
      student: { en: "Student Housing", fr: "Logement étudiant" },
      shared: { en: "Shared Living", fr: "Colocation" },
      co_ownership: { en: "Co-ownership", fr: "Copropriété" },
      auction: { en: "Auction", fr: "Enchères" },
    };
    return labels[type]?.[lang] || type;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center justify-between">
            <Link to="/properties" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {lang === 'fr' ? 'Retour aux propriétés' : 'Back to Properties'}
            </Link>
            
            {usingMockData && (
              <Badge variant="secondary" className="gap-1">
                Sample Listing
              </Badge>
            )}
          </div>

          {/* Image Gallery */}
          <div className="mb-8">
            <ImageGallery images={listing.image_urls || []} title={title} />
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6 p-4 bg-muted/50 rounded-lg">
            <Badge variant="default" className="text-sm px-3 py-1">
              {getListingTypeBadge(listing.listing_type)}
            </Badge>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                {lang === 'fr' ? 'Partager' : 'Share'}
              </Button>
              
              <SaveListingButton listingId={listing.id} variant="outline" />
              
              <Button 
                variant={inCompare ? 'default' : 'outline'} 
                size="sm"
                onClick={handleCompareToggle}
                disabled={!inCompare && !canAddMore}
              >
                {inCompare ? (
                  <><Check className="h-4 w-4 mr-2" /> {lang === 'fr' ? 'Dans la comparaison' : 'In Compare'}</>
                ) : (
                  <><Scale className="h-4 w-4 mr-2" /> {lang === 'fr' ? 'Comparer' : 'Compare'}</>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Basic Info */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
                <div className="flex items-center text-muted-foreground mb-6">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  <span>{listing.address_text}, {listing.city}, {listing.province}</span>
                </div>
                
                <div className="flex flex-wrap gap-6 text-lg">
                  {listing.bedrooms !== undefined && listing.bedrooms !== null && (
                    <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                      <Bed className="h-5 w-5 text-primary" />
                      <span className="font-medium">{listing.bedrooms}</span>
                      <span className="text-muted-foreground text-sm">
                        {lang === 'fr' ? 'Chambres' : 'Beds'}
                      </span>
                    </div>
                  )}
                  {listing.bathrooms !== undefined && listing.bathrooms !== null && (
                    <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                      <Bath className="h-5 w-5 text-primary" />
                      <span className="font-medium">{listing.bathrooms}</span>
                      <span className="text-muted-foreground text-sm">
                        {lang === 'fr' ? 'Salles de bain' : 'Baths'}
                      </span>
                    </div>
                  )}
                  {listing.property_size && (
                    <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                      <Maximize className="h-5 w-5 text-primary" />
                      <span className="font-medium">{listing.property_size.toLocaleString()}</span>
                      <span className="text-muted-foreground text-sm">sqft</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {lang === 'fr' ? 'Description' : 'Description'}
                </h2>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Amenities */}
              {listing.amenities && listing.amenities.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      {lang === 'fr' ? 'Commodités' : 'Amenities'}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {listing.amenities.map((amenity, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
                        >
                          <Check className="h-4 w-4 text-secondary" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Units */}
              {units.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      {lang === 'fr' ? 'Unités disponibles' : 'Available Units'}
                    </h2>
                    <div className="space-y-4">
                      {units.map(unit => (
                        <Card key={unit.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-bold text-lg">{unit.unit_name}</h3>
                                <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                  {unit.bedrooms && <span>{unit.bedrooms} Beds</span>}
                                  {unit.bathrooms && <span>{unit.bathrooms} Baths</span>}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold">${unit.price.toLocaleString()}</p>
                                <Badge variant={unit.available ? 'default' : 'secondary'}>
                                  {unit.available 
                                    ? (lang === 'fr' ? 'Disponible' : 'Available')
                                    : (lang === 'fr' ? 'Occupé' : 'Occupied')
                                  }
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Map */}
              {listing.latitude && listing.longitude && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      {lang === 'fr' ? 'Emplacement' : 'Location'}
                    </h2>
                    <PropertyMap
                      latitude={listing.latitude}
                      longitude={listing.longitude}
                      address={listing.formatted_address || listing.address_text}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-3xl md:text-4xl font-bold text-primary">
                      {formatPrice(listing.price)}
                    </p>
                    {listing.rent_frequency && (
                      <p className="text-sm text-muted-foreground">
                        {lang === 'fr' ? 'par' : 'per'} {listing.rent_frequency}
                      </p>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {lang === 'fr' ? 'Type' : 'Type'}
                      </span>
                      <span className="font-medium">{getListingTypeBadge(listing.listing_type)}</span>
                    </div>
                    {listing.lot_size && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {lang === 'fr' ? 'Taille du terrain' : 'Lot Size'}
                        </span>
                        <span className="font-medium">{listing.lot_size.toLocaleString()} sqft</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {lang === 'fr' ? 'Unités' : 'Units'}
                      </span>
                      <span className="font-medium">{listing.unit_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {lang === 'fr' ? 'Publié le' : 'Listed'}
                      </span>
                      <span className="font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(listing.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Form */}
              <ContactAgentForm 
                agent={agent ? {
                  name: agent.name,
                  email: agent.email,
                  phone: agent.phone,
                  avatar: agent.avatar,
                } : undefined}
                propertyTitle={title}
                lang={lang}
              />

              {/* Agent Card (if available) */}
              {agent && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <img 
                        src={agent.avatar} 
                        alt={agent.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-lg">{agent.name}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span>{agent.rating}</span>
                          <span>({agent.reviews_count} reviews)</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{agent.city}, {agent.province}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {agent.specialties.map((specialty, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Similar Properties */}
          {allListings.length > 0 && (
            <>
              <Separator className="my-12" />
              <SimilarProperties 
                properties={allListings} 
                lang={lang} 
                currentPropertyId={listing.id} 
              />
            </>
          )}
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
