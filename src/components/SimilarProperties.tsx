import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Scale, Check } from 'lucide-react';
import { Language } from '@/lib/i18n';
import { useCompare, CompareProperty } from '@/contexts/CompareContext';

interface Property {
  id: string;
  title_en: string;
  title_fr: string;
  price: number;
  listing_type: string;
  city: string;
  province: string;
  image_urls: string[];
  bedrooms?: number;
  bathrooms?: number;
  property_size?: number;
  amenities?: string[];
}

interface SimilarPropertiesProps {
  properties: Property[];
  lang: Language;
  currentPropertyId: string;
}

export function SimilarProperties({ properties, lang, currentPropertyId }: SimilarPropertiesProps) {
  const { addToCompare, removeFromCompare, isInCompare, compareList, maxCompare } = useCompare();
  
  const similarProps = properties
    .filter(p => p.id !== currentPropertyId)
    .slice(0, 4);

  if (similarProps.length === 0) return null;

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat(lang === 'fr' ? 'fr-CA' : 'en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
    }).format(price);

    if (type === 'rent' || type === 'student' || type === 'shared') {
      return `${formatted}/${lang === 'fr' ? 'mois' : 'mo'}`;
    }
    return formatted;
  };

  const handleCompareToggle = (property: Property) => {
    const compareProperty: CompareProperty = {
      id: property.id,
      title_en: property.title_en,
      title_fr: property.title_fr,
      price: property.price,
      listing_type: property.listing_type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      property_size: property.property_size,
      city: property.city,
      province: property.province,
      image_urls: property.image_urls,
      amenities: property.amenities,
    };

    if (isInCompare(property.id)) {
      removeFromCompare(property.id);
    } else {
      addToCompare(compareProperty);
    }
  };

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-6">
        {lang === 'fr' ? 'Propriétés similaires' : 'Similar Properties'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {similarProps.map((property) => {
          const title = lang === 'fr' ? property.title_fr : property.title_en;
          const inCompare = isInCompare(property.id);
          const canAddMore = compareList.length < maxCompare;
          
          return (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={property.image_urls?.[0] || '/placeholder.svg'}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-2 left-2">
                  {property.listing_type}
                </Badge>
                
                {/* Compare button */}
                <Button
                  variant={inCompare ? 'default' : 'secondary'}
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCompareToggle(property);
                  }}
                  disabled={!inCompare && !canAddMore}
                >
                  {inCompare ? (
                    <><Check className="h-3 w-3 mr-1" /> {lang === 'fr' ? 'Ajouté' : 'Added'}</>
                  ) : (
                    <><Scale className="h-3 w-3 mr-1" /> {lang === 'fr' ? 'Comparer' : 'Compare'}</>
                  )}
                </Button>
              </div>
              
              <CardContent className="p-4">
                <Link to={`/properties/${property.id}`}>
                  <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors">
                    {title}
                  </h3>
                </Link>
                
                <p className="text-lg font-bold text-primary mt-1">
                  {formatPrice(property.price, property.listing_type)}
                </p>
                
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  {property.city}
                </div>
                
                <div className="flex gap-3 text-sm text-muted-foreground mt-2">
                  {property.bedrooms && (
                    <div className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      {property.bedrooms}
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      {property.bathrooms}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
