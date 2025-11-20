import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Maximize, Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Language } from '@/lib/i18n';
import { SaveListingButton } from '@/components/SaveListingButton';

interface PropertyCardProps {
  listing: {
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
    status: string;
  };
  lang: Language;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PropertyCard({ listing, lang, isOwner, onEdit, onDelete }: PropertyCardProps) {
  const title = lang === 'en' ? listing.title_en : listing.title_fr;
  const imageUrl = listing.image_urls?.[0] || '/placeholder.svg';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 left-2">
          {listing.listing_type}
        </Badge>
        {listing.status !== 'published' && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            {listing.status}
          </Badge>
        )}
        <div className="absolute top-2 right-2">
          <SaveListingButton listingId={listing.id} />
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-2 line-clamp-1">{title}</h3>
        <p className="text-2xl font-bold text-primary mb-2">
          ${listing.price.toLocaleString()}
        </p>
        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{listing.city}, {listing.province}</span>
        </div>
        <div className="flex gap-4 text-sm">
          {listing.bedrooms && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{listing.bedrooms}</span>
            </div>
          )}
          {listing.bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{listing.bathrooms}</span>
            </div>
          )}
          {listing.property_size && (
            <div className="flex items-center">
              <Maximize className="h-4 w-4 mr-1" />
              <span>{listing.property_size} sqft</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link to={`/properties/${listing.id}`} className="flex-1">
          <Button variant="default" className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            {lang === 'en' ? 'View' : 'Voir'}
          </Button>
        </Link>
        {isOwner && (
          <>
            <Button variant="outline" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
