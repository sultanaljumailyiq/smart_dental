import React, { useState, useEffect } from "react";
import { MapPin, Phone, Star, Navigation, Clock, Shield, Search } from "lucide-react";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const IRAQ_CENTER = { lat: 33.3152, lng: 44.3661 };

interface Clinic {
  id: number;
  name: string;
  arabicName: string;
  specialty?: string;
  governorate: string;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  latitude: number;
  longitude: number;
  subscriptionTier?: string;
  priorityLevel: number;
  isPromoted: boolean;
  isActive: boolean;
  openingHours?: string;
  distance?: number;
  status?: "online" | "offline" | "busy";
  image?: string;
}

export default function ClinicFinderCard() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetchClinics();
  }, []);

  useEffect(() => {
    const filtered = clinics.filter(
      (clinic) =>
        clinic.arabicName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.specialty?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredClinics(filtered);
  }, [searchQuery, clinics]);

  const fetchClinics = async () => {
    setLoading(true);
    setError(null);

    // Try to get user location first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Success: fetch with distance mode
          try {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setUserLocation({ lat, lng });

            const params = new URLSearchParams({
              userLat: lat.toString(),
              userLng: lng.toString(),
              radiusKm: '50',
              mode: 'distance',
              limit: '20'
            });
            
            const response = await fetch(`/api/clinics?${params.toString()}`);
            if (!response.ok) throw new Error('فشل تحميل العيادات');
            
            const data = await response.json();
            setClinics(data);
            setFilteredClinics(data);
            if (data.length > 0) setSelectedClinic(data[0]);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ');
            console.error('Error fetching clinics:', err);
          } finally {
            setLoading(false);
          }
        },
        async (err) => {
          // Failed to get location: fetch promoted clinics
          console.warn('Geolocation failed, loading promoted clinics:', err);
          try {
            const params = new URLSearchParams({
              mode: 'promoted',
              limit: '20'
            });
            
            const response = await fetch(`/api/clinics?${params.toString()}`);
            if (!response.ok) throw new Error('فشل تحميل العيادات');
            
            const data = await response.json();
            setClinics(data);
            setFilteredClinics(data);
            if (data.length > 0) setSelectedClinic(data[0]);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ');
            console.error('Error fetching clinics:', err);
          } finally {
            setLoading(false);
          }
        },
        { timeout: 5000 } // 5 second timeout
      );
    } else {
      // No geolocation support: fetch promoted clinics
      try {
        const params = new URLSearchParams({
          mode: 'promoted',
          limit: '20'
        });
        
        const response = await fetch(`/api/clinics?${params.toString()}`);
        if (!response.ok) throw new Error('فشل تحميل العيادات');
        
        const data = await response.json();
        setClinics(data);
        setFilteredClinics(data);
        if (data.length > 0) setSelectedClinic(data[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ');
        console.error('Error fetching clinics:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return "bg-green-400";
      case "busy":
        return "bg-yellow-400";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "online":
        return "متاح الآن";
      case "busy":
        return "مشغول";
      case "offline":
        return "غير متاح";
      default:
        return "غير معروف";
    }
  };

  const handleGetDirections = (clinic: Clinic) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${clinic.latitude},${clinic.longitude}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-lg overflow-hidden h-[450px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل العيادات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-lg overflow-hidden h-[450px] flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchClinics}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-lg overflow-hidden h-[450px]">
      <div className="flex h-full flex-col md:flex-row">
        {/* Clinics List */}
        <div className="w-full md:w-1/3 border-b md:border-r md:border-b-0 border-gray-200 flex flex-col max-h-[200px] md:max-h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              العيادات القريبة منك
            </h3>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن عيادة أو تخصص..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Clinics List */}
          <div className="flex-1 overflow-y-auto">
            {filteredClinics.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                لا توجد عيادات متطابقة
              </div>
            ) : (
              filteredClinics.map((clinic) => (
                <div
                  key={clinic.id}
                  onClick={() => setSelectedClinic(clinic)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedClinic?.id === clinic.id
                      ? "bg-blue-50 border-blue-200"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      {clinic.image ? (
                        <img
                          src={clinic.image}
                          alt={clinic.arabicName || clinic.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {(clinic.arabicName || clinic.name).charAt(0)}
                        </div>
                      )}
                      {clinic.status && (
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                            clinic.status,
                          )} rounded-full border-2 border-white`}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {clinic.arabicName || clinic.name}
                        </h4>
                        {clinic.distance && (
                          <span className="text-xs text-gray-500">
                            {clinic.distance.toFixed(1)} كم
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 mb-1 truncate">
                        {clinic.city}, {clinic.governorate}
                      </p>

                      <div className="flex items-center justify-between mb-2">
                        {clinic.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-700">
                              {clinic.rating.toFixed(1)}
                            </span>
                            {clinic.reviewCount && (
                              <span className="text-xs text-gray-500">
                                ({clinic.reviewCount})
                              </span>
                            )}
                          </div>
                        )}
                        {clinic.isPromoted && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            مميزة
                          </span>
                        )}
                      </div>

                      {clinic.specialty && (
                        <div className="flex flex-wrap gap-1">
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                            {clinic.specialty}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Interactive Google Map */}
        <div className="flex-1 relative min-h-[250px] md:min-h-0">
          {!API_KEY ? (
            // Fallback if no API key
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">يرجى إضافة مفتاح Google Maps API</p>
                <p className="text-sm text-gray-500 mt-2">VITE_GOOGLE_MAPS_API_KEY</p>
              </div>
            </div>
          ) : (
            <APIProvider apiKey={API_KEY}>
              <Map
                mapId="clinic-finder-map"
                defaultCenter={userLocation || IRAQ_CENTER}
                defaultZoom={userLocation ? 12 : 7}
                gestureHandling="greedy"
                disableDefaultUI={false}
                zoomControl={true}
                streetViewControl={false}
                mapTypeControl={false}
                fullscreenControl={true}
                style={{ width: '100%', height: '100%' }}
              >
                {/* User location marker */}
                {userLocation && (
                  <AdvancedMarker position={userLocation}>
                    <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg animate-pulse" />
                  </AdvancedMarker>
                )}

                {/* Clinic markers */}
                {filteredClinics.map((clinic) => (
                  <AdvancedMarker
                    key={clinic.id}
                    position={{ lat: clinic.latitude, lng: clinic.longitude }}
                    onClick={() => setSelectedClinic(clinic)}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full border-2 border-white shadow-lg transition-all hover:scale-110 flex items-center justify-center cursor-pointer",
                        selectedClinic?.id === clinic.id
                          ? "bg-blue-600 scale-110 z-20"
                          : clinic.isPromoted
                          ? "bg-purple-500 z-10"
                          : "bg-red-500 z-10"
                      )}
                    >
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                  </AdvancedMarker>
                ))}

                {/* Info window - displayed separately from markers */}
              </Map>
            </APIProvider>
          )}

          {/* Selected Clinic Info Card - Square Shape */}
          {selectedClinic && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-80 bg-white rounded-xl shadow-xl p-6 z-[120] max-h-[calc(100%-2rem)] overflow-y-auto">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  {selectedClinic.image ? (
                    <img
                      src={selectedClinic.image}
                      alt={selectedClinic.arabicName || selectedClinic.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                      {(selectedClinic.arabicName || selectedClinic.name).charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {selectedClinic.arabicName || selectedClinic.name}
                    </h4>
                    {selectedClinic.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium text-gray-900">
                          {selectedClinic.rating.toFixed(1)}
                        </span>
                        {selectedClinic.reviewCount && (
                          <span className="text-sm text-gray-600">
                            ({selectedClinic.reviewCount} تقييم)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {selectedClinic.specialty && (
                  <p className="text-sm text-gray-700 font-medium mb-3">
                    {selectedClinic.specialty}
                  </p>
                )}

                <p className="text-gray-600 text-sm mb-2 flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{selectedClinic.city}, {selectedClinic.governorate}</span>
                </p>

                {selectedClinic.distance && (
                  <p className="text-blue-600 text-sm font-medium mb-3">
                    {selectedClinic.distance.toFixed(1)} كم من موقعك
                  </p>
                )}

                <div className="flex flex-col gap-2 mb-4">
                  {selectedClinic.openingHours && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {selectedClinic.openingHours}
                    </div>
                  )}
                  {selectedClinic.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${selectedClinic.phone}`} className="hover:text-blue-600" dir="ltr">
                        {selectedClinic.phone}
                      </a>
                    </div>
                  )}
                  {selectedClinic.status && (
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-3 h-3 ${getStatusColor(selectedClinic.status)} rounded-full`}
                      />
                      <span className="font-medium">
                        {getStatusText(selectedClinic.status)}
                      </span>
                    </div>
                  )}
                  {selectedClinic.isPromoted && (
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-600 font-medium">عيادة مميزة</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.location.href = `/clinics/${selectedClinic.id}`}
                  >
                    احجز موعداً
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-2 hover:bg-gray-50"
                    onClick={() => handleGetDirections(selectedClinic)}
                  >
                    <Navigation className="w-4 h-4 ml-2" />
                    الاتجاهات
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
