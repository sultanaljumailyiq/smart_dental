import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  Shield,
  Save,
  Plus,
  Trash2,
  Edit,
  Eye,
  Upload,
  Camera,
  Globe,
  Users,
  Heart,
  Award,
  Stethoscope,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ClinicSettings {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  image: string;
  services: string[];
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
  amenities: string[];
  priceRange: string;
  emergencyPhone: string;
}

const initialSettings: ClinicSettings = {
  name: "عيادة الدكتور أحمد للأسنان",
  description:
    "عيادة متخصصة في زراعة الأسنان وطب الأسنان التجميلي بأحدث التقنيات العالمية",
  address: "شارع الكرادة، بناية النور، الطابق الثالث، بغد��د",
  phone: "+964 770 123 4567",
  email: "info@dr-ahmed-dental.com",
  website: "https://dr-ahmed-dental.com",
  image:
    "https://cdn.builder.io/api/v1/image/assets%2F38bc499df3b84d0eb31a6baa33de2495%2Ffa808b3da1354c598c996130fb1a00bf?format=webp&width=800",
  services: [
    "زراعة الأسنان",
    "تبييض الأسنان",
    "��قويم الأسنان",
    "علاج العصب",
    "تنظيف الأسنان",
  ],
  workingDays: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"],
  workingHours: {
    start: "09:00",
    end: "18:00",
  },
  amenities: [
    "موقف سيارات",
    "واي فاي مجاني",
    "صالة انتظار مريحة",
    "تعقيم متقدم",
  ],
  priceRange: "100 - 500 ألف دينار",
  emergencyPhone: "+964 770 111 2222",
};

const daysOfWeek = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

export default function ClinicAdmin() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<ClinicSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState("basic");
  const [newService, setNewService] = useState("");
  const [newAmenity, setNewAmenity] = useState("");

  const handleSave = () => {
    // Save settings logic here
    alert("تم حفظ الإعدادات بنجاح!");
  };

  const addService = () => {
    if (newService.trim()) {
      setSettings({
        ...settings,
        services: [...settings.services, newService.trim()],
      });
      setNewService("");
    }
  };

  const removeService = (index: number) => {
    setSettings({
      ...settings,
      services: settings.services.filter((_, i) => i !== index),
    });
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setSettings({
        ...settings,
        amenities: [...settings.amenities, newAmenity.trim()],
      });
      setNewAmenity("");
    }
  };

  const removeAmenity = (index: number) => {
    setSettings({
      ...settings,
      amenities: settings.amenities.filter((_, i) => i !== index),
    });
  };

  const toggleWorkingDay = (day: string) => {
    const updatedDays = settings.workingDays.includes(day)
      ? settings.workingDays.filter((d) => d !== day)
      : [...settings.workingDays, day];

    setSettings({
      ...settings,
      workingDays: updatedDays,
    });
  };

  const tabs = [
    { id: "basic", label: "المعل��مات الأساسية", icon: Settings },
    { id: "services", label: "الخدمات", icon: Heart },
    { id: "schedule", label: "مواعيد العمل", icon: Calendar },
    { id: "amenities", label: "المرافق", icon: Star },
    { id: "preview", label: "معاينة الصفحة", icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-gray-50 with-floating-nav">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    إدارة العيادة
                  </h1>
                  <p className="text-sm text-gray-600">
                    تحديث معلومات صفحة الحجز
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              حفظ التغييرات
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 font-medium transition-colors min-w-fit",
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50",
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {activeTab === "basic" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">
                المعلومات الأساسية
              </h3>

              {/* Clinic Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة العيادة
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={settings.image}
                    alt="صورة العيادة"
                    className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4" />
                    تغيير الصورة
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم العيادة
                  </label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) =>
                      setSettings({ ...settings, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) =>
                      setSettings({ ...settings, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الموقع الإلكتروني
                  </label>
                  <input
                    type="url"
                    value={settings.website}
                    onChange={(e) =>
                      setSettings({ ...settings, website: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    هاتف الطوارئ
                  </label>
                  <input
                    type="tel"
                    value={settings.emergencyPhone}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        emergencyPhone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نطاق الأسعار
                  </label>
                  <input
                    type="text"
                    value={settings.priceRange}
                    onChange={(e) =>
                      setSettings({ ...settings, priceRange: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: 100 - 500 ألف دينار"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان
                </label>
                <textarea
                  rows={2}
                  value={settings.address}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف العيادة
                </label>
                <textarea
                  rows={4}
                  value={settings.description}
                  onChange={(e) =>
                    setSettings({ ...settings, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">إدارة الخدمات</h3>

              {/* Add New Service */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="أدخل اسم الخدمة الجديدة"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addService}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  إضافة
                </button>
              </div>

              {/* Services List */}
              <div className="space-y-3">
                {settings.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{service}</span>
                    </div>
                    <button
                      onClick={() => removeService(index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">مواعيد العمل</h3>

              {/* Working Hours */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    بداية العمل
                  </label>
                  <input
                    type="time"
                    value={settings.workingHours.start}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        workingHours: {
                          ...settings.workingHours,
                          start: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نهاية العمل
                  </label>
                  <input
                    type="time"
                    value={settings.workingHours.end}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        workingHours: {
                          ...settings.workingHours,
                          end: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Working Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  أيام العمل
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleWorkingDay(day)}
                      className={cn(
                        "p-3 rounded-xl border-2 transition-all",
                        settings.workingDays.includes(day)
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-700 hover:border-gray-300",
                      )}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "amenities" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">إدارة المرافق</h3>

              {/* Add New Amenity */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="أدخل اسم المرفق الجديد"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addAmenity}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  إضافة
                </button>
              </div>

              {/* Amenities List */}
              <div className="space-y-3">
                {settings.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium">{amenity}</span>
                    </div>
                    <button
                      onClick={() => removeAmenity(index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "preview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  معاينة صفحة الحجز
                </h3>
                <button
                  onClick={() => navigate("/simplified-booking/1")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  عرض الصفحة
                </button>
              </div>

              {/* Preview Card */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  معاينة صفحة الحجز
                </h4>
                <p className="text-gray-600 mb-4">
                  انقر على "عرض الصفحة" أعلاه لرؤية كيف ستبدو صفحة الحجز للمرضى
                </p>
                <div className="text-sm text-gray-500">
                  سيتم حفظ جميع التغييرات تلقائياً عند النقر على "حفظ التغييرات"
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
