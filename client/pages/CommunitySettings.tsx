import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Settings,
  User,
  Bell,
  Lock,
  Eye,
  Globe,
  Shield,
  Trash2,
  LogOut,
  ArrowLeft,
  Check,
  X,
  Users,
  MessageCircle,
  Heart,
  Share2,
  Moon,
  Sun,
  Languages,
  HelpCircle,
  Mail,
  Phone,
  Camera,
  Edit,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CommunitySettings() {
  const [activeTab, setActiveTab] = useState<"profile" | "privacy" | "notifications" | "account">("profile");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<"ar" | "en">("ar");

  const [profileData, setProfileData] = useState({
    name: "د. أحمد محمد",
    title: "طبيب أسنان عام",
    bio: "طبيب أسنان متخصص في العلاج التجميلي مع خبرة 10 سنوات",
    location: "بغداد، العراق",
    website: "www.example.com",
    phone: "+964 770 123 4567",
    email: "ahmed@example.com",
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public" as "public" | "friends" | "private",
    showEmail: false,
    showPhone: false,
    showPosts: "everyone" as "everyone" | "friends" | "me",
    allowMessages: "everyone" as "everyone" | "friends" | "none",
    allowComments: true,
    allowTags: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    likes: true,
    comments: true,
    shares: true,
    follows: true,
    mentions: true,
    messages: true,
    events: true,
    groups: true,
    emailNotifications: false,
    pushNotifications: true,
  });

  const tabs = [
    { id: "profile", label: "الملف الشخصي", icon: User },
    { id: "privacy", label: "الخصوصية", icon: Lock },
    { id: "notifications", label: "الإشعارات", icon: Bell },
    { id: "account", label: "الحساب", icon: Settings },
  ];

  const handleSaveProfile = () => {
    toast.success("تم حفظ التغييرات بنجاح!");
  };

  const handleSavePrivacy = () => {
    toast.success("تم حفظ إعدادات الخصوصية!");
  };

  const handleSaveNotifications = () => {
    toast.success("تم حفظ إعدادات الإشعارات!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/community"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-7 h-7 text-blue-600" />
                الإعدادات
              </h1>
              <p className="text-sm text-gray-600 mt-1">إدارة حسابك وتفضيلاتك</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 pb-20">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="grid grid-cols-4 gap-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "p-4 flex flex-col items-center gap-2 transition-all border-b-2",
                    activeTab === tab.id
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-transparent text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Profile Settings */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">الصورة الشخصية</h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop"
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100"
                  />
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 ml-2" />
                    تغيير الصورة
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">JPG أو PNG. الحد الأقصى 2MB</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">المعلومات الشخصية</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المسمى الوظيفي
                  </label>
                  <input
                    type="text"
                    value={profileData.title}
                    onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نبذة عني
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الموقع
                    </label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الموقع الإلكتروني
                    </label>
                    <input
                      type="text"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveProfile} className="w-full md:w-auto">
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Settings */}
        {activeTab === "privacy" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">إعدادات الخصوصية</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    من يمكنه رؤية ملفي الشخصي؟
                  </label>
                  <select
                    value={privacySettings.profileVisibility}
                    onChange={(e) =>
                      setPrivacySettings({
                        ...privacySettings,
                        profileVisibility: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="public">الجميع</option>
                    <option value="friends">الأصدقاء فقط</option>
                    <option value="private">أنا فقط</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">إظهار البريد الإلكتروني</p>
                      <p className="text-sm text-gray-600">السماح للآخرين برؤية بريدك</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setPrivacySettings({
                        ...privacySettings,
                        showEmail: !privacySettings.showEmail,
                      })
                    }
                    className={cn(
                      "relative w-12 h-6 rounded-full transition-colors",
                      privacySettings.showEmail ? "bg-blue-600" : "bg-gray-300"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                        privacySettings.showEmail ? "left-1" : "left-7"
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">إظهار رقم الهاتف</p>
                      <p className="text-sm text-gray-600">السماح للآخرين برؤية رقمك</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setPrivacySettings({
                        ...privacySettings,
                        showPhone: !privacySettings.showPhone,
                      })
                    }
                    className={cn(
                      "relative w-12 h-6 rounded-full transition-colors",
                      privacySettings.showPhone ? "bg-blue-600" : "bg-gray-300"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                        privacySettings.showPhone ? "left-1" : "left-7"
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">السماح بالتعليقات</p>
                      <p className="text-sm text-gray-600">السماح للآخرين بالتعليق على منشوراتك</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setPrivacySettings({
                        ...privacySettings,
                        allowComments: !privacySettings.allowComments,
                      })
                    }
                    className={cn(
                      "relative w-12 h-6 rounded-full transition-colors",
                      privacySettings.allowComments ? "bg-blue-600" : "bg-gray-300"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                        privacySettings.allowComments ? "left-1" : "left-7"
                      )}
                    />
                  </button>
                </div>

                <Button onClick={handleSavePrivacy} className="w-full md:w-auto">
                  <Save className="w-4 h-4 ml-2" />
                  حفظ الإعدادات
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">إعدادات الإشعارات</h3>
              <div className="space-y-4">
                {[
                  { key: "likes", label: "الإعجابات", icon: Heart },
                  { key: "comments", label: "التعليقات", icon: MessageCircle },
                  { key: "shares", label: "المشاركات", icon: Share2 },
                  { key: "follows", label: "المتابعات الجديدة", icon: Users },
                  { key: "mentions", label: "الإشارات", icon: Bell },
                  { key: "messages", label: "الرسائل", icon: MessageCircle },
                  { key: "events", label: "الأحداث", icon: Bell },
                  { key: "groups", label: "المجموعات", icon: Users },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <p className="font-medium text-gray-900">{item.label}</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings],
                          })
                        }
                        className={cn(
                          "relative w-12 h-6 rounded-full transition-colors",
                          notificationSettings[item.key as keyof typeof notificationSettings]
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                            notificationSettings[item.key as keyof typeof notificationSettings]
                              ? "left-1"
                              : "left-7"
                          )}
                        />
                      </button>
                    </div>
                  );
                })}

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">قنوات التواصل</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <p className="font-medium text-gray-900">إشعارات البريد الإلكتروني</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotificationSettings({
                            ...notificationSettings,
                            emailNotifications: !notificationSettings.emailNotifications,
                          })
                        }
                        className={cn(
                          "relative w-12 h-6 rounded-full transition-colors",
                          notificationSettings.emailNotifications ? "bg-blue-600" : "bg-gray-300"
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                            notificationSettings.emailNotifications ? "left-1" : "left-7"
                          )}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <p className="font-medium text-gray-900">الإشعارات الفورية</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotificationSettings({
                            ...notificationSettings,
                            pushNotifications: !notificationSettings.pushNotifications,
                          })
                        }
                        className={cn(
                          "relative w-12 h-6 rounded-full transition-colors",
                          notificationSettings.pushNotifications ? "bg-blue-600" : "bg-gray-300"
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                            notificationSettings.pushNotifications ? "left-1" : "left-7"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveNotifications} className="w-full md:w-auto">
                  <Save className="w-4 h-4 ml-2" />
                  حفظ الإعدادات
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Account Settings */}
        {activeTab === "account" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">إعدادات العرض</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {darkMode ? (
                      <Moon className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Sun className="w-5 h-5 text-gray-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">الوضع الداكن</p>
                      <p className="text-sm text-gray-600">تفعيل المظهر الداكن</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={cn(
                      "relative w-12 h-6 rounded-full transition-colors",
                      darkMode ? "bg-blue-600" : "bg-gray-300"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                        darkMode ? "left-1" : "left-7"
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Languages className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">اللغة</p>
                      <p className="text-sm text-gray-600">تغيير لغة التطبيق</p>
                    </div>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">الأمان</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Lock className="w-4 h-4 ml-2" />
                  تغيير كلمة المرور
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 ml-2" />
                  المصادقة الثنائية
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-red-600">منطقة الخطر</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف الحساب نهائياً
                </Button>
                <Button variant="outline" className="w-full justify-start text-gray-600">
                  <LogOut className="w-4 h-4 ml-2" />
                  تسجيل الخروج
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
