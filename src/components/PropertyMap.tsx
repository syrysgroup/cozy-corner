import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibXVsdGlsaXN0aW5nIiwiYSI6ImNtNXhoY3B4dTA4bWgycXM0azNwb2xrc3oifQ.Xxxx';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  address?: string;
  zoom?: number;
  height?: string;
}

export function PropertyMap({ latitude, longitude, address, zoom = 14, height = '400px' }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !latitude || !longitude) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: zoom,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add marker
    new mapboxgl.Marker({ color: '#FF0000' })
      .setLngLat([longitude, latitude])
      .setPopup(
        new mapboxgl.Popup().setHTML(
          `<div class="p-2">
            <p class="font-semibold">${address || 'Property Location'}</p>
          </div>`
        )
      )
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, address, zoom]);

  if (!latitude || !longitude) {
    return (
      <div className="flex items-center justify-center bg-muted rounded-lg" style={{ height }}>
        <p className="text-muted-foreground">No location data available</p>
      </div>
    );
  }

  return <div ref={mapContainer} className="rounded-lg" style={{ height }} />;
}
