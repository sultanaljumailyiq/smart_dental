import React, { useState, useEffect } from "react";
import {
  Settings,
  Smartphone,
  Building2,
  Save,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Clock,
  Upload,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface PaymentSettings {
  id?: number;
  zainCashEnabled: boolean;
  zainCashPhoneNumber: string;
  zainCashAccountName: string;
  zainCashQrCodeUrl: string;
  zainCashMerchantId: string;
  zainCashSecret: string;
  zainCashTestMode: boolean;
  cashEnabled: boolean;
  cashInstructions: string;
  cashInstructionsArabic: string;
  stripeEnabled: boolean;
  stripePublishableKey: string;
  stripeSecretKey: string;
}

interface CashCenter {
  id?: number;
  governorateArabic: string;
  centerNameArabic: string;
  addressArabic: string;
  phoneNumber: string;
  alternativePhone?: string;
  workingHoursArabic: string;
  latitude?: string;
  longitude?: string;
  isActive: boolean;
}

const iraqiGovernorates = [
  "بغداد", "البصرة", "نينوى", "الأنبار", "أربيل", "كركوك", "النجف", 
  "كربلاء", "ديالى", "ذي قار", "المثنى", "القادسية", "واسط", 
  "بابل", "ميسان", "دهوك", "السليمانية", "صلاح الدين"
];

export default function PaymentManagement() {
  const [settings, setSettings] = useState<PaymentSettings>({
    zainCashEnabled: true,
    zainCashPhoneNumber: "",
    zainCashAccountName: "",
    zainCashQrCodeUrl: "",
    zainCashMerchantId: "",
    zainCashSecret: "",
    zainCashTestMode: true,
    cashEnabled: true,
    cashInstructions: "",
    cashInstructionsArabic: "",
    stripeEnabled: false,
    stripePublishableKey: "",
    stripeSecretKey: "",
  });

  const [centers, setCenters] = useState<CashCenter[]>([]);
  const [editingCenter, setEditingCenter] = useState<CashCenter | null>(null);
  const [showCenterForm, setShowCenterForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPaymentSettings();
    loadCashCenters();
  }, []);

  const loadPaymentSettings = async () => {
    try {
      const response = await fetch("/api/payment-settings");
      if (response.ok) {
        const data = await response.json();
        if (data.id) {
          setSettings(data);
        }
      }
    } catch (error) {
      console.error("Error loading payment settings:", error);
    }
  };

  const loadCashCenters = async () => {
    try {
      const response = await fetch("/api/cash-payment-centers");
      if (response.ok) {
        const data = await response.json();
        setCenters(data);
      }
    } catch (error) {
      console.error("Error loading cash centers:", error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/payment-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success("تم حفظ الإعدادات بنجاح");
        loadPaymentSettings();
      } else {
        toast.error("فشل حفظ الإعدادات");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCenter = async () => {
    if (!editingCenter) return;

    setLoading(true);
    try {
      const url = editingCenter.id
        ? `/api/cash-payment-centers/${editingCenter.id}`
        : "/api/cash-payment-centers";
      
      const method = editingCenter.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCenter),
      });

      if (response.ok) {
        toast.success(editingCenter.id ? "تم تحديث المركز" : "تم إضافة المركز");
        loadCashCenters();
        setShowCenterForm(false);
        setEditingCenter(null);
      } else {
        toast.error("فشلت العملية");
      }
    } catch (error) {
      toast.error("حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCenter = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المركز؟")) return;

    try {
      const response = await fetch(`/api/cash-payment-centers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("تم حذف المركز");
        loadCashCenters();
      } else {
        toast.error("فشل الحذف");
      }
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-6 px-4 md:px-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة طرق الدفع</h1>
              <p className="text-gray-600">إعدادات الدفع ومراكز التحصيل النقدي</p>
            </div>
          </div>
        </div>

        {/* Zain Cash Settings */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Smartphone className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold">إعدادات زين كاش</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                رقم الحساب
              </label>
              <Input
                value={settings.zainCashPhoneNumber}
                onChange={(e) =>
                  setSettings({ ...settings, zainCashPhoneNumber: e.target.value })
                }
                placeholder="07XXXXXXXXX"
                className="direction-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                اسم الحساب
              </label>
              <Input
                value={settings.zainCashAccountName}
                onChange={(e) =>
                  setSettings({ ...settings, zainCashAccountName: e.target.value })
                }
                placeholder="اسم صاحب الحساب"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                رابط صورة QR Code
              </label>
              <div className="flex gap-2">
                <Input
                  value={settings.zainCashQrCodeUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, zainCashQrCodeUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
                <Button variant="outline" size="icon">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              {settings.zainCashQrCodeUrl && (
                <div className="mt-2">
                  <img
                    src={settings.zainCashQrCodeUrl}
                    alt="QR Code"
                    className="w-32 h-32 rounded-xl border-2 border-gray-200"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.zainCashEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, zainCashEnabled: e.target.checked })
                }
                className="w-5 h-5 text-purple-600 rounded"
              />
              <label className="text-sm font-semibold text-gray-700">
                تفعيل زين كاش
              </label>
            </div>
          </div>
        </Card>

        {/* Cash Payment Centers */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold">مراكز الدفع النقدي</h2>
            </div>
            <Button
              onClick={() => {
                setEditingCenter({
                  governorateArabic: "",
                  centerNameArabic: "",
                  addressArabic: "",
                  phoneNumber: "",
                  workingHoursArabic: "",
                  isActive: true,
                });
                setShowCenterForm(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              إضافة مركز
            </Button>
          </div>

          {showCenterForm && editingCenter && (
            <div className="bg-purple-50 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">
                {editingCenter.id ? "تعديل المركز" : "مركز جديد"}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    المحافظة *
                  </label>
                  <select
                    value={editingCenter.governorateArabic}
                    onChange={(e) =>
                      setEditingCenter({
                        ...editingCenter,
                        governorateArabic: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border-gray-300 px-4 py-2"
                  >
                    <option value="">اختر المحافظة</option>
                    {iraqiGovernorates.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    اسم المركز *
                  </label>
                  <Input
                    value={editingCenter.centerNameArabic}
                    onChange={(e) =>
                      setEditingCenter({
                        ...editingCenter,
                        centerNameArabic: e.target.value,
                      })
                    }
                    placeholder="مثال: فرع المنصور"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    العنوان *
                  </label>
                  <Input
                    value={editingCenter.addressArabic}
                    onChange={(e) =>
                      setEditingCenter({
                        ...editingCenter,
                        addressArabic: e.target.value,
                      })
                    }
                    placeholder="العنوان الكامل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <Input
                    value={editingCenter.phoneNumber}
                    onChange={(e) =>
                      setEditingCenter({
                        ...editingCenter,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder="07XXXXXXXXX"
                    className="direction-ltr text-right"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رقم بديل
                  </label>
                  <Input
                    value={editingCenter.alternativePhone || ""}
                    onChange={(e) =>
                      setEditingCenter({
                        ...editingCenter,
                        alternativePhone: e.target.value,
                      })
                    }
                    placeholder="07XXXXXXXXX"
                    className="direction-ltr text-right"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ساعات العمل
                  </label>
                  <Input
                    value={editingCenter.workingHoursArabic}
                    onChange={(e) =>
                      setEditingCenter({
                        ...editingCenter,
                        workingHoursArabic: e.target.value,
                      })
                    }
                    placeholder="9 صباحاً - 5 مساءً"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleSaveCenter}
                  disabled={
                    loading ||
                    !editingCenter.governorateArabic ||
                    !editingCenter.centerNameArabic ||
                    !editingCenter.phoneNumber
                  }
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "جاري الحفظ..." : "حفظ"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCenterForm(false);
                    setEditingCenter(null);
                  }}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {centers.map((center) => (
              <div
                key={center.id}
                className="border-2 border-gray-200 rounded-2xl p-4 hover:border-purple-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <h3 className="font-bold text-lg">{center.centerNameArabic}</h3>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        {center.governorateArabic}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{center.addressArabic}</p>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span className="direction-ltr">{center.phoneNumber}</span>
                      </div>
                      {center.workingHoursArabic && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{center.workingHoursArabic}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditingCenter(center);
                        setShowCenterForm(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => center.id && handleDeleteCenter(center.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSaveSettings}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? "جاري الحفظ..." : "حفظ جميع الإعدادات"}
          </Button>
        </div>
      </div>
    </div>
  );
}
