// Google Maps Wrapper Component for Iraqi Dental Platform
// Provides reusable map functionality across landing page, medical services, and jobs

import React, { useState, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { MapPin, Phone, Star, Clock, Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Iraq center coordinates
const IRAQ_CENTER = { lat: 33.3152, lng: 44.3661 };

export interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  titleAr: string;
  description?: string;
  address: string;
  addressAr: string;
  phone?: string;
  rating?: number;
  isOpen?: boolean;
  link?: string;
  type: 'clinic' | 'job';
  icon?: string;
  badge?: string;
}

interface GoogleMapWrapperProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  showUserLocation?: boolean;
  mapId?: string;
}

export default function GoogleMapWrapper({
  markers,
  center = IRAQ_CENTER,
  zoom = 7,
  height = '500px',
  onMarkerClick,
  showUserLocation = false,
  mapId = 'iraqi-dental-map'
}: GoogleMapWrapperProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Initialize user location if requested
  React.useEffect(() => {
    if (showUserLocation) {
      getUserLocation();
    }
  }, [showUserLocation, getUserLocation]);

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  };

  // If no API key, show placeholder
  if (!API_KEY) {
    return (
      <div 
        className="w-full bg-gray-100 rounded-lg flex items-center justify-center flex-col gap-3"
        style={{ height }}
      >
        <MapPin className="w-12 h-12 text-gray-400" />
        <p className="text-gray-600 text-center px-4" dir="rtl">
          يرجى إضافة مفتاح Google Maps API لعرض الخريطة التفاعلية
        </p>
        <p className="text-sm text-gray-500">VITE_GOOGLE_MAPS_API_KEY</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg border border-gray-200" style={{ height }}>
      <APIProvider apiKey={API_KEY}>
        <Map
          mapId={mapId}
          defaultCenter={center}
          defaultZoom={zoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          zoomControl={true}
          streetViewControl={false}
          mapTypeControl={false}
          fullscreenControl={true}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Render markers */}
          {markers.map((marker) => (
            <AdvancedMarker
              key={marker.id}
              position={marker.position}
              onClick={() => handleMarkerClick(marker)}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer
                transform transition-transform hover:scale-110
                ${marker.type === 'clinic' ? 'bg-blue-600' : 'bg-green-600'}
              `}>
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </AdvancedMarker>
          ))}

          {/* User location marker */}
          {userLocation && (
            <AdvancedMarker position={userLocation}>
              <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg animate-pulse" />
            </AdvancedMarker>
          )}

          {/* Info window for selected marker */}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <Card className="p-4 min-w-[280px] max-w-sm border-0 shadow-none" dir="rtl">
                <div className="space-y-3">
                  {/* Title */}
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {selectedMarker.titleAr}
                    </h3>
                    {selectedMarker.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {selectedMarker.badge}
                      </Badge>
                    )}
                  </div>

                  {/* Rating */}
                  {selectedMarker.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{selectedMarker.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-600">(تقييم)</span>
                    </div>
                  )}

                  {/* Address */}
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
                    <span>{selectedMarker.addressAr}</span>
                  </div>

                  {/* Phone */}
                  {selectedMarker.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <a href={`tel:${selectedMarker.phone}`} className="hover:text-blue-600">
                        {selectedMarker.phone}
                      </a>
                    </div>
                  )}

                  {/* Status */}
                  {selectedMarker.isOpen !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className={selectedMarker.isOpen ? 'text-green-600 font-medium' : 'text-red-600'}>
                        {selectedMarker.isOpen ? 'مفتوح الآن' : 'مغلق'}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  {selectedMarker.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {selectedMarker.description}
                    </p>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-2">
                    {selectedMarker.link && (
                      <Button size="sm" className="flex-1" asChild>
                        <a href={selectedMarker.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 ml-2" />
                          عرض التفاصيل
                        </a>
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.position.lat},${selectedMarker.position.lng}`;
                        window.open(url, '_blank');
                      }}
                    >
                      <Navigation className="w-4 h-4 ml-2" />
                      اتجاهات
                    </Button>
                  </div>
                </div>
              </Card>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
