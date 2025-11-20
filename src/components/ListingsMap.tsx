import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibXVsdGlsaXN0aW5nIiwiYSI6ImNtNXhoY3B4dTA4bWgycXM0azNwb2xrc3oifQ.Xxxx';

interface Listing {
  id: string;
  title_en: string;
  title_fr: string;
  latitude?: number;
  longitude?: number;
  price: number;
  city: string;
  province: string;
  image_urls?: string[];
}

interface ListingsMapProps {
  listings: Listing[];
  onBoundsChange?: (bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }) => void;
  lang: 'en' | 'fr';
}

export function ListingsMap({ listings, onBoundsChange, lang }: ListingsMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-79.3832, 43.6532], // Toronto
      zoom: 10,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Handle bounds change
    map.current.on('moveend', () => {
      if (!map.current || !onBoundsChange) return;
      
      const bounds = map.current.getBounds();
      onBoundsChange({
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLng: bounds.getWest(),
        maxLng: bounds.getEast(),
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update markers when listings change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Filter listings with valid coordinates
    const validListings = listings.filter(
      listing => listing.latitude && listing.longitude
    );

    if (validListings.length === 0) return;

    // Add new markers
    validListings.forEach(listing => {
      if (!listing.latitude || !listing.longitude) return;

      const title = lang === 'en' ? listing.title_en : listing.title_fr;
      const imageUrl = listing.image_urls?.[0] || '/placeholder.svg';

      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerHTML = `
        <div style="
          background: white;
          border: 2px solid #FF0000;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-weight: bold;
          color: #FF0000;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
          $
        </div>
      `;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([listing.longitude, listing.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="padding: 10px; max-width: 200px;">
              <img src="${imageUrl}" alt="${title}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />
              <h3 style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">${title}</h3>
              <p style="color: #FF0000; font-weight: bold; margin-bottom: 4px;">$${listing.price.toLocaleString()}</p>
              <p style="font-size: 12px; color: #666;">${listing.city}, ${listing.province}</p>
              <a href="/properties/${listing.id}" style="display: inline-block; margin-top: 8px; color: #FF0000; text-decoration: underline; font-size: 12px;">View Details</a>
            </div>`
          )
        )
        .addTo(map.current!);

      markers.current.push(marker);
    });

    // Fit map to show all markers
    if (validListings.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      validListings.forEach(listing => {
        if (listing.latitude && listing.longitude) {
          bounds.extend([listing.longitude, listing.latitude]);
        }
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [listings, mapLoaded, lang]);

  return (
    <Card className="overflow-hidden">
      <div ref={mapContainer} className="h-[500px]" />
    </Card>
  );
}
