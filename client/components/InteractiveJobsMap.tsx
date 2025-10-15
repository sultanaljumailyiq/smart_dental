import React, { useState, useEffect } from "react";
import { Map, MapPin, Navigation, ZoomIn, ZoomOut, Layers, Route, Target, Filter, Clock, DollarSign, Building, Star, Eye, ArrowRight, X, Phone, Mail, Users } from "lucide-react";
import { cn } from "@/lib/utils";
class SimpleErrorBoundary extends React.Component<React.PropsWithChildren<{}>, {
  hasError: boolean;
}> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = {
      hasError: false
    };
  }
  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("InteractiveJobsMap error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          حدث خطأ غير متوقع. يرجى إعادة المحاولة لاحقًا.
        </div>;
    }
    return this.props.children as React.ReactElement;
  }
}
interface JobLocation {
  id: number;
  title: string;
  company: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  district: string;
  nearbyLandmarks: string[];
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  posted: string;
  applicants: number;
  featured: boolean;
  remote: boolean;
  urgent: boolean;
  logo: string;
  company_rating: number;
  company_size: string;
  distance: string;
  commute_time: string;
}
interface InteractiveJobsMapProps {
  jobs: JobLocation[];
  selectedJob: JobLocation | null;
  onJobSelect: (job: JobLocation | null) => void;
  onJobApply: (jobId: number) => void;
  // optional: let parent control showing details so popup design is consistent
  onShowJobDetails?: (show: boolean) => void;
  mode?: "jobs" | "clinics";
}
export default function InteractiveJobsMap({
  jobs,
  selectedJob,
  onJobSelect,
  onJobApply,
  onShowJobDetails,
  mode = "jobs"
}: InteractiveJobsMapProps) {
  const [mapCenter, setMapCenter] = useState({
    lat: 33.3152,
    lng: 44.3661
  }); // Baghdad center
  const [zoomLevel, setZoomLevel] = useState(6);
  const [showMapControls, setShowMapControls] = useState(true);
  const [mapStyle, setMapStyle] = useState("standard");
  const [localShowJobDetails, setLocalShowJobDetails] = useState(false);

  // فلترة الوظائف التي لها إحداثيات GPS
  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const geoJobs = safeJobs.filter(job => job.coordinates !== null);

  // تحديد المدن الرئيسية في العراق
  const majorCities = [{
    name: "بغداد",
    coordinates: {
      lat: 33.3152,
      lng: 44.3661
    },
    jobs: geoJobs.filter(job => job.location.includes("بغداد")).length
  }, {
    name: "البصرة",
    coordinates: {
      lat: 30.5085,
      lng: 47.7804
    },
    jobs: geoJobs.filter(job => job.location.includes("البصرة")).length
  }, {
    name: "أربيل",
    coordinates: {
      lat: 36.19,
      lng: 44.0092
    },
    jobs: geoJobs.filter(job => job.location.includes("أربيل")).length
  }, {
    name: "الموصل",
    coordinates: {
      lat: 36.335,
      lng: 43.1189
    },
    jobs: geoJobs.filter(job => job.location.includes("الموصل")).length
  }, {
    name: "الس��يمانية",
    coordinates: {
      lat: 35.565,
      lng: 45.4297
    },
    jobs: geoJobs.filter(job => job.location.includes("السليمانية")).length
  }, {
    name: "النجف",
    coordinates: {
      lat: 32.028,
      lng: 44.3419
    },
    jobs: geoJobs.filter(job => job.location.includes("النجف")).length
  }];

  // دالة لحساب المسافة بين نقطتين
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // نصف قطر الأرض بالكيلومترات
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // دالة للانتقال إلى مدينة معينة
  const flyToCity = (coordinates: {
    lat: number;
    lng: number;
  }) => {
    setMapCenter(coordinates);
    setZoomLevel(10);
  };

  // مكون نقطة الوظيفة على الخريطة
  const JobMarker = ({
    job,
    isSelected
  }: {
    job: JobLocation;
    isSelected: boolean;
  }) => {
    if (!job.coordinates) return null;
    return <div className={cn("absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-300", isSelected && "z-20 scale-110")} style={{
      left: `${(job.coordinates.lng - 39) / (50 - 39) * 100}%`,
      top: `${(36 - job.coordinates.lat) / (36 - 29) * 100}%`
    }} onClick={() => {
      onJobSelect(job);
      if (typeof onShowJobDetails === "function") {
        onShowJobDetails(true);
      } else {
        setLocalShowJobDetails(true);
      }
    }}>
        {/* دبوس الخريطة */}
        <div className={cn("relative w-8 h-8 rounded-full shadow-lg border-2 border-white transition-all duration-300", job.featured ? "bg-gradient-to-r from-purple-500 to-pink-500" : job.urgent ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-blue-500 to-cyan-500", isSelected && "shadow-xl ring-4 ring-white/50")}>
          <MapPin className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />

          {/* مؤشر النبضة */}
          <div className={cn("absolute inset-0 rounded-full animate-ping opacity-20", job.featured ? "bg-purple-500" : job.urgent ? "bg-red-500" : "bg-blue-500")} />
        </div>

        {/* تسمية سريعة */}
        {isSelected && <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full">
            <div className="bg-white rounded-lg shadow-lg px-3 py-2 text-center border border-gray-200">
              <div className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                {job.company}
              </div>
              <div className="text-xs text-gray-600">{job.type}</div>
            </div>
          </div>}
      </div>;
  };

  // مكون تفاصيل الوظيفة
  const JobDetailsPanel = () => {
    const isVisible = typeof onShowJobDetails === "function" ? selectedJob && (localShowJobDetails || false) || false : selectedJob && localShowJobDetails;
    // Prefer parent-controlled visibility: if parent passed handler we won't show local panel
    // But still render if localShowJobDetails true and selectedJob present
    if (!selectedJob) return null;
    const requirements = Array.isArray(selectedJob.requirements) ? selectedJob.requirements : [];
    const benefits = Array.isArray(selectedJob.benefits) ? selectedJob.benefits : [];

    // Show only if parent doesn't control or if local state is true
    const shouldShow = typeof onShowJobDetails === "function" ? false : localShowJobDetails;
    if (!shouldShow) return null;
    return <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4 lg:items-center">
        <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* رأس التفاصيل */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl lg:rounded-t-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <img src={selectedJob.logo} alt={selectedJob.company} className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {selectedJob.title}
                  </h2>
                  <p className="text-lg text-gray-700 mb-2">
                    {selectedJob.company}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedJob.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedJob.type}
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={() => {
              if (typeof onShowJobDetails === "function") {
                onShowJobDetails(false);
              }
              setLocalShowJobDetails(false);
            }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* محتوى التفاصيل */}
          <div className="p-6 space-y-6">
            {/* معلومات أساسية */}
            <div className="grid grid-cols-2 gap-4">
              {mode === "jobs" ? <>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        الراتب
                      </span>
                    </div>
                    <p className="text-lg font-bold text-blue-900">
                      {selectedJob.salary}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">
                        المتقدمون
                      </span>
                    </div>
                    <p className="text-lg font-bold text-green-900">
                      {selectedJob.applicants} شخص
                    </p>
                  </div>
                </> : <>
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-900">
                        التقييم
                      </span>
                    </div>
                    <p className="text-lg font-bold text-yellow-900">
                      {selectedJob.company_rating}
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-teal-600" />
                      <span className="text-sm font-medium text-teal-900">
                        مدة الوصول
                      </span>
                    </div>
                    <p className="text-lg font-bold text-teal-900">
                      {selectedJob.commute_time}
                    </p>
                  </div>
                </>}
            </div>

            {/* وصف الوظيفة */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {mode === "clinics" ? "وصف العيادة" : "وصف الوظيفة"}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {selectedJob.description}
              </p>
            </div>

            {/* المتطلبات */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {mode === "clinics" ? "الخدمات" : "المتطلبات"}
              </h3>
              <ul className="space-y-2">
                {requirements.map((req, index) => <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{req}</span>
                  </li>)}
              </ul>
            </div>

            {/* المزايا */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {mode === "clinics" ? "المرافق" : "المزايا"}
              </h3>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>)}
              </ul>
            </div>

            {/* معلومات الشركة */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {mode === "clinics" ? "معلومات العيادة" : "معلومات الشركة"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">التقييم</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">
                      {selectedJob.company_rating}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">حجم الشركة</span>
                  <p className="font-semibold">
                    {selectedJob.company_size} موظف
                  </p>
                </div>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex gap-3 pt-4">
              <button onClick={() => onJobApply(selectedJob.id)} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2">
                <ArrowRight className="w-4 h-4" />
                {mode === "clinics" ? "احجز موعد" : "تقدم للوظيفة"}
              </button>

              <button className="px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                حفظ
              </button>
            </div>
          </div>
        </div>
      </div>;
  };
  return <SimpleErrorBoundary>
      <div className="relative">
        {/* الخريطة الرئيسية */}
        <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl overflow-hidden border border-gray-200">
          {/* خلفية الخريطة */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50 opacity-30" />

          {/* خريطة مبسطة للعراق */}
          <div className="absolute inset-0 p-8">
            <svg viewBox="0 0 400 300" className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              {/* حدود العراق المبسطة */}
              <path d="M80 50 L320 50 L320 80 L350 100 L350 200 L320 220 L280 250 L200 250 L150 230 L100 200 L80 150 Z" fill="currentColor" className="text-blue-600" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>

          {/* المدن الرئيسية */}
          {majorCities.map(city => <button key={city.name} onClick={() => flyToCity(city.coordinates)} className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group" style={{
          left: `${(city.coordinates.lng - 39) / (50 - 39) * 100}%`,
          top: `${(36 - city.coordinates.lat) / (36 - 29) * 100}%`
        }}>
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-900">
                  {city.name}
                </div>
                <div className="text-xs text-blue-600">
                  {city.jobs} {mode === "clinics" ? "عيادة" : "وظيفة"}
                </div>
              </div>
            </button>)}

          {/* علامات الوظائف */}
          {geoJobs.map(job => <JobMarker key={job.id} job={job} isSelected={selectedJob?.id === job.id} />)}

          {/* أدوات التحكم في الخريطة */}
          {showMapControls && <div className="absolute top-4 right-4 space-y-2">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1">
                <button onClick={() => setZoomLevel(prev => Math.min(prev + 1, 15))} className="p-2 hover:bg-gray-100 rounded transition-colors">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button onClick={() => setZoomLevel(prev => Math.max(prev - 1, 5))} className="p-2 hover:bg-gray-100 rounded transition-colors">
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1">
                <button onClick={() => setMapCenter({
              lat: 33.3152,
              lng: 44.3661
            })} className="p-2 hover:bg-gray-100 rounded transition-colors" title="العودة للوسط">
                  <Target className="w-4 h-4" />
                </button>
              </div>
            </div>}

          {/* مؤشر الطبقات */}
          <div className="absolute bottom-4 right-4">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  <span className="text-xs">مميزة</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                  <span className="text-xs">عاجلة</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                  <span className="text-xs">عادية</span>
                </div>
              </div>
            </div>
          </div>

          {/* شريط المعلومات */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
              <div className="text-sm">
                <div className="font-semibold text-gray-900">
                  {geoJobs.length}{" "}
                  {mode === "clinics" ? "عيادة متاحة" : "وظيفة متاحة"}
                </div>
                <div className="text-gray-600">
                  في {majorCities.filter(city => city.jobs > 0).length} مدن
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        

        {/* تفاصيل الوظيفة */}
        <JobDetailsPanel />
      </div>
    </SimpleErrorBoundary>;
}