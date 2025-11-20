import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

export interface SearchFilters {
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  listingType: string;
  city: string;
  hasImages: boolean;
  studentOnly: boolean;
  coOwnershipOnly: boolean;
}

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

const LISTING_TYPES = ['all', 'sale', 'rent', 'shared', 'student', 'co_ownership', 'auction', 'ppp'];

export function SearchFiltersComponent({ filters, onFiltersChange, onClearFilters }: SearchFiltersProps) {
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = 
    filters.minPrice || 
    filters.maxPrice || 
    filters.bedrooms !== 'any' || 
    filters.bathrooms !== 'any' ||
    filters.listingType !== 'all' ||
    filters.city ||
    filters.hasImages ||
    filters.studentOnly ||
    filters.coOwnershipOnly;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => updateFilter('minPrice', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
            />
          </div>
        </div>

        <Separator />

        {/* Bedrooms */}
        <div className="space-y-2">
          <Label>Bedrooms</Label>
          <Select value={filters.bedrooms} onValueChange={(value) => updateFilter('bedrooms', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bathrooms */}
        <div className="space-y-2">
          <Label>Bathrooms</Label>
          <Select value={filters.bathrooms} onValueChange={(value) => updateFilter('bathrooms', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Listing Type */}
        <div className="space-y-2">
          <Label>Listing Type</Label>
          <Select value={filters.listingType} onValueChange={(value) => updateFilter('listingType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LISTING_TYPES.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label>City</Label>
          <Input
            placeholder="Enter city name..."
            value={filters.city}
            onChange={(e) => updateFilter('city', e.target.value)}
          />
        </div>

        <Separator />

        {/* Checkboxes */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasImages"
              checked={filters.hasImages}
              onCheckedChange={(checked) => updateFilter('hasImages', checked)}
            />
            <Label htmlFor="hasImages" className="cursor-pointer font-normal">
              Has Images
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="studentOnly"
              checked={filters.studentOnly}
              onCheckedChange={(checked) => updateFilter('studentOnly', checked)}
            />
            <Label htmlFor="studentOnly" className="cursor-pointer font-normal">
              Student Housing Only
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="coOwnershipOnly"
              checked={filters.coOwnershipOnly}
              onCheckedChange={(checked) => updateFilter('coOwnershipOnly', checked)}
            />
            <Label htmlFor="coOwnershipOnly" className="cursor-pointer font-normal">
              Co-ownership Only
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
