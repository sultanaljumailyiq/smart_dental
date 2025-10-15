import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Plus,
  MapPin,
  Phone,
  Users,
  Calendar,
  BarChart3,
  Edit,
  Settings,
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  Link2,
  QrCode,
  Copy,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sharedClinicData, Clinic, ClinicStats, Staff } from "@/services/sharedClinicData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ClinicSettings from "./settings/ClinicSettings";

type UIMode = "modern" | "legacy";
type View = "dashboard" | "add" | "edit" | "reports" | "booking-settings" | "settings";

export default function ClinicsManager() {
  const navigate = useNavigate();
  const [uiMode, setUiMode] = useState<UIMode>("modern");
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBookingClinicId, setSelectedBookingClinicId] = useState<string | null>(null);
  const [isClinicSelectorOpen, setIsClinicSelectorOpen] = useState(false);

  useEffect(() => {
    const loadClinics = async () => {
      const data = await sharedClinicData.getClinics();
      setClinics(data);
      setLoading(false);
    };
    loadClinics();
  }, []);

  const selectedClinic = selectedClinicId
    ? clinics.find((c) => c.id === selectedClinicId)
    : null;

  const handleManageClinic = (clinicId: string) => {
    const clinic = clinics.find((c) => c.id === clinicId);
    if (!clinic) return;

    // All clinic management uses the old system exclusively
    navigate(`/clinic_old?clinicId=${clinicId}`);
  };

  const handleEditClinic = (clinicId: string) => {
    setSelectedClinicId(clinicId);
    setCurrentView("edit");
  };

  const handleStaffManagement = (clinicId: string) => {
    navigate(`/clinic/advanced-staff-management?clinicId=${clinicId}`);
  };

  const handleReports = (clinicId: string) => {
    setSelectedClinicId(clinicId);
    setCurrentView("reports");
  };

  const handleBookingLink = (clinicId: string) => {
    setSelectedBookingClinicId(clinicId);
    setShowBookingModal(true);
  };

  const handleEditBookingSettings = (clinicId: string) => {
    setSelectedClinicId(clinicId);
    setCurrentView("booking-settings");
  };

  const handleClinicSettings = (clinicId: string) => {
    setSelectedClinicId(clinicId);
    setCurrentView("settings");
  };

  const copyBookingLink = (clinicId: string) => {
    const bookingUrl = `${window.location.origin}/simplified-booking/${clinicId}`;
    navigator.clipboard.writeText(bookingUrl);
    toast.success("تم نسخ رابط الحجز!");
  };

  const downloadQRCode = async (clinicId: string) => {
    const clinic = clinics.find((c) => c.id === clinicId);
    const bookingUrl = `${window.location.origin}/simplified-booking/${clinicId}`;
    
    try {
      // Generate QR code using external API
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(bookingUrl)}`;
      
      // Fetch the image as a blob
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      
      // Create object URL from blob
      const objectUrl = URL.createObjectURL(blob);
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `booking-qr-${clinic?.nameAr || clinicId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Revoke object URL to free memory
      URL.revokeObjectURL(objectUrl);
      
      toast.success(`تم تحميل رمز QR لعيادة ${clinic?.nameAr}`);
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل رمز QR");
      console.error("QR download error:", error);
    }
  };

  if (currentView === "add") {
    return <AddEditClinicForm onBack={() => setCurrentView("dashboard")} />;
  }

  if (currentView === "edit" && selectedClinic) {
    return (
      <AddEditClinicForm
        clinic={selectedClinic}
        onBack={() => {
          setCurrentView("dashboard");
          setSelectedClinicId(null);
        }}
      />
    );
  }

  if (currentView === "reports" && selectedClinic) {
    return (
      <ReportsSection
        clinic={selectedClinic}
        onBack={() => {
          setCurrentView("dashboard");
          setSelectedClinicId(null);
        }}
      />
    );
  }

  if (currentView === "booking-settings" && selectedClinic) {
    return (
      <BookingSettingsForm
        clinic={selectedClinic}
        onBack={() => {
          setCurrentView("dashboard");
          setSelectedClinicId(null);
        }}
      />
    );
  }

  if (currentView === "settings" && selectedClinic) {
    return (
      <ClinicSettingsWrapper
        clinic={selectedClinic}
        onBack={() => {
          setCurrentView("dashboard");
          setSelectedClinicId(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Clinic Quick Selector */}
            {clinics.length > 0 && (
              <div className="relative z-50">
                <button
                  onClick={() => setIsClinicSelectorOpen(!isClinicSelectorOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors min-w-[250px]"
                >
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <div className="flex-1 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {selectedClinicId ? clinics.find(c => c.id === selectedClinicId)?.nameAr : "اختر عيادة"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedClinicId ? clinics.find(c => c.id === selectedClinicId)?.address : "للانتقال السريع"}
                    </div>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-gray-600 transition-transform", isClinicSelectorOpen && "rotate-180")} />
                </button>
                
                {isClinicSelectorOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-[100] overflow-hidden max-h-[300px] overflow-y-auto">
                    {clinics.map((clinic) => (
                      <button
                        key={clinic.id}
                        onClick={() => {
                          handleManageClinic(clinic.id);
                          setSelectedClinicId(clinic.id);
                          setIsClinicSelectorOpen(false);
                        }}
                        className={cn(
                          "w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors",
                          selectedClinicId === clinic.id && "bg-blue-50"
                        )}
                      >
                        <div className="text-sm font-medium text-gray-900">{clinic.nameAr}</div>
                        <div className="text-xs text-gray-500">{clinic.address}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={() => setCurrentView("add")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة عيادة جديدة
            </Button>
          </div>
        </div>
      </div>

      {/* Clinics Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {clinics.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              لا توجد عيادات بعد
            </h3>
            <p className="text-gray-600 mb-6">ابدأ بإضافة أول عيادة لك</p>
            <Button
              onClick={() => setCurrentView("add")}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة عيادة جديدة
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinics.map((clinic) => (
              <ClinicCard
                key={clinic.id}
                clinic={clinic}
                uiMode={uiMode}
                totalClinics={clinics.length}
                onEdit={handleEditClinic}
                onManage={handleManageClinic}
                onStaff={handleStaffManagement}
                onReports={handleReports}
                onBookingLink={handleBookingLink}
                onEditBooking={handleEditBookingSettings}
                onSettings={handleClinicSettings}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Link Modal */}
      {showBookingModal && selectedBookingClinicId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">رابط الحجز</h2>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedBookingClinicId(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">رابط الحجز الإلكتروني:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/simplified-booking/${selectedBookingClinicId}`}
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => copyBookingLink(selectedBookingClinicId)}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => downloadQRCode(selectedBookingClinicId)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <QrCode className="w-5 h-5" />
                  تحميل QR
                </button>
                <button
                  onClick={() => {
                    handleEditBookingSettings(selectedBookingClinicId);
                    setShowBookingModal(false);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  إعدادات الحجز
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Clinic Card Component
function ClinicCard({
  clinic,
  uiMode,
  totalClinics,
  onEdit,
  onManage,
  onStaff,
  onReports,
  onBookingLink,
  onEditBooking,
  onSettings,
}: {
  clinic: Clinic;
  uiMode: UIMode;
  totalClinics: number;
  onEdit: (id: string) => void;
  onManage: (id: string) => void;
  onStaff: (id: string) => void;
  onReports: (id: string) => void;
  onBookingLink: (id: string) => void;
  onEditBooking: (id: string) => void;
  onSettings: (id: string) => void;
}) {
  const [stats, setStats] = useState<ClinicStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const data = await sharedClinicData.getClinicStats();
      setStats(data);
    };
    loadStats();
  }, [clinic.id]);

  if (!stats) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-24 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  return (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Clinic Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {clinic.nameAr}
                        </h3>
                        <p className="text-indigo-100 text-sm">
                          {clinic.doctorName}
                        </p>
                      </div>
                      {clinic.onlineBookingEnabled && (
                        <CheckCircle2 className="w-5 h-5 text-green-300" />
                      )}
                    </div>
                  </div>

                  {/* Clinic Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 ml-2 text-gray-400" />
                      {clinic.address}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 ml-2 text-gray-400" />
                      {clinic.phone}
                    </div>

                    {/* Stats Grid - Using global stats as placeholder */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Users className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {Math.floor(stats.totalPatients / totalClinics) || 0}
                        </div>
                        <div className="text-xs text-gray-500">مريض</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Calendar className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {Math.floor(stats.todayAppointments / totalClinics) || 0}
                        </div>
                        <div className="text-xs text-gray-500">موعد اليوم</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-3">
                      <Button
                        onClick={() => onEdit(clinic.id)}
                        variant="outline"
                        size="sm"
                        className="text-gray-700 border-gray-300 hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4 ml-2" />
                        تعديل
                      </Button>
                      <Button
                        onClick={() => onManage(clinic.id)}
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        <Settings className="w-4 h-4 ml-2" />
                        إدارة
                      </Button>
                    </div>

                  {/* Additional Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => onStaff(clinic.id)}
                      className="px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Users className="w-4 h-4 inline ml-1" />
                      الموظفين
                    </button>
                    <button
                      onClick={() => onReports(clinic.id)}
                      className="px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <BarChart3 className="w-4 h-4 inline ml-1" />
                      التقارير
                    </button>
                    <button
                      onClick={() => onBookingLink(clinic.id)}
                      className="px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Link2 className="w-4 h-4 inline ml-1" />
                      رابط الحجز
                    </button>
                    <button
                      onClick={() => onSettings(clinic.id)}
                      className="px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4 inline ml-1" />
                      إعدادات
                    </button>
                  </div>
                </div>
              </div>
  );
}

// Add/Edit Clinic Form Component
function AddEditClinicForm({
  clinic,
  onBack,
}: {
  clinic?: any;
  onBack: () => void;
}) {
  const [formData, setFormData] = useState({
    nameAr: clinic?.nameAr || "",
    name: clinic?.name || "",
    address: clinic?.address || "",
    city: clinic?.city || "",
    phone: clinic?.phone || "",
    email: clinic?.email || "",
    doctorName: clinic?.doctorName || "",
    specializations: clinic?.specializations?.join(", ") || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare clinic data
    const clinicData = {
      ...formData,
      specializations: formData.specializations.split(',').map(s => s.trim()).filter(Boolean),
      onlineBookingEnabled: true,
      doctorId: "current-doctor", // In real app, get from auth context
    };

    // For now, just log the data (real implementation would call actual service methods)
    console.log(clinic ? "Updating clinic:" : "Creating clinic:", clinicData);
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 ml-2" />
            رجوع
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {clinic ? "تعديل بيانات العيادة" : "إضافة عيادة جديدة"}
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم العيادة (عربي)
                </label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) =>
                    setFormData({ ...formData, nameAr: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinic Name (English)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدينة
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الطبيب
                </label>
                <input
                  type="text"
                  value={formData.doctorName}
                  onChange={(e) =>
                    setFormData({ ...formData, doctorName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التخصصات (افصل بفاصلة)
                </label>
                <input
                  type="text"
                  value={formData.specializations}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specializations: e.target.value,
                    })
                  }
                  placeholder="تقويم أسنان, زراعة, تجميل"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={onBack}>
                إلغاء
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {clinic ? "حفظ التعديلات" : "إضافة العيادة"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Reports Section Component
function ReportsSection({ clinic, onBack }: { clinic: Clinic; onBack: () => void }) {
  const [stats, setStats] = useState<ClinicStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const data = await sharedClinicData.getClinicStats();
      setStats(data);
    };
    loadStats();
  }, [clinic.id]);

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 ml-2" />
            رجوع
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            التقارير - {clinic.nameAr}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalPatients}</div>
            <div className="text-sm text-gray-600">إجمالي المرضى</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</div>
            <div className="text-sm text-gray-600">المواعيد اليوم</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.monthlyRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">الإيرادات الشهرية (IQD)</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.activeStaff}</div>
            <div className="text-sm text-gray-600">الموظفين النشطين</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            التقارير التفصيلية
          </h2>
          <div className="text-center py-12 text-gray-500">
            سيتم إضافة التقارير التفصيلية قريباً
          </div>
        </div>
      </div>
    </div>
  );
}

// Booking Settings Form Component
function BookingSettingsForm({ clinic, onBack }: { clinic: Clinic; onBack: () => void }) {
  const [settings, setSettings] = useState({
    onlineBookingEnabled: clinic.onlineBookingEnabled !== undefined ? clinic.onlineBookingEnabled : true,
    autoConfirm: false,
    requireDeposit: false,
    depositAmount: "",
    bookingHoursAdvance: 24,
    maxDailyBookings: 20,
    workingHours: {
      start: "09:00",
      end: "17:00",
    },
    workingDays: ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"],
    notificationEmail: clinic.email || "",
    notificationPhone: clinic.phone || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving booking settings:", settings);
    toast.success("تم حفظ إعدادات الحجز بنجاح!");
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 ml-2" />
            رجوع
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            إعدادات الحجز - {clinic.nameAr}
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Online Booking Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">تفعيل الحجز الإلكتروني</h3>
                <p className="text-sm text-gray-600">السماح للمرضى بحجز المواعيد عبر الإنترنت</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.onlineBookingEnabled}
                  onChange={(e) => setSettings({ ...settings, onlineBookingEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ساعات العمل - البداية
                </label>
                <input
                  type="time"
                  value={settings.workingHours.start}
                  onChange={(e) => setSettings({
                    ...settings,
                    workingHours: { ...settings.workingHours, start: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ساعات العمل - النهاية
                </label>
                <input
                  type="time"
                  value={settings.workingHours.end}
                  onChange={(e) => setSettings({
                    ...settings,
                    workingHours: { ...settings.workingHours, end: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحد الأقصى للحجوزات اليومية
                </label>
                <input
                  type="number"
                  value={settings.maxDailyBookings}
                  onChange={(e) => setSettings({ ...settings, maxDailyBookings: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحجز المسبق (بالساعات)
                </label>
                <input
                  type="number"
                  value={settings.bookingHoursAdvance}
                  onChange={(e) => setSettings({ ...settings, bookingHoursAdvance: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Notification Settings */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الإشعارات</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني للإشعارات
                  </label>
                  <input
                    type="email"
                    value={settings.notificationEmail}
                    onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف للإشعارات
                  </label>
                  <input
                    type="tel"
                    value={settings.notificationPhone}
                    onChange={(e) => setSettings({ ...settings, notificationPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={onBack}>
                إلغاء
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                حفظ الإعدادات
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Clinic Settings Wrapper Component
function ClinicSettingsWrapper({ clinic, onBack }: { clinic: Clinic; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      {/* Back Button Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>العودة لإدارة العيادات</span>
          </button>
        </div>
      </div>
      
      {/* Settings Content with proper padding */}
      <div className="pt-4">
        <ClinicSettings />
      </div>
    </div>
  );
}
