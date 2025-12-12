import { useCompare } from '@/contexts/CompareContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { X, Scale, Bed, Bath, Maximize, MapPin, Trash2 } from 'lucide-react';
import { Language } from '@/lib/i18n';
import { Link } from 'react-router-dom';

interface CompareDrawerProps {
  lang: Language;
}

export function CompareDrawer({ lang }: CompareDrawerProps) {
  const { compareList, removeFromCompare, clearCompare, maxCompare } = useCompare();

  if (compareList.length === 0) return null;

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

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="lg" className="shadow-lg gap-2 px-6">
            <Scale className="h-5 w-5" />
            {lang === 'fr' ? 'Comparer' : 'Compare'} ({compareList.length}/{maxCompare})
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] overflow-auto">
          <SheetHeader className="mb-6">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl">
                {lang === 'fr' ? 'Comparer les propriétés' : 'Compare Properties'}
              </SheetTitle>
              <Button variant="ghost" size="sm" onClick={clearCompare}>
                <Trash2 className="h-4 w-4 mr-2" />
                {lang === 'fr' ? 'Effacer tout' : 'Clear All'}
              </Button>
            </div>
          </SheetHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {compareList.map((property) => {
              const title = lang === 'fr' ? property.title_fr : property.title_en;
              
              return (
                <div key={property.id} className="relative border rounded-lg overflow-hidden bg-card">
                  <button
                    onClick={() => removeFromCompare(property.id)}
                    className="absolute top-2 right-2 z-10 p-1.5 bg-background/90 rounded-full hover:bg-background"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  <div className="h-40 overflow-hidden">
                    <img
                      src={property.image_urls?.[0] || '/placeholder.svg'}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">{property.listing_type}</Badge>
                      <h3 className="font-semibold line-clamp-2">{title}</h3>
                    </div>
                    
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(property.price, property.listing_type)}
                    </p>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {property.city}, {property.province}
                    </div>
                    
                    <div className="flex gap-3 text-sm">
                      {property.bedrooms && (
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4 text-muted-foreground" />
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4 text-muted-foreground" />
                          <span>{property.bathrooms}</span>
                        </div>
                      )}
                      {property.property_size && (
                        <div className="flex items-center gap-1">
                          <Maximize className="h-4 w-4 text-muted-foreground" />
                          <span>{property.property_size}</span>
                        </div>
                      )}
                    </div>

                    {property.amenities && property.amenities.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-1">
                          {lang === 'fr' ? 'Commodités' : 'Amenities'}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {property.amenities.slice(0, 3).map((amenity, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {property.amenities.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{property.amenities.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <Link to={`/properties/${property.id}`}>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        {lang === 'fr' ? 'Voir détails' : 'View Details'}
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparison Table */}
          {compareList.length > 1 && (
            <div className="mt-8 overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4">
                {lang === 'fr' ? 'Tableau comparatif' : 'Comparison Table'}
              </h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 bg-muted/50">{lang === 'fr' ? 'Caractéristique' : 'Feature'}</th>
                    {compareList.map(p => (
                      <th key={p.id} className="text-left p-3 bg-muted/50 min-w-[150px]">
                        {(lang === 'fr' ? p.title_fr : p.title_en).slice(0, 25)}...
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">{lang === 'fr' ? 'Prix' : 'Price'}</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3 font-bold text-primary">
                        {formatPrice(p.price, p.listing_type)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">{lang === 'fr' ? 'Type' : 'Type'}</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3">{p.listing_type}</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">{lang === 'fr' ? 'Chambres' : 'Bedrooms'}</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3">{p.bedrooms || '-'}</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">{lang === 'fr' ? 'Salles de bain' : 'Bathrooms'}</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3">{p.bathrooms || '-'}</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">{lang === 'fr' ? 'Superficie' : 'Size'}</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3">
                        {p.property_size ? `${p.property_size.toLocaleString()} sqft` : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">{lang === 'fr' ? 'Ville' : 'City'}</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3">{p.city}, {p.province}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
