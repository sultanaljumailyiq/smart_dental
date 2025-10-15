import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building2, Plus, Edit, Trash2, Settings, Users, Calendar, MapPin, Phone, Mail, Globe, Copy, Check, ArrowLeft, UserPlus, Stethoscope, Clock, Star, DollarSign, FileText, BarChart3, Shield, Key, Wifi, Camera, Save, X, Search, Filter, MoreVertical, ExternalLink, Database, UserCheck, TrendingUp, Activity, PieChart, ToggleLeft, ToggleRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/contexts/NavigationContext";
import { ChevronDown, ChevronUp } from "lucide-react";
interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  bookingUrl: string;
  logo?: string;
  description: string;
  specialties: string[];
  workingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  doctors: Doctor[];
  isActive: boolean;
  rating: number;
  totalAppointments: number;
  monthlyRevenue: number;
  createdAt: string;
}
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  avatar?: string;
  experience: number;
  rating: number;
  isActive: boolean;
  workingDays: string[];
  consultationFee: number;
  bio: string;
}

// Mock data
const mockClinics: Clinic[] = [{
  id: "1",
  name: "عيادة الابتسامة الذهبية",
  address: "شارع الكرادة، بغداد، العراق",
  phone: "+964 770 123 4567",
  email: "info@goldsmile.iq",
  website: "https://goldsmile.iq",
  bookingUrl: "https://book.goldsmile.iq/appointments",
  description: "عيادة متخصصة في طب الأسنان التجميلي والعلاجي",
  specialties: ["تقويم الأسنان", "زراعة الأسنان", "تجميل الأسنان", "علاج الجذور"],
  workingHours: {
    sunday: {
      open: "09:00",
      close: "17:00",
      isOpen: true
    },
    monday: {
      open: "09:00",
      close: "17:00",
      isOpen: true
    },
    tuesday: {
      open: "09:00",
      close: "17:00",
      isOpen: true
    },
    wednesday: {
      open: "09:00",
      close: "17:00",
      isOpen: true
    },
    thursday: {
      open: "09:00",
      close: "17:00",
      isOpen: true
    },
    friday: {
      open: "10:00",
      close: "14:00",
      isOpen: true
    },
    saturday: {
      open: "09:00",
      close: "17:00",
      isOpen: false
    }
  },
  doctors: [{
    id: "1",
    name: "د. أحمد محمد علي",
    specialty: "تقويم الأسنان",
    email: "dr.ahmed@goldsmile.iq",
    phone: "+964 770 111 2222",
    experience: 10,
    rating: 4.8,
    isActive: true,
    workingDays: ["sunday", "monday", "tuesday", "wednesday", "thursday"],
    consultationFee: 50000,
    bio: "أخصائي تقويم الأسنان مع خبرة 10 سنوات في العلاج والتجميل"
  }, {
    id: "2",
    name: "د. فاطمة حسن",
    specialty: "طب أسنان الأطفال",
    email: "dr.fatima@goldsmile.iq",
    phone: "+964 770 333 4444",
    experience: 8,
    rating: 4.9,
    isActive: true,
    workingDays: ["sunday", "tuesday", "thursday", "friday"],
    consultationFee: 40000,
    bio: "طبيبة أسنان متخصصة في علاج الأطفال وطب الأسنان الوقائي"
  }],
  isActive: true,
  rating: 4.8,
  totalAppointments: 1250,
  monthlyRevenue: 15000000,
  createdAt: "2023-01-15"
}, {
  id: "2",
  name: "مركز الأسنان المتقدم",
  address: "حي الجادرية، بغداد، العراق",
  phone: "+964 770 555 6666",
  email: "contact@advanceddental.iq",
  bookingUrl: "https://appointments.advanceddental.iq",
  description: "مركز طبي متكامل لجميع خدمات طب الأسنان",
  specialties: ["جراحة الفم", "زراعة الأسنان", "تركيبات الأسنان"],
  workingHours: {
    sunday: {
      open: "08:00",
      close: "18:00",
      isOpen: true
    },
    monday: {
      open: "08:00",
      close: "18:00",
      isOpen: true
    },
    tuesday: {
      open: "08:00",
      close: "18:00",
      isOpen: true
    },
    wednesday: {
      open: "08:00",
      close: "18:00",
      isOpen: true
    },
    thursday: {
      open: "08:00",
      close: "18:00",
      isOpen: true
    },
    friday: {
      open: "09:00",
      close: "13:00",
      isOpen: true
    },
    saturday: {
      open: "08:00",
      close: "18:00",
      isOpen: false
    }
  },
  doctors: [{
    id: "3",
    name: "د. محمد الجبوري",
    specialty: "جراحة الفم والوجه والفكين",
    email: "dr.mohammed@advanceddental.iq",
    phone: "+964 770 777 8888",
    experience: 15,
    rating: 4.9,
    isActive: true,
    workingDays: ["sunday", "monday", "wednesday", "thursday"],
    consultationFee: 75000,
    bio: "جراح فم ووجه وفكين مع خبرة واسعة في العمليات المعقدة"
  }],
  isActive: true,
  rating: 4.7,
  totalAppointments: 890,
  monthlyRevenue: 12000000,
  createdAt: "2023-03-10"
}];
export default function AdvancedClinicManagement() {
  const {
    goBack
  } = useNavigation();
  const [clinics, setClinics] = useState<Clinic[]>(mockClinics);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [showAddClinic, setShowAddClinic] = useState(false);
  const [showEditClinic, setShowEditClinic] = useState(false);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [useOldManager, setUseOldManager] = useState(false);
  const [activeSubSection, setActiveSubSection] = useState<"clinics" | "staff" | "reports" | "database">("clinics");
  
  // Load system preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('defaultClinicSystem');
    if (saved === 'old') {
      setUseOldManager(true);
    }
  }, []);
  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);else next.add(id);
      return next;
    });
  };
  const updateClinicField = <K extends keyof Clinic,>(id: string, field: K, value: Clinic[K]) => {
    setClinics(prev => prev.map(c => c.id === id ? {
      ...c,
      [field]: value
    } : c));
  };
  const copyBookingUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };
  const filteredClinics = clinics.filter(clinic => clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) || clinic.address.toLowerCase().includes(searchTerm.toLowerCase()));

  // Sub-sections components
  const StaffManagementSection = () => <div className="space-y-3">
      <div className="bg-white rounded-lg p-3 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-blue-600" />
          إدارة الكادر الطبي
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-700">إجمالي الأطباء</p>
            <p className="text-lg font-bold text-gray-900">{clinics.reduce((acc, clinic) => acc + clinic.doctors.length, 0)}</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-700">الكادر النشط</p>
            <p className="text-lg font-bold text-green-600">{clinics.reduce((acc, clinic) => acc + clinic.doctors.filter(d => d.isActive).length, 0)}</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="flex-1 text-xs px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
            إضافة طبيب
          </button>
          <button className="flex-1 text-xs px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
            إدارة المناوبات
          </button>
        </div>
      </div>
    </div>;
  const ReportsSection = () => <div className="space-y-3">
      <div className="bg-white rounded-lg p-3 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-purple-600" />
          التقارير والإحصائيات
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-700">تقارير المبيعات</p>
            <button className="text-xs text-purple-600 mt-1">عرض</button>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-700">تقارير المرضى</p>
            <button className="text-xs text-purple-600 mt-1">عرض</button>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-700">الأداء المالي</p>
            <button className="text-xs text-purple-600 mt-1">عرض</button>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-700">تقييم الأطباء</p>
            <button className="text-xs text-purple-600 mt-1">عرض</button>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="flex-1 text-xs px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100">
            تصدير البيانات
          </button>
          <button className="flex-1 text-xs px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100">
            تقرير شامل
          </button>
        </div>
      </div>
    </div>;
  const DatabaseSection = () => <div className="space-y-3">
      <div className="bg-white rounded-lg p-3 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-600" />
          إدارة قاعدة البيانات
        </h3>
        <div className="space-y-2">
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-700">نسخ احتياطي</p>
              <button className="text-xs text-indigo-600">إنشاء</button>
            </div>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-700">استيراد البيانات</p>
              <button className="text-xs text-indigo-600">رفع</button>
            </div>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-700">تصدير البيانات</p>
              <button className="text-xs text-indigo-600">تحميل</button>
            </div>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-700">تنظيف قاعدة البيانات</p>
              <button className="text-xs text-red-600">تنظيف</button>
            </div>
          </div>
        </div>
      </div>
    </div>;
  return <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="p-2 md:p-4 lg:p-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-4 h-4 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-lg md:text-xl font-bold text-gray-900">إدارة العيادات المتقدمة</h1>
                  
                </div>
              </div>

              {/* System Toggle Switch */}
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
                <span className="text-xs text-gray-600">قديم</span>
                <button 
                  onClick={() => {
                    setUseOldManager(true);
                    localStorage.setItem('defaultClinicSystem', 'old');
                  }} 
                  className="relative"
                >
                  {useOldManager ? (
                    <ToggleRight className="w-6 h-6 text-blue-600" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
                <span className="mx-1 text-xs text-gray-400">|</span>
                <button 
                  onClick={() => {
                    setUseOldManager(false);
                    localStorage.setItem('defaultClinicSystem', 'new');
                  }} 
                  className="relative"
                >
                  {!useOldManager ? (
                    <ToggleRight className="w-6 h-6 text-blue-600" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
                <span className="text-xs text-gray-600">جديد</span>
              </div>
            </div>

            {/* Sub-navigation */}
            <div className="flex bg-white rounded-lg p-1 border border-gray-200 mb-4">
              {[{
              id: "clinics",
              label: "العيادات",
              icon: Building2
            }, {
              id: "staff",
              label: "الكادر",
              icon: Users
            }, {
              id: "reports",
              label: "التقارير",
              icon: BarChart3
            }, {
              id: "database",
              label: "قاعدة البيانات",
              icon: Database
            }].map(section => <button key={section.id} onClick={() => setActiveSubSection(section.id as any)} className={cn("flex-1 flex items-center justify-center gap-1 py-2 px-2 md:px-3 rounded-lg transition-all text-xs md:text-sm", activeSubSection === section.id ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50")}>
                  <section.icon className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden md:inline">{section.label}</span>
                </button>)}
            </div>

            {activeSubSection === "clinics" && <div className="flex flex-col md:flex-row gap-3 justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="ابحث في العيادات..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pr-10 pl-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>

                <button onClick={() => setShowAddClinic(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm text-sm">
                  <Plus className="w-4 h-4" />
                  إضافة عيادة
                </button>
              </div>}
          </div>

          {/* Content based on active sub-section */}
          {activeSubSection === "staff" && <StaffManagementSection />}
          {activeSubSection === "reports" && <ReportsSection />}
          {activeSubSection === "database" && <DatabaseSection />}

          {activeSubSection === "clinics" && <>
              {/* Stats Overview - Compact */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4">
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs">العيادات</p>
                      <p className="text-lg md:text-xl font-bold text-gray-900">{clinics.length}</p>
                    </div>
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-3 h-3 md:w-4 md:h-4 text-indigo-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs">الأطباء</p>
                      <p className="text-lg md:text-xl font-bold text-gray-900">
                        {clinics.reduce((acc, clinic) => acc + clinic.doctors.length, 0)}
                      </p>
                    </div>
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs">المواعيد</p>
                      <p className="text-lg md:text-xl font-bold text-gray-900">
                        {clinics.reduce((acc, clinic) => acc + clinic.totalAppointments, 0)}
                      </p>
                    </div>
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs">الإيرادات</p>
                      <p className="text-lg md:text-xl font-bold text-gray-900">
                        {(clinics.reduce((acc, clinic) => acc + clinic.monthlyRevenue, 0) / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinics Grid - Compact */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                {filteredClinics.map(clinic => <div key={clinic.id} className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
                    {/* Clinic Header - Very Compact */}
                    <div className="p-3 border-b border-gray-100">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-white" />
                          </div>
                          
                        </div>

                        <div className="flex items-center gap-1">
                          <div className={cn("w-2 h-2 rounded-full", clinic.isActive ? "bg-green-500" : "bg-red-500")} />
                          <span className={cn("text-xs font-medium", clinic.isActive ? "text-green-600" : "text-red-600")}>
                            {clinic.isActive ? "نشطة" : "معطلة"}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">{clinic.description}</p>

                      {/* Compact Info */}
                      
                    </div>

                    <div className="px-3 py-2 flex items-center justify-end border-b border-gray-100">
                      <button onClick={() => toggleExpanded(clinic.id)} className="text-xs text-gray-600 hover:text-gray-900 inline-flex items-center gap-1">
                        {expandedIds.has(clinic.id) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        تفاصيل
                      </button>
                    </div>

                    <div className={expandedIds.has(clinic.id) ? "block" : "hidden"}>
                      {/* Booking URL - Very Compact */}
                      <div className="px-3 py-2 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-700 mb-0.5">رابط الحجز</p>
                            <p className="text-xs text-gray-500 truncate">{clinic.bookingUrl}</p>
                          </div>
                          <button onClick={() => copyBookingUrl(clinic.bookingUrl)} className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ml-2">
                            {copiedUrl === clinic.bookingUrl ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-500" />}
                          </button>
                        </div>
                      </div>

                      {/* Doctors - Very Compact */}
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-gray-900">الكادر الطبي ({clinic.doctors.length})</h4>
                          <button onClick={() => {
                      setSelectedClinic(clinic);
                      setShowAddDoctor(true);
                    }} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium">
                            إضافة
                          </button>
                        </div>

                        {/* Compact Doctors List */}
                        <div className="space-y-2">
                          {clinic.doctors.slice(0, 2).map(doctor => <div key={doctor.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <div className="w-5 h-5 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Stethoscope className="w-3 h-3 text-indigo-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-xs truncate">{doctor.name}</p>
                                <p className="text-xs text-gray-600 truncate">{doctor.specialty}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-gray-600">{doctor.rating}</span>
                              </div>
                            </div>)}
                        </div>

                        {clinic.doctors.length > 2 && <p className="text-xs text-gray-500 text-center mt-2">
                            +{clinic.doctors.length - 2} أطباء آخرين
                          </p>}
                      </div>
                    </div>

                    {/* Actions - Compact */}
                    <div className="p-3 border-t border-gray-100">
                      <div className="flex gap-2">
                        <Link 
                          to={useOldManager ? "/clinic_old" : "/clinic"} 
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <Settings className="w-3 h-3" />
                          <span className="text-xs font-medium">إدارة</span>
                        </Link>

                        <Link 
                          to={useOldManager ? "/clinic_old/reports" : "/clinic/reports"} 
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <BarChart3 className="w-3 h-3" />
                          <span className="text-xs font-medium">تقارير</span>
                        </Link>

                        <button className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>)}
              </div>

              {/* Empty State */}
              {filteredClinics.length === 0 && <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-base font-medium text-gray-900 mb-2">لا توجد عيادات</h3>
                  <p className="text-gray-600 text-sm mb-4">ابدأ بإضافة عيادة جديدة لإدارة خدماتك الطبية</p>
                  <button onClick={() => setShowAddClinic(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mx-auto text-sm">
                    <Plus className="w-4 h-4" />
                    إضافة عيادة جديدة
                  </button>
                </div>}
            </>}
        </div>
      </div>

      {/* Modals would go here - Add Clinic, Edit Clinic, Add Doctor */}
    </div>;
}