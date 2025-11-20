import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MapPin, Search } from 'lucide-react';

// You'll need to set your Mapbox token
// Get it from https://account.mapbox.com/access-tokens/
const MAPBOX_TOKEN = 'pk.eyJ1IjoibXVsdGlsaXN0aW5nIiwiYSI6ImNtNXhoY3B4dTA4bWgycXM0azNwb2xrc3oifQ.Xxxx'; // This will be replaced

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (lat: number, lng: number, address: string) => void;
}

export function MapPicker({ initialLat = 43.6532, initialLng = -79.3832, onLocationChange }: MapPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchAddress, setSearchAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [initialLng, initialLat],
      zoom: 13,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Create draggable marker
    marker.current = new mapboxgl.Marker({
      draggable: true,
      color: '#FF0000'
    })
      .setLngLat([initialLng, initialLat])
      .addTo(map.current);

    // Handle marker drag end
    marker.current.on('dragend', async () => {
      if (!marker.current) return;
      const lngLat = marker.current.getLngLat();
      await reverseGeocode(lngLat.lat, lngLat.lng);
    });

    // Handle map click
    map.current.on('click', async (e) => {
      if (!marker.current) return;
      marker.current.setLngLat([e.lngLat.lng, e.lngLat.lat]);
      await reverseGeocode(e.lngLat.lat, e.lngLat.lng);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('geocode', {
        body: {
          action: 'reverse',
          latitude: lat,
          longitude: lng
        }
      });

      if (error) throw error;

      if (data && data.formatted_address) {
        onLocationChange(lat, lng, data.formatted_address);
        toast.success('Location updated');
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      toast.error('Failed to get address');
    }
  };

  const handleSearch = async () => {
    if (!searchAddress.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('geocode', {
        body: {
          action: 'forward',
          address: searchAddress
        }
      });

      if (error) throw error;

      if (data && data.latitude && data.longitude) {
        const { latitude, longitude, formatted_address } = data;
        
        if (map.current && marker.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 15
          });
          marker.current.setLngLat([longitude, latitude]);
        }
        
        onLocationChange(latitude, longitude, formatted_address);
        toast.success('Location found');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Location not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Property Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Search Address</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter address to search..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Or click/drag the marker on the map
          </p>
        </div>
        <div ref={mapContainer} className="h-[400px] rounded-lg border" />
      </CardContent>
    </Card>
  );
}
