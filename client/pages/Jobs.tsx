import React, { useState } from "react";
import { Link } from "react-router-dom";
import InteractiveJobsMap from "@/components/InteractiveJobsMap";
import UnifiedHeader from "@/components/UnifiedHeader";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Filter,
  Star,
  Users,
  Calendar,
  Building,
  Heart,
  Share2,
  MessageCircle,
  Plus,
  Bell,
  User,
  CheckCircle,
  ArrowRight,
  Award,
  TrendingUp,
  Eye,
  Bookmark,
  Send,
  Phone,
  Mail,
  Globe,
  Target,
  Brain,
  Settings,
  Map,
  Navigation,
  Radar,
  ZoomIn,
  ZoomOut,
  Layers,
  Route,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for job listings with GPS coordinates - Arabic content
const jobListings = [
  {
    id: 1,
    title: "طبيب أسنان أول - عيادة معززة بالذكاء الاصطناعي",
    company: "مجموعة سمايل تك الطبية",
    location: "بغداد، العراق",
    coordinates: { lat: 33.3152, lng: 44.3661 },
    district: "الكرادة",
    nearbyLandmarks: ["مستشفى ابن البيطار", "جامعة بغداد"],
    type: "دوام كامل",
    experience: "5+ سنوات",
    salary: "5,000 - 7,000 د.ع",
    description:
      "انضم إلى عيادتنا المبتكرة التي تست��دم أحدث تقنيات الذكاء الاصطناعي للتشخيص وتخطيط العلاج. نبحث عن طبيب أسنان متمرس شغوف بالتكنولوجيا.",
    requirements: [
      "شهادة طب الأسنان",
      "خبرة سريرية 5+ سنوات",
      "خبرة في طب الأسنان الرقمي",
      "معرفة بأدوات التشخيص بالذكاء الاصطناعي مفضلة",
    ],
    benefits: [
      "راتب تنافسي + مكافآت",
      "معدات ذك��ء اصطناعي متطورة",
      "دعم التعليم المستمر",
      "تأمين صحي",
    ],
    posted: "م��ذ يومين",
    applicants: 42,
    featured: true,
    remote: false,
    urgent: false,
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop",
    company_rating: 4.8,
    company_size: "50-100",
    distance: "2.3 كم",
    commute_time: "8 دقائق",
  },
  {
    id: 2,
    title: "ط��يب أسنان أطفال",
    company: "عيا��ة الأط��ال السعداء",
    location: "البصرة، العراق",
    coordinates: { lat: 30.5085, lng: 47.7804 },
    district: "العشار",
    nearbyLandmarks: ["جامعة البصرة", "كورنيش شط العرب"],
    type: "دوام ��زئي",
    experience: "3+ سنوات",
    salary: "3,500 - 4,500 د.ع",
    description:
      "نبحث عن طبيب أسنان أطفال متفهم للانضمام إلى عيادتنا الم��ص��ة للأطفا��. مطلوب خبرة مع الأطفال القلقين والتقنيات الحديثة.",
    requirements: [
      "إقامة طب أسنان الأطفال",
      "خبرة 3+ سنوات مع الأطفال",
      "شهادة مجلس مفضلة",
      "مهارات تواصل ممتازة",
    ],
    benefits: [
      "جدول عمل مرن",
      "بيئة صديقة للأطفال",
      "تطوير مهني",
      "مشاركة في الأرباح",
    ],
    posted: "منذ أسبوع",
    applicants: 28,
    featured: false,
    remote: false,
    urgent: true,
    logo: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=100&h=100&fit=crop",
    company_rating: 4.6,
    company_size: "10-50",
    distance: "456 كم",
    commute_time: "5.5 ساعة",
  },
  {
    id: 3,
    title: "أخصائي تقويم أسنان - استشارات عن بُعد",
    company: "شركة التقويم الرقمي",
    location: "عن بُع��",
    coordinates: null,
    district: "العمل من المنزل",
    nearbyLandmarks: [],
    type: "عقد مؤقت",
    experience: "7+ سنوات",
    salary: "50 - 75 د.ع/ساعة",
    description:
      "استشارات تقويم أسنا�� ثو��ية ع�� بُعد باستخدام تخطيط العلاج بالذكاء الاصطناعي. اعمل من أي مكان بينما تساعد المرضى في تحقيق ابتسامات مثالية.",
    requirements: [
      "شهادة تخصص تقويم الأسنان",
      "خبرة 7+ سنوات",
      "خبرة في سير العمل الرقمي",
      "خبرة في الطب عن بُعد مفضلة",
    ],
    benefits: [
      "عمل عن بُعد 100%",
      "ساعات مرنة",
      "تشخيص معزز بالذكاء الاصطناعي",
      "معدل ��الساعة مرتفع",
    ],
    posted: "منذ 3 أيام",
    applicants: 67,
    featured: true,
    remote: true,
    urgent: false,
    logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop",
    company_rating: 4.9,
    company_size: "100-500",
    distance: "0 كم",
    commute_time: "فوري",
  },
  {
    id: 4,
    title: "أخصائي صحة الأسنان",
    company: "منتجع الأسنان الحديث",
    location: "أربيل، العراق",
    coordinates: { lat: 36.1911, lng: 44.0094 },
    district: "عنكاوا",
    nearbyLandmarks: ["مطار أربيل الدولي", "جامعة صلاح الدين"],
    type: "دوام كامل",
    experience: "2+ سنوات",
    salary: "2,200 - 2,800 د.ع",
    description:
      "انضم إلى منتجع الأسنان الفاخر لدينا الذي يقدم رعاية متميزة في بيئة مريحة. نستخدم أحدث ال��قنيات لراحة المرضى وكفاءة العلاج.",
    requirements: [
      "شهادة صحة الأسنان",
      "ترخيص ��لدولة",
      "خبرة 2+ سنوات",
      "مهارات رعاية المرضى الممتازة",
    ],
    benefits: [
      "بيئة عمل تشبه المنتجع",
      "��حدث التقنيات",
      "مكافآت ��لأداء",
      "مزايا العافية",
    ],
    posted: "منذ 5 أيام",
    applicants: 35,
    featured: false,
    remote: false,
    urgent: false,
    logo: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=100&h=100&fit=crop",
    company_rating: 4.7,
    company_size: "10-50",
    distance: "354 كم",
    commute_time: "4.2 ساعة",
  },
  {
    id: 5,
    title: "طبيب أسنان عام",
    company: "عيادة النجف ال��بية",
    location: "النجف، العراق",
    coordinates: { lat: 32.0282, lng: 44.3225 },
    district: "الحيدرية",
    nearbyLandmarks: ["حرم الإمام علي", "جامعة الكوفة"],
    type: "دوام كامل",
    experience: "3+ سنوات",
    salary: "3,800 - 4,200 د.ع",
    description:
      "عيادة ��ديثة في مدينة النجف تطلب طبيب أس��ان عام للانضمام لفريق عملها المتميز.",
    requirements: ["شهادة طب الأسنان", "ترخيص مزا��لة المهنة", "خبرة 3+ سنوات"],
    benefits: ["راتب ثابت", "��جازات سنوية", "ت��مين طبي"],
    posted: "منذ يوم",
    applicants: 23,
    featured: false,
    remote: false,
    urgent: false,
    logo: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=100&h=100&fit=crop",
    company_rating: 4.5,
    company_size: "20-30",
    distance: "160 كم",
    commute_time: "2.1 ساعة",
  },
  {
    id: 6,
    title: "جراح فم وفكين",
    company: "مستش��ى الموصل التخصصي",
    location: "الموصل، العرا��",
    coordinates: { lat: 36.3489, lng: 43.1189 },
    district: "الجامعة",
    nearbyLandmarks: ["جامعة الموصل", "جامع النوري"],
    type: "دوام ك��مل",
    experience: "8+ سنوات",
    salary: "6,500 - 8,000 د.ع",
    description:
      "مستشفى متخصص يبحث عن جراح فم وفكين ذ�� خبرة للانضمام للقسم الجراحي.",
    requirements: [
      "شه��دة تخصص ��راحة ال��م والف��ين",
      "خبرة ��راحية 8+ سنوات",
      "ترخيص استشاري",
    ],
    benefits: ["راتب عالي", "مكافآت جراحية", "تطوير مهني مستمر"],
    posted: "منذ 3 أيام",
    applicants: 12,
    featured: true,
    remote: false,
    urgent: true,
    logo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop",
    company_rating: 4.9,
    company_size: "200-500",
    distance: "398 كم",
    commute_time: "4.8 ساعة",
  },
];

// Interactive Map Component
const JobsMap = ({ jobs, selectedJob, onJobSelect, userLocation }: any) => {
  const [mapCenter, setMapCenter] = useState({ lat: 33.3152, lng: 44.3661 }); // Baghdad center
  const [zoomLevel, setZoomLevel] = useState(7);
  const [showUserLocation, setShowUserLocation] = useState(false);

  const filteredJobs = jobs.filter((job: any) => job.coordinates !== null);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Map className="w-5 h-5 text-blue-600" />
          خريطة الوظائف التفاعلية
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUserLocation(!showUserLocation)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              showUserLocation
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600",
            )}
            title="إظهار موقعي"
          >
            <Navigation className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoomLevel(Math.min(zoomLevel + 1, 15))}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="تكبير"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(Math.max(zoomLevel - 1, 5))}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="تصغير"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Simulated Map Interface */}
        <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-gray-300"></div>
              ))}
            </div>
          </div>

          {/* Iraq Map Outline (Simplified) */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
            <path
              d="M50 150 Q80 120 120 130 Q160 140 200 120 Q240 110 280 125 Q320 140 350 150 Q340 180 320 200 Q280 220 240 210 Q200 200 160 190 Q120 185 80 180 Q60 170 50 150 Z"
              fill="rgba(34, 197, 94, 0.1)"
              stroke="rgba(34, 197, 94, 0.3)"
              strokeWidth="2"
            />
          </svg>

          {/* User Location */}
          {showUserLocation && (
            <div
              className="absolute w-4 h-4 bg-blue-600 rounded-full animate-pulse shadow-lg"
              style={{
                left: "180px",
                top: "150px",
                transform: "translate(-50%, -50%)",
              }}
              title="موقعك الحالي"
            >
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping"></div>
            </div>
          )}

          {/* Job Markers */}
          {filteredJobs.map((job: any, index: number) => {
            const x = 100 + index * 60 + (job.coordinates.lng - 44) * 40;
            const y = 100 + (33.5 - job.coordinates.lat) * 50;

            return (
              <div
                key={job.id}
                className={cn(
                  "absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110",
                  selectedJob?.id === job.id ? "z-20" : "z-10",
                )}
                style={{ left: `${x}px`, top: `${y}px` }}
                onClick={() => onJobSelect(job)}
              >
                <div
                  className={cn(
                    "relative",
                    selectedJob?.id === job.id && "animate-bounce",
                  )}
                >
                  {/* Job Marker */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold transition-all",
                      job.featured
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                        : job.urgent
                          ? "bg-gradient-to-r from-red-500 to-pink-500"
                          : selectedJob?.id === job.id
                            ? "bg-gradient-to-r from-blue-600 to-purple-600"
                            : "bg-gradient-to-r from-gray-500 to-gray-600",
                    )}
                  >
                    <Briefcase className="w-4 h-4" />
                  </div>

                  {/* Job Info Popup */}
                  {selectedJob?.id === job.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-30">
                      <div className="text-sm">
                        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                          {job.title}
                        </h4>
                        <p className="text-gray-600 mb-1">{job.company}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>{job.district}</span>
                          <span>���</span>
                          <span>{job.distance}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-green-600 font-semibold text-xs">
                            {job.salary}
                          </span>
                          <div className="flex gap-1">
                            {job.featured && (
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            )}
                            {job.urgent && (
                              <Clock className="w-3 h-3 text-red-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                    </div>
                  )}

                  {/* Distance Ring */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full border opacity-30 animate-pulse",
                      job.featured
                        ? "border-yellow-400"
                        : job.urgent
                          ? "border-red-400"
                          : "border-blue-400",
                    )}
                    style={{
                      width: "20px",
                      height: "20px",
                      left: "-6px",
                      top: "-6px",
                    }}
                  ></div>
                </div>
              </div>
            );
          })}

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              وسائل الإيضاح
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                <span>وظائف مميزة</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                <span>وظائف ��اجلة</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full"></div>
                <span>وظائف عادية</span>
              </div>
              {showUserLocation && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <span>موقعك</span>
                </div>
              )}
            </div>
          </div>

          {/* Map Stats */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <Briefcase className="w-3 h-3 text-blue-600" />
                <span>{filteredJobs.length} وظائف على الخريطة</span>
              </div>
              <div className="flex items-center gap-2">
                <Route className="w-3 h-3 text-green-600" />
                <span>
                  مسافة متوسطة:{" "}
                  {Math.round(
                    filteredJobs.reduce(
                      (acc: number, job: any) => acc + parseFloat(job.distance),
                      0,
                    ) / filteredJobs.length,
                  )}{" "}
                  كم
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Near Selected Location */}
        {selectedJob && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <h4 className="font-semibold text-gray-900 mb-2">معلومات الموقع</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">المنطقة:</span>
                <span className="font-medium text-gray-900 mr-2">
                  {selectedJob.district}
                </span>
              </div>
              <div>
                <span className="text-gray-600">وقت الوصول:</span>
                <span className="font-medium text-gray-900 mr-2">
                  {selectedJob.commute_time}
                </span>
              </div>
              {selectedJob.nearbyLandmarks.length > 0 && (
                <div className="col-span-2">
                  <span className="text-gray-600">معالم قريبة:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedJob.nearbyLandmarks.map(
                      (landmark: string, index: number) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                        >
                          {landmark}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Mock data for freelance opportunities - Arabic content
const freelanceOpportunities = [
  {
    id: 1,
    title: "مطلوب طبيب أسنان طوا��ئ نهاية الأسبوع",
    client: "شبكة طوارئ الأسنان",
    location: "بغداد، العراق",
    coordinates: { lat: 33.3152, lng: 44.3661 },
    duration: "عطل الأسبوع المستمرة",
    rate: "40 د.ع/ساعة",
    description:
      "نبحث عن طبيب أ��نان متمرس لتغطية طوارئ نهاية الأسبوع. التعامل مع ال��الات العاجلة مع وحدتنا المتنقلة.",
    skills: ["رعاية الطوارئ", "طب الأسنان المتنقل", "إدارة الألم"],
    posted: "منذ يوم",
    proposals: 12,
    budget: "800-1,500 د.ع/شهر",
    urgent: true,
  },
  {
    id: 2,
    title: "تدريب نظام التشخيص بالذكاء الاصطناعي",
    client: "حلول تك دنتال",
    location: "عن بُعد",
    coordinates: null,
    duration: "أسبوعان",
    rate: "60 د.ع/ساعة",
    description:
      "تدريب المتخصصين في طب الأسنان على برامج التشخيص الجديدة بالذكاء الاصطناعي. إنشا�� م������ تدريبية وإجراء ندوات عبر الإنترنت.",
    skills: ["تقنية الذكاء الاصطناعي", "التدريب", "العرض التقديمي"],
    posted: "منذ 3 أيام",
    proposals: 8,
    budget: "2,400-3,600 د.ع",
    urgent: false,
  },
];

// Mock data for dental professionals - Arabic content
const professionals = [
  {
    id: 1,
    name: "د. سارة أحمد",
    title: "طبيب أسنان عام وأخصائي ذكاء اصطناعي",
    location: "بغداد، العراق",
    coordinates: { lat: 33.3152, lng: 44.3661 },
    experience: "8 سنوات",
    rating: 4.9,
    reviews: 156,
    specialties: [
      "طب الأسنان ال��ام",
      "التشخيص بالذكاء الاصطناعي",
      "سير العمل الرقمي",
    ],
    hourlyRate: "40-55 د.ع",
    availability: "متاح",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    verified: true,
    response_time: "أقل من ساعتين",
    success_rate: "98%",
  },
  {
    id: 2,
    name: "د. محمد علي",
    title: "جراح فم وخبير تكنولوجيا",
    location: "أربيل، العراق",
    coordinates: { lat: 36.1911, lng: 44.0094 },
    experience: "12 سنة",
    rating: 4.8,
    reviews: 203,
    specialties: ["جراحة الفم", "زراعة الأسنان", "التصوير ثلاثي الأبعاد"],
    hourlyRate: "60-80 د.ع",
    availability: "مشغول",
    avatar:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
    verified: true,
    response_time: "أقل من 4 ساعات",
    success_rate: "96%",
  },
  {
    id: 3,
    name: "د. فاطمة حسن",
    title: "طبيب أسنان أطفال",
    location: "البصرة، العراق",
    coordinates: { lat: 30.5085, lng: 47.7804 },
    experience: "6 سنوات",
    rating: 4.9,
    reviews: 98,
    specialties: ["رعاية الأطفال", "الت��دير", "إدارة السلوك"],
    hourlyRate: "35-50 د.ع",
    availability: "متاح",
    avatar:
      "https://images.unsplash.com/photo-1594824475386-67eb4d8b5f59?w=100&h=100&fit=crop&crop=face",
    verified: true,
    response_time: "أقل من ساع��",
    success_rate: "99%",
  },
];

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
}

function JobApplicationModal({
  isOpen,
  onClose,
  job,
}: JobApplicationModalProps) {
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    expectedSalary: "",
    availableStart: "",
    resume: null,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            تقديم طلب للوظيفة: {job?.title}
          </h2>
          <p className="text-gray-600">{job?.company}</p>
          {job?.coordinates && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
              <MapPin className="w-4 h-4" />
              <span>
                {job.district} - المسافة: {job.distance}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              خطاب الغلاف
            </label>
            <textarea
              value={applicationData.coverLetter}
              onChange={(e) =>
                setApplicationData({
                  ...applicationData,
                  coverLetter: e.target.value,
                })
              }
              placeholder="أخبرنا لماذا أنت مثالي لهذا المنصب..."
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الراتب المتوقع
              </label>
              <input
                type="text"
                value={applicationData.expectedSalary}
                onChange={(e) =>
                  setApplicationData({
                    ...applicationData,
                    expectedSalary: e.target.value,
                  })
                }
                placeholder="مثل: 4,000 د.ع"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ البدء المتاح
              </label>
              <input
                type="date"
                value={applicationData.availableStart}
                onChange={(e) =>
                  setApplicationData({
                    ...applicationData,
                    availableStart: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              السيرة الذاتية
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input type="file" className="hidden" id="resume-upload" />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-gray-600">
                  انقر لرفع سيرتك ال��اتية أو اسحب وأفلت
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  PDF، DOC، أو DOCX (حد أقصى 10 ميجابايت)
                </p>
              </label>
            </div>
          </div>

          {job?.coordinates && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Route className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">
                  معلومات الموقع وال��واصلات
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-green-700">
                <div>
                  <span className="font-medium">وقت الوصول المتوقع:</span>
                  <div>{job.commute_time}</div>
                </div>
                <div>
                  <span className="font-medium">المسافة:</span>
                  <div>{job.distance}</div>
                </div>
              </div>
              {job.nearbyLandmarks?.length > 0 && (
                <div className="mt-2">
                  <span className="font-medium text-green-700">
                    معالم قريبة:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {job.nearbyLandmarks.map(
                      (landmark: string, index: number) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                        >
                          {landmark}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-900">
                تحسين الطلب بالذكاء الاصطناعي
              </span>
            </div>
            <p className="text-sm text-purple-700 mb-3">
              دع ذكاءنا الاصطناعي يحسن طلبك لهذا ا����نصب المحدد وي��يد فرص
              نجا��ك.
            </p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
              ��حسين الطلب
            </button>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200"
            >
              إلغاء
            </button>
            <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700">
              إرسال الطلب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Jobs() {
  const { language, t } = useI18n();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("overview");
  const [showJobApplication, setShowJobApplication] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [showMap, setShowMap] = useState(true);
  const [distanceFilter, setDistanceFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleApplyJob = (job: any) => {
    setSelectedJob(job);
    setShowJobApplication(true);
  };

  const handleJobSelect = (job: any) => {
    setSelectedJob(job);
  };

  const handleJobApply = (jobId: number) => {
    const job = jobListings.find((j) => j.id === jobId);
    if (job) {
      handleApplyJob(job);
    }
  };

  // Filter jobs based on location and distance
  const filteredJobs = jobListings.filter((job) => {
    if (
      locationFilter &&
      !job.location.toLowerCase().includes(locationFilter.toLowerCase())
    ) {
      return false;
    }
    if (jobTypeFilter) {
      if (jobTypeFilter === "remote" && !job.remote) return false;
      if (jobTypeFilter === "full-time" && job.type !== "��وام كامل")
        return false;
      if (jobTypeFilter === "part-time" && job.type !== "دوام جزئي")
        return false;
      if (jobTypeFilter === "contract" && job.type !== "عقد مؤقت") return false;
    }
    if (distanceFilter && job.coordinates) {
      const maxDistance = parseInt(distanceFilter);
      const jobDistance = parseFloat(job.distance);
      if (jobDistance > maxDistance) return false;
    }
    return true;
  });

  return (
    <div
      className="min-h-screen bg-gray-50 with-floating-nav"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Unified Header */}
      <UnifiedHeader
        currentSection="jobs"
        customActions={
          <>
            <button
              onClick={() => setShowMap(!showMap)}
              className={cn(
                "px-4 py-2 rounded-lg flex items-center gap-2 transition-colors",
                showMap
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              <Map className="w-4 h-4" />
              <span className="hidden md:block">
                {showMap ? "��خفاء الخريطة" : "عرض الخريطة"}
              </span>
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
              <Plus className="w-4 h-4" />
              <span className="hidden md:block">نشر وظيفة</span>
            </button>
            <Link
              to="/community-jobs-admin"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-lg border border-gray-300 hover:border-green-300"
            >
              <span className="hidden md:block">لوحة الإدارة</span>
            </Link>
          </>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Navigation Tabs */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">من��ة الوظائف</h3>
                </div>
                <nav className="p-2">
                  {[
                    { id: "browse", label: "تصفح الوظائف", icon: Search },
                    { id: "freelance", label: "العمل الحر", icon: Clock },
                    {
                      id: "professionals",
                      label: "البحث عن م��ترفين",
                      icon: Users,
                    },
                    {
                      id: "my-jobs",
                      label: "طلب��تي",
                      icon: Briefcase,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    التص��ية
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الموقع
                    </label>
                    <input
                      type="text"
                      placeholder="المدينة، المحافظة"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المسافة القصوى (كم)
                    </label>
                    <select
                      value={distanceFilter}
                      onChange={(e) => setDistanceFilter(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">جميع المسا��ات</option>
                      <option value="5">5 كم</option>
                      <option value="10">10 كم</option>
                      <option value="25">25 كم</option>
                      <option value="50">50 كم</option>
                      <option value="100">100 كم</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع الوظيفة
                    </label>
                    <select
                      value={jobTypeFilter}
                      onChange={(e) => setJobTypeFilter(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">جميع الأنواع</option>
                      <option value="full-time">دوام كامل</option>
                      <option value="part-time">دوام جزئي</option>
                      <option value="contract">عقد مؤقت</option>
                      <option value="remote">عن بُعد</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مستوى ا��خبرة
                    </label>
                    <div className="space-y-2">
                      {["م��تدئ", "مت��سط", "خبير"].map((level) => (
                        <label key={level} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-700">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  إحصائيات المنصة
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      الوظائف النشطة
                    </span>
                    <span className="font-semibold text-blue-600">
                      {filteredJobs.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">المت��صصون</span>
                    <span className="font-semibold text-green-600">5,678</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      الوظائف عن بُعد
                    </span>
                    <span className="font-semibold text-purple-600">
                      {filteredJobs.filter((job) => job.remote).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Interactive Map */}
            {showMap && activeTab === "browse" && (
              <div className="mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Map className="w-5 h-5" />
                      خريطة الوظائف ا��تفاعلية
                    </h2>
                    <button
                      onClick={() => setShowMap(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <InteractiveJobsMap
                    jobs={filteredJobs}
                    selectedJob={selectedJob}
                    onJobSelect={handleJobSelect}
                    onJobApply={handleJobApply}
                  />
                </div>
              </div>
            )}

            {activeTab === "browse" && (
              <div className="space-y-6">
                {/* Featured Jobs Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
                  <h1 className="text-2xl font-bold mb-2">
                    اعثر على وظيفة ال��سنان المثالية
                  </h1>
                  <p className="text-blue-100">
                    آلاف الفرص من أفضل عيادات الأسنان
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      وظائف مطابق�� بالذكاء الاص��ناعي
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      أصحاب عمل معتمدون
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      مناصب عالية الأجر
                    </div>
                    <div className="flex items-center gap-2">
                      <Route className="w-4 h-4" />
                      خريطة تفاعلية للمواقع
                    </div>
                  </div>
                </div>

                {/* Job Listings */}
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className={cn(
                        "bg-white rounded-xl shadow-sm border hover:shadow-md transition-all cursor-pointer",
                        selectedJob?.id === job.id
                          ? "border-blue-500 ring-2 ring-blue-100"
                          : "border-gray-200",
                      )}
                      onClick={() => handleJobSelect(job)}
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={job.logo}
                            alt={job.company}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {job.title}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Building className="w-4 h-4" />
                                  <span>{job.company}</span>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm">
                                      {job.company_rating}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                  <Heart className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                                  <Share2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                                {job.coordinates && (
                                  <span className="text-blue-600 ml-1">
                                    ({job.distance})
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {job.type}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {job.salary}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {job.posted}
                              </div>
                              {job.coordinates && (
                                <div className="flex items-center gap-1 text-blue-600">
                                  <Route className="w-4 h-4" />
                                  {job.commute_time}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              {job.featured && (
                                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                  <Star className="w-3 h-3" />
                                  مميز
                                </span>
                              )}
                              {job.remote && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                  عن بُعد
                                </span>
                              )}
                              {job.urgent && (
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                                  عاجل
                                </span>
                              )}
                              {job.coordinates && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                  <Navigation className="w-3 h-3" />
                                  يمكن الوصول
                                </span>
                              )}
                            </div>

                            <p className="text-gray-700 mb-4">
                              {job.description}
                            </p>

                            {job.coordinates &&
                              job.nearbyLandmarks.length > 0 && (
                                <div className="mb-4">
                                  <span className="text-sm text-gray-600">
                                    معالم قريبة:
                                  </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {job.nearbyLandmarks
                                      .slice(0, 2)
                                      .map(
                                        (landmark: string, index: number) => (
                                          <span
                                            key={index}
                                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                                          >
                                            {landmark}
                                          </span>
                                        ),
                                      )}
                                  </div>
                                </div>
                              )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {job.applicants} متقدم
                                </div>
                                <div className="flex items-center gap-1">
                                  <Building className="w-4 h-4" />
                                  {job.company_size} موظف
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                  حفظ الوظيفة
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApplyJob(job);
                                  }}
                                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  تقدم الآن
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "freelance" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    فرص العمل الحر
                  </h2>
                  <p className="text-gray-600">
                    اعثر على عمل حر مرن يناسب جدولك الزمني.
                  </p>
                </div>

                <div className="space-y-4">
                  {freelanceOpportunities.map((opportunity) => (
                    <div
                      key={opportunity.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {opportunity.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              {opportunity.client}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {opportunity.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {opportunity.duration}
                            </div>
                          </div>
                        </div>
                        {opportunity.urgent && (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                            عاجل
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 mb-4">
                        {opportunity.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {opportunity.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="font-semibold text-green-600">
                            {opportunity.rate}
                          </div>
                          <div className="text-gray-500">
                            الميزانية: {opportunity.budget}
                          </div>
                          <div className="text-gray-500">
                            {opportunity.proposals} اقتراح
                          </div>
                        </div>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          إرسال اقتراح
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "professionals" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    البح�� عن متخصصي الأسنان
                  </h2>
                  <p className="text-gray-600">
                    ��واصل مع أطباء أسنان وأخصائيين مؤهلين لعيادتك.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {professionals.map((professional) => (
                    <div
                      key={professional.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={professional.avatar}
                          alt={professional.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {professional.name}
                            </h3>
                            {professional.verified && (
                              <CheckCircle className="w-5 h-5 text-blue-500" />
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">
                            {professional.title}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {professional.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              {professional.experience}
                            </div>
                          </div>
                        </div>
                        <div
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            professional.availability === "متاح"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700",
                          )}
                        >
                          {professional.availability}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {professional.rating}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({professional.reviews} تقييم)
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          الرد: {professional.response_time}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {professional.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold text-gray-900">
                          {professional.hourlyRate}/ساعة
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-500 border border-gray-300 rounded-lg">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            تو��يف الآن
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "my-jobs" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    طلبات العمل الخاصة بي
                  </h2>
                  <p className="text-gray-600">
                    تتبع طلبات العمل وإدارة تقدم مسيرتك المهنية.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      12
                    </div>
                    <div className="text-blue-900 font-medium">تم التقديم</div>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      5
                    </div>
                    <div className="text-yellow-900 font-medium">
                      قيد المراجعة
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      2
                    </div>
                    <div className="text-green-900 font-medium">مقابلات</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    الطلبات الأخيرة
                  </h3>
                  <div className="space-y-4">
                    {filteredJobs.slice(0, 3).map((job, index) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={job.logo}
                            alt={job.company}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {job.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {job.company}
                            </p>
                            <p className="text-xs text-gray-500">
                              تم التقديم {job.posted}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium mb-2",
                              index === 0
                                ? "bg-green-100 text-green-700"
                                : index === 1
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-blue-100 text-blue-700",
                            )}
                          >
                            {index === 0
                              ? "مقابلة مجدولة"
                              : index === 1
                                ? "قيد المراجعة"
                                : "تم إرسال الطلب"}
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 text-sm">
                            عرض التفاصيل
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Job Application Modal */}
      <JobApplicationModal
        isOpen={showJobApplication}
        onClose={() => setShowJobApplication(false)}
        job={selectedJob}
      />

      {/* Bottom padding handled by CSS */}
    </div>
  );
}
