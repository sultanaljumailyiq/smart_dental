import React, { useState, useEffect } from "react";
import { Map, MapPin, Globe, Settings, Save, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AdminTopNavbar from "@/components/AdminTopNavbar";

interface MapSettingsData {
  defaultCenterLat: number;
  defaultCenterLng: number;
  defaultZoom: number;
  enableGeolocation: boolean;
  searchRadius: number;
  maxClinicsToShow: number;
  promotedClinicsFirst: boolean;
}

export default function MapsSettings() {
  const [settings, setSettings] = useState<MapSettingsData>({
    defaultCenterLat: 33.3152, // Baghdad
    defaultCenterLng: 44.3661,
    defaultZoom: 12,
    enableGeolocation: true,
    searchRadius: 50,
    maxClinicsToShow: 20,
    promotedClinicsFirst: true,
  });

  const [googleMapsKey, setGoogleMapsKey] = useState("");
  const [keyExists, setKeyExists] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkGoogleMapsKey();
    loadSettings();
  }, []);

  const checkGoogleMapsKey = async () => {
    try {
      const response = await fetch("/api/check-maps-key");
      const data = await response.json();
      setKeyExists(data.exists);
    } catch (error) {
      console.error("Error checking Maps key:", error);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/map-settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/map-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success("تم حفظ الإعدادات بنجاح");
      } else {
        toast.error("فشل حفظ الإعدادات");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = async () => {
    if (!googleMapsKey.trim()) {
      toast.error("الرجاء إدخال مفتاح API");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/maps-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: googleMapsKey }),
      });

      if (response.ok) {
        toast.success("تم حفظ مفتاح Google Maps بنجاح");
        setKeyExists(true);
        setGoogleMapsKey("");
      } else {
        toast.error("فشل حفظ المفتاح");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ المفتاح");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-6" dir="rtl">
      {/* Admin Top Navigation */}
      <AdminTopNavbar />

      <div className="max-w-5xl mx-auto px-6 pt-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Map className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إعدادات الخرائط</h1>
              <p className="text-gray-600">إدارة Google Maps API وإعدادات الموقع</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Google Maps API Key */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">مفتاح Google Maps API</h2>
            </div>

            {keyExists ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
                <Check className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-green-900 font-medium">مفتاح API مضاف بالفعل</p>
                  <p className="text-sm text-green-700">يتم تخزين المفتاح بشكل آمن في متغيرات البيئة</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl mb-4">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <p className="text-orange-900 text-sm">
                    لا يوجد مفتاح Google Maps API. الرجاء إضافة المفتاح لتفعيل ميزات الخرائط
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مفتاح API
                    </label>
                    <input
                      type="text"
                      value={googleMapsKey}
                      onChange={(e) => setGoogleMapsKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <Button
                    onClick={handleSaveApiKey}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Save className="w-4 h-4 ml-2" />
                    حفظ المفتاح
                  </Button>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• احصل على مفتاح API من <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></p>
                    <p>• تأكد من تفعيل Maps JavaScript API و Places API</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map Settings */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">إعدادات الخريطة</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Default Center */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الموقع الافتراضي (خط الطول)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={settings.defaultCenterLat}
                  onChange={(e) => setSettings({ ...settings, defaultCenterLat: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الموقع الافتراضي (خط العرض)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={settings.defaultCenterLng}
                  onChange={(e) => setSettings({ ...settings, defaultCenterLng: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Zoom Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مستوى التكبير الافتراضي: {settings.defaultZoom}
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={settings.defaultZoom}
                  onChange={(e) => setSettings({ ...settings, defaultZoom: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Search Radius */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نطاق البحث (كم): {settings.searchRadius}
                </label>
                <input
                  type="range"
                  min="1"
                  max="200"
                  value={settings.searchRadius}
                  onChange={(e) => setSettings({ ...settings, searchRadius: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Max Clinics */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عدد العيادات المعروضة: {settings.maxClinicsToShow}
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={settings.maxClinicsToShow}
                  onChange={(e) => setSettings({ ...settings, maxClinicsToShow: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="mt-6 space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                <span className="text-gray-900 font-medium">تفعيل تحديد الموقع الجغرافي</span>
                <input
                  type="checkbox"
                  checked={settings.enableGeolocation}
                  onChange={(e) => setSettings({ ...settings, enableGeolocation: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                <span className="text-gray-900 font-medium">إظهار العيادات المروجة أولاً</span>
                <input
                  type="checkbox"
                  checked={settings.promotedClinicsFirst}
                  onChange={(e) => setSettings({ ...settings, promotedClinicsFirst: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>

            <Button
              onClick={handleSaveSettings}
              disabled={loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 ml-2" />
              حفظ الإعدادات
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
