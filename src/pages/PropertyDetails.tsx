import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Bed, Bath, Maximize, Calendar } from 'lucide-react';
import { Language } from '@/lib/i18n';

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
  const [listing, setListing] = useState<Listing | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [lang] = useState<Language>('en');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
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

      setLoading(false);
    };

    if (id) fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-12 px-4">
          <div className="container mx-auto">
            <p>Loading...</p>
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
          <div className="container mx-auto">
            <p>Listing not found</p>
          </div>
        </div>
      </div>
    );
  }

  const title = lang === 'en' ? listing.title_en : listing.title_fr;
  const description = lang === 'en' ? listing.description_en : listing.description_fr;
  const mainImage = listing.image_urls?.[selectedImage] || '/placeholder.svg';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 space-y-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <img
                src={mainImage}
                alt={title}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 left-4 text-lg">
                {listing.listing_type}
              </Badge>
            </div>
            {listing.image_urls && listing.image_urls.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {listing.image_urls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <img src={url} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">{title}</h1>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{listing.address_text}, {listing.city}, {listing.province}</span>
                </div>
                <div className="flex gap-6 text-lg">
                  {listing.bedrooms && (
                    <div className="flex items-center">
                      <Bed className="h-5 w-5 mr-2" />
                      <span>{listing.bedrooms} Beds</span>
                    </div>
                  )}
                  {listing.bathrooms && (
                    <div className="flex items-center">
                      <Bath className="h-5 w-5 mr-2" />
                      <span>{listing.bathrooms} Baths</span>
                    </div>
                  )}
                  {listing.property_size && (
                    <div className="flex items-center">
                      <Maximize className="h-5 w-5 mr-2" />
                      <span>{listing.property_size} sqft</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{description}</p>
              </div>

              {listing.amenities && listing.amenities.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                    <div className="flex flex-wrap gap-2">
                      {listing.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline">{amenity}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {units.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Available Units</h2>
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
                                  {unit.available ? 'Available' : 'Occupied'}
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-3xl font-bold">${listing.price.toLocaleString()}</p>
                    {listing.rent_frequency && (
                      <p className="text-sm text-muted-foreground">per {listing.rent_frequency}</p>
                    )}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium">{listing.listing_type}</span>
                    </div>
                    {listing.lot_size && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lot Size</span>
                        <span className="font-medium">{listing.lot_size} sqft</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Units</span>
                      <span className="font-medium">{listing.unit_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Listed</span>
                      <span className="font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(listing.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
