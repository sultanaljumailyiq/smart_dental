import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import {
  MapPin,
  Phone,
  Star,
  Clock,
  Navigation,
  Stethoscope,
  Shield,
  Calendar,
  X,
  ExternalLink,
} from "lucide-react";

interface Clinic {
  id: number;
  name: string;
  arabicName: string;
  address: string;
  arabicAddress: string;
  rating: string;
  reviewCount: number;
  distance?: number;
  image: string | null;
  phone: string;
  isActive: boolean;
  specialty: string[];
  arabicSpecialty: string[];
  services: string[];
  arabicServices: string[];
  locationLat: string;
  locationLng: string;
  latitude: number;
  longitude: number;
  doctorName?: string;
  arabicDoctorName?: string;
  subscriptionTier?: string;
  isPromoted?: boolean;
  isVerified?: boolean;
}

interface UnifiedInteractiveMapProps {
  title?: string;
  description?: string;
}

// Helper function to get clinic image with fallback
const getClinicImage = (clinic: Clinic) => {
  if (clinic.image) {
    return clinic.image;
  }
  
  // Fallback to gradient circle with first letter
  const firstLetter = clinic.arabicName?.charAt(0) || clinic.name?.charAt(0) || 'ع';
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  ];
  const gradientIndex = clinic.id % gradients.length;
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${clinic.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          ${gradients[gradientIndex].includes('#667eea') ? '<stop offset="0%" style="stop-color:#667eea;stop-opacity:1" /><stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />' : ''}
          ${gradients[gradientIndex].includes('#f093fb') ? '<stop offset="0%" style="stop-color:#f093fb;stop-opacity:1" /><stop offset="100%" style="stop-color:#f5576c;stop-opacity:1" />' : ''}
          ${gradients[gradientIndex].includes('#4facfe') ? '<stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" /><stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />' : ''}
          ${gradients[gradientIndex].includes('#43e97b') ? '<stop offset="0%" style="stop-color:#43e97b;stop-opacity:1" /><stop offset="100%" style="stop-color:#38f9d7;stop-opacity:1" />' : ''}
          ${gradients[gradientIndex].includes('#fa709a') ? '<stop offset="0%" style="stop-color:#fa709a;stop-opacity:1" /><stop offset="100%" style="stop-color:#fee140;stop-opacity:1" />' : ''}
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#grad${clinic.id})" />
      <text x="50" y="50" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">${firstLetter}</text>
    </svg>
  `)}`;
};

// Helper to get status from isActive and subscription tier
const getClinicStatus = (clinic: Clinic): "available" | "busy" | "closed" => {
  if (!clinic.isActive) return "closed";
  if (clinic.subscriptionTier === 'premium') return "available";
  return "busy";
};

export default function UnifiedInteractiveMap({
  title = "عيادات الأسنان القريبة منك",
  description = "اعثر على أفضل عيادات الأسنان واحجز موعدك بسهولة",
}: UnifiedInteractiveMapProps) {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [centeredClinic, setCenteredClinic] = useState<Clinic | null>(null);
  const [showDetailedCard, setShowDetailedCard] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Fallback data if API fails
  const fallbackClinics: Clinic[] = [
    {
      id: 1,
      name: 'Baghdad Dental Center',
      arabicName: 'مركز بغداد لطب الأسنان',
      phone: '+964 770 123 4567',
      address: 'Karrada, Baghdad',
      arabicAddress: 'الكرادة، بغداد',
      locationLat: '33.3152',
      locationLng: '44.3661',
      latitude: 33.3152,
      longitude: 44.3661,
      specialty: ['Orthodontics', 'Implants', 'Whitening'],
      arabicSpecialty: ['تقويم الأسنان', 'زراعة الأسنان', 'تبييض'],
      services: ['Orthodontics', 'Implants', 'Whitening', 'Root Canal'],
      arabicServices: ['تقويم الأسنان', 'زراعة الأسنان', 'تبييض', 'علاج الجذور'],
      rating: '4.8',
      reviewCount: 156,
      image: null,
      isActive: true,
      subscriptionTier: 'premium',
      isPromoted: true,
      isVerified: true,
    },
    {
      id: 2,
      name: 'Mansour Smile Clinic',
      arabicName: 'عيادة المنصور للابتسامة',
      phone: '+964 750 234 5678',
      address: 'Mansour, Baghdad',
      arabicAddress: 'المنصور، بغداد',
      locationLat: '33.3128',
      locationLng: '44.3800',
      latitude: 33.3128,
      longitude: 44.3800,
      specialty: ['Cosmetic Dentistry', 'Whitening'],
      arabicSpecialty: ['طب الأسنان التجميلي', 'تبييض'],
      services: ['Cosmetic Fillings', 'Implants', 'Whitening'],
      arabicServices: ['حشوات تجميلية', 'زراعة', 'تبييض الأسنان'],
      rating: '4.6',
      reviewCount: 89,
      image: null,
      isActive: true,
      subscriptionTier: 'basic',
      isPromoted: false,
      isVerified: true,
    },
    {
      id: 3,
      name: 'Adhamiya Dental Specialists',
      arabicName: 'مركز الأعظمية المتخصص',
      phone: '+964 780 345 6789',
      address: 'Adhamiya, Baghdad',
      arabicAddress: 'الأعظمية، بغداد',
      locationLat: '33.3457',
      locationLng: '44.4130',
      latitude: 33.3457,
      longitude: 44.4130,
      specialty: ['Surgery', 'Implants'],
      arabicSpecialty: ['جراحة', 'زراعة'],
      services: ['Oral Surgery', 'Implants', 'Dentures'],
      arabicServices: ['جراحة الفم', 'زراعة الأسنان', 'تركيبات'],
      rating: '4.9',
      reviewCount: 203,
      image: null,
      isActive: true,
      subscriptionTier: 'premium',
      isPromoted: true,
      isVerified: true,
    },
  ];

  // Fetch clinics from API
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setLoading(true);
        
        // Try to get user location first
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const response = await fetch(
                  `/api/clinics?userLat=${latitude}&userLng=${longitude}&limit=50&mode=distance`
                );
                if (response.ok) {
                  const data = await response.json();
                  if (data && Array.isArray(data) && data.length > 0) {
                    // Transform API data to match component expectations
                    const transformedData = data.map(clinic => ({
                      ...clinic,
                      latitude: typeof clinic.latitude === 'number' ? clinic.latitude : parseFloat(clinic.locationLat),
                      longitude: typeof clinic.longitude === 'number' ? clinic.longitude : parseFloat(clinic.locationLng),
                      distance: typeof clinic.distance === 'number' ? clinic.distance : undefined,
                    }));
                    setClinics(transformedData);
                  } else {
                    console.warn('No clinics returned from API, using fallback data');
                    setClinics(fallbackClinics);
                  }
                } else {
                  console.warn('API error, using fallback data');
                  setClinics(fallbackClinics);
                }
              } catch (err) {
                console.warn('Fetch error, using fallback data:', err);
                setClinics(fallbackClinics);
              }
              setLoading(false);
            },
            async () => {
              // Fallback to promoted clinics if geolocation fails
              try {
                const response = await fetch(`/api/clinics?limit=50&mode=promoted`);
                if (response.ok) {
                  const data = await response.json();
                  if (data && Array.isArray(data) && data.length > 0) {
                    // Transform API data to match component expectations
                    const transformedData = data.map(clinic => ({
                      ...clinic,
                      latitude: typeof clinic.latitude === 'number' ? clinic.latitude : parseFloat(clinic.locationLat),
                      longitude: typeof clinic.longitude === 'number' ? clinic.longitude : parseFloat(clinic.locationLng),
                      distance: typeof clinic.distance === 'number' ? clinic.distance : undefined,
                    }));
                    setClinics(transformedData);
                  } else {
                    setClinics(fallbackClinics);
                  }
                } else {
                  setClinics(fallbackClinics);
                }
              } catch (err) {
                setClinics(fallbackClinics);
              }
              setLoading(false);
            },
            { timeout: 5000 }
          );
        } else {
          // No geolocation support, get promoted clinics
          try {
            const response = await fetch(`/api/clinics?limit=50&mode=promoted`);
            if (response.ok) {
              const data = await response.json();
              if (data && Array.isArray(data) && data.length > 0) {
                // Transform API data to match component expectations
                const transformedData = data.map(clinic => ({
                  ...clinic,
                  latitude: typeof clinic.latitude === 'number' ? clinic.latitude : parseFloat(clinic.locationLat),
                  longitude: typeof clinic.longitude === 'number' ? clinic.longitude : parseFloat(clinic.locationLng),
                  distance: typeof clinic.distance === 'number' ? clinic.distance : undefined,
                }));
                setClinics(transformedData);
              } else {
                setClinics(fallbackClinics);
              }
            } else {
              setClinics(fallbackClinics);
            }
          } catch (err) {
            setClinics(fallbackClinics);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching clinics:', error);
        setClinics(fallbackClinics);
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  const filteredClinics = clinics.filter((clinic) => {
    const matchesSearch =
      clinic.arabicName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.arabicServices?.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      clinic.services?.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesType = filterType === "all" || 
      clinic.specialty?.includes(filterType) ||
      clinic.arabicSpecialty?.includes(filterType);
    
    return matchesSearch && matchesType;
  });

  const handleMarkerClick = (clinic: Clinic) => {
    setCenteredClinic(clinic);
    setShowDetailedCard(true);
    setSelectedClinic(null);
  };

  const handleBookAppointment = (clinicId: number) => {
    navigate(`/simplified-booking/${clinicId}`);
  };

  const resetMap = () => {
    setCenteredClinic(null);
    setShowDetailedCard(false);
    setSelectedClinic(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-400";
      case "busy":
        return "bg-yellow-400";
      case "closed":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "متاح";
      case "busy":
        return "مشغول";
      case "closed":
        return "مغلق";
      default:
        return "غير معروف";
    }
  };

  const serviceTypes = [
    { value: "all", label: "جميع الخدمات" },
    { value: "تقويم الأسنان", label: "تقويم الأسنان" },
    { value: "زراعة الأسنان", label: "زراعة الأسنان" },
    { value: "تبييض", label: "تبييض الأسنان" },
    { value: "طب أسنان الأطفال", label: "طب أسنان الأطفال" },
  ];

  const defaultCenter = clinics.length > 0 
    ? { lat: clinics[0].latitude, lng: clinics[0].longitude }
    : { lat: 33.3152, lng: 44.3661 }; // Baghdad center as fallback
    
  const defaultZoom = centeredClinic ? 15 : 13;
  const mapCenter = centeredClinic
    ? { lat: centeredClinic.latitude, lng: centeredClinic.longitude }
    : defaultCenter;

  if (loading) {
    return (
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل العيادات...</p>
        </div>
      </section>
    );
  }

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}>
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {/* Search and Filter */}
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {serviceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="ابحث عن عيادة أو خدمة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Interactive Map */}
        <div className="mb-6">
          <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden">
            <Map
              center={mapCenter}
              zoom={defaultZoom}
              gestureHandling="greedy"
              disableDefaultUI={false}
              mapId="bf51a910020fa25a"
              className="w-full h-full"
              style={{ borderRadius: "0.75rem" }}
            >
              {/* Clinic Markers */}
              {filteredClinics.map((clinic) => {
                const isCentered = centeredClinic?.id === clinic.id;
                return (
                  <AdvancedMarker
                    key={clinic.id}
                    position={{ lat: clinic.latitude, lng: clinic.longitude }}
                    onClick={() => handleMarkerClick(clinic)}
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 border-white shadow-lg transition-all duration-700 hover:scale-110 cursor-pointer flex items-center justify-center ${
                        isCentered
                          ? "bg-red-600 scale-150 animate-pulse"
                          : "bg-blue-600"
                      }`}
                    >
                      <Stethoscope
                        className={`${isCentered ? "w-6 h-6" : "w-4 h-4"} text-white transition-all duration-500`}
                      />
                    </div>
                  </AdvancedMarker>
                );
              })}
            </Map>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2 z-10">
              <button
                onClick={resetMap}
                className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                title="إعادة تعيين الخريطة"
              >
                <Navigation className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Compact Detailed Clinic Card */}
            {showDetailedCard && centeredClinic && (
              <div
                className="absolute top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-[60] overflow-hidden"
                style={{ width: "202px" }}
              >
                <div className="relative">
                  {/* Compact Header with Image */}
                  <div className="relative h-20">
                    <img
                      src={getClinicImage(centeredClinic)}
                      alt={centeredClinic.arabicName || centeredClinic.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <button
                      onClick={resetMap}
                      className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <X className="w-3 h-3 text-gray-600" />
                    </button>
                    {centeredClinic.isVerified && (
                      <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        معتمد
                      </div>
                    )}
                  </div>

                  {/* Compact Content */}
                  <div className="p-2.5" style={{ width: "100%" }}>
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {centeredClinic.arabicName || centeredClinic.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-bold text-sm">
                            {centeredClinic.rating}
                          </span>
                          <span className="text-gray-500 text-xs">
                            ({centeredClinic.reviewCount})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 ${getStatusColor(getClinicStatus(centeredClinic))} rounded-full`}
                          />
                          <span className="text-xs text-gray-600">
                            {getStatusText(getClinicStatus(centeredClinic))}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="flex flex-col mb-1 text-xs">
                      <div>
                        <div className="flex flex-row">
                          <div className="flex items-center gap-0.5 text-gray-600 justify-start w-[68.5px] max-w-[54px]">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">
                              {centeredClinic.distance && typeof centeredClinic.distance === 'number' ? `${centeredClinic.distance.toFixed(1)} كم` : 'قريب'}
                            </span>
                          </div>
                          <div className="flex text-gray-600 justify-center flex-row gap-1">
                            <Clock className="w-3.5 h-3.5 flex flex-col justify-center items-center ml-auto" />
                            <span className="truncate">
                              8:00 ص - 8:00 م
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Services Pills */}
                    <div className="mb-0.75 flex flex-row justify-center items-center text-[10px]">
                      <div className="flex flex-row justify-center max-w-[150px] items-start mr-auto gap-0.75">
                        {(centeredClinic.arabicServices || centeredClinic.services || [])
                          .slice(0, 3)
                          .map((service, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-700 text-[11px] leading-3 rounded-[5px] overflow-hidden"
                              style={{ padding: "3px 0 3px 9px" }}
                            >
                              {service}
                            </span>
                          ))}
                        {(centeredClinic.arabicServices || centeredClinic.services || []).length > 3 && (
                          <span
                            className="bg-gray-100 text-gray-600 text-[11px] leading-3 rounded-[5px] overflow-hidden"
                            style={{ padding: "3px 0 3px 6px" }}
                          >
                            +{(centeredClinic.arabicServices || centeredClinic.services || []).length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto pt-0.75">
                      <button
                        onClick={() => handleBookAppointment(centeredClinic.id)}
                        className="flex-1 bg-blue-600 text-white py-1.25 px-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                      >
                        احجز موعد
                      </button>
                      <a
                        href={`tel:${centeredClinic.phone}`}
                        className="bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        style={{ padding: "5px" }}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Scrollable Clinics List */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            العيادات القريبة ({filteredClinics.length})
          </h3>
          <div className="relative">
            <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 w-full min-h-[117px] items-stretch">
              {filteredClinics.map((clinic) => (
                <div
                  key={clinic.id}
                  onClick={() => setSelectedClinic(clinic)}
                  className={`flex-shrink-0 w-72 border border-gray-200 rounded-xl cursor-pointer hover:shadow-md transition-all p-4 ${
                    selectedClinic?.id === clinic.id
                      ? "border-blue-500 bg-blue-50"
                      : "hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={getClinicImage(clinic)}
                      alt={clinic.arabicName || clinic.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate mb-1">
                        {clinic.arabicName || clinic.name}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2 truncate">
                        {clinic.arabicAddress || clinic.address}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-700">
                            {clinic.rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 ${getStatusColor(getClinicStatus(clinic))} rounded-full`}
                          />
                          <span className="text-xs text-gray-600">
                            {getStatusText(getClinicStatus(clinic))}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {clinic.distance && typeof clinic.distance === 'number' ? `${clinic.distance.toFixed(1)} كم` : '--'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Clinic Details */}
        {selectedClinic && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {selectedClinic.arabicName || selectedClinic.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {selectedClinic.arabicAddress || selectedClinic.address}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end mb-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-bold">{selectedClinic.rating}</span>
                  <span className="text-gray-500 text-sm">
                    ({selectedClinic.reviewCount})
                  </span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <div
                    className={`w-2 h-2 ${getStatusColor(getClinicStatus(selectedClinic))} rounded-full`}
                  />
                  <span className="text-sm text-gray-600">
                    {getStatusText(getClinicStatus(selectedClinic))}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  الخدمات المتاحة
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedClinic.arabicServices || selectedClinic.services || []).map((service, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  معلومات التواصل
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{selectedClinic.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>8:00 ص - 8:00 م</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedClinic.distance && typeof selectedClinic.distance === 'number' ? `${selectedClinic.distance.toFixed(1)} كم` : selectedClinic.arabicAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleBookAppointment(selectedClinic.id)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                احجز موعد
              </button>
              <a
                href={`tel:${selectedClinic.phone}`}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                اتصل الآن
              </a>
            </div>
          </div>
        )}
      </section>
    </APIProvider>
  );
}
