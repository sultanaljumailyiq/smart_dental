import React, { useState, useEffect } from "react";
import { Copy, QrCode, Globe, Settings, Eye, EyeOff, Clock, Calendar, MapPin, Phone, Mail, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { sharedClinicData, Clinic } from "@/services/sharedClinicData";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ClinicsAppointmentManager() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadClinics();
  }, []);

  const loadClinics = async () => {
    try {
      const data = await sharedClinicData.getClinics();
      setClinics(data);
    } catch (error) {
      console.error("Error loading clinics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFullBookingUrl = (clinic: Clinic) => {
    return `${window.location.origin}${clinic.bookingLink}`;
  };

  const copyToClipboard = async (clinic: Clinic) => {
    const url = getFullBookingUrl(clinic);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(clinic.id);
      toast.success("تم نسخ الرابط بنجاح!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error("فشل نسخ الرابط");
    }
  };

  const toggleOnlineBooking = async (clinic: Clinic) => {
    try {
      await sharedClinicData.updateClinicBookingSettings(clinic.id, {
        onlineBookingEnabled: !clinic.onlineBookingEnabled,
      });
      await loadClinics();
      toast.success(
        clinic.onlineBookingEnabled
          ? "تم تعطيل الحجز الإلكتروني"
          : "تم تفعيل الحجز الإلكتروني"
      );
    } catch (error) {
      toast.error("فشل تحديث الإعدادات");
    }
  };

  const generateQRCode = (clinic: Clinic) => {
    const url = getFullBookingUrl(clinic);
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
  };

  const getDayName = (day: string) => {
    const dayNames: Record<string, string> = {
      sunday: "الأحد",
      monday: "الاثنين",
      tuesday: "الثلاثاء",
      wednesday: "الأربعاء",
      thursday: "الخميس",
      friday: "الجمعة",
      saturday: "السبت",
    };
    return dayNames[day] || day;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة الحجوزات الإلكترونية</h2>
          <p className="text-gray-600 mt-1">شارك روابط الحجز مع مرضاك وتلقى الحجوزات تلقائياً</p>
        </div>
      </div>

      {clinics.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد عيادات مسجلة</h3>
          <p className="text-gray-600">قم بإضافة عيادة لبدء استقبال الحجوزات الإلكترونية</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {clinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{clinic.nameAr}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{clinic.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{clinic.phone}</span>
                      </div>
                      {clinic.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{clinic.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">الحجز الإلكتروني</div>
                      <Switch
                        checked={clinic.onlineBookingEnabled}
                        onCheckedChange={() => toggleOnlineBooking(clinic)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-sm text-gray-900">رابط الحجز</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm bg-white px-3 py-2 rounded-lg border border-blue-200 text-blue-700 font-mono truncate">
                        {getFullBookingUrl(clinic)}
                      </code>
                      <Button
                        onClick={() => copyToClipboard(clinic)}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "shrink-0",
                          copiedId === clinic.id && "bg-green-50 border-green-500"
                        )}
                      >
                        {copiedId === clinic.id ? (
                          <>
                            <Check className="w-4 h-4 ml-1 text-green-600" />
                            <span className="text-green-600">تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 ml-1" />
                            نسخ
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <Button
                      onClick={() => {
                        setSelectedClinic(clinic);
                        setShowQRModal(true);
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <QrCode className="w-4 h-4 ml-2" />
                      عرض رمز QR
                    </Button>

                    <Button
                      onClick={() => window.open(getFullBookingUrl(clinic), "_blank")}
                      variant="outline"
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 ml-2" />
                      معاينة صفحة الحجز
                    </Button>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold text-sm text-gray-900">إعدادات الحجز</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-gray-600 mb-1">مدة الحصة</div>
                        <div className="font-semibold flex items-center gap-1">
                          <Clock className="w-4 h-4 text-blue-600" />
                          {clinic.timeSlotDuration} دقيقة
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-gray-600 mb-1">أيام العمل</div>
                        <div className="font-semibold">
                          {Object.entries(clinic.workingHours)
                            .filter(([_, hours]) => hours.isOpen)
                            .map(([day]) => getDayName(day))
                            .slice(0, 3)
                            .join("، ")}
                          {Object.values(clinic.workingHours).filter((h) => h.isOpen).length > 3 && "..."}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-gray-600 mb-1">العلاجات المتاحة</div>
                        <div className="font-semibold">
                          {clinic.acceptedTreatments.length} علاج
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-gray-600 mb-1">أوقات الراحة</div>
                        <div className="font-semibold">
                          {clinic.breakTimes?.length || 0} فترة
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showQRModal && selectedClinic && (
        <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
          <DialogContent className="sm:max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">رمز QR للحجز - {selectedClinic.nameAr}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-center p-6 bg-white rounded-xl border-2 border-gray-200">
                <img
                  src={generateQRCode(selectedClinic)}
                  alt="QR Code"
                  className="w-64 h-64"
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                يمكن للمرضى مسح هذا الرمز للوصول مباشرة إلى صفحة الحجز
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = generateQRCode(selectedClinic);
                    link.download = `qr-${selectedClinic.id}.png`;
                    link.click();
                    toast.success("تم تنزيل رمز QR");
                  }}
                  className="flex-1"
                >
                  تنزيل رمز QR
                </Button>
                <Button
                  onClick={() => copyToClipboard(selectedClinic)}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 ml-2" />
                  نسخ الرابط
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
