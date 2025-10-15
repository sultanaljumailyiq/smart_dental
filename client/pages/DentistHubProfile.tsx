import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit2,
  Save,
  X,
  Lock,
  Bell,
  Globe,
  CreditCard,
  Briefcase,
  Award,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function DentistHubProfile() {
  const { user, updateProfile: updateAuthProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || "د. أحمد محمد",
    email: user?.email || "ahmed.mohammed@email.com",
    phone: user?.phone || "+964 770 123 4567",
    specialization: "طب الأسنان التجميلي",
    location: "بغداد، العراق",
    bio: "طبيب أسنان متخصص في طب الأسنان التجميلي مع خبرة تزيد عن 10 سنوات",
    avatar: user?.avatar || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    language: "ar",
  });

  // Load extended profile from backend (fallback to localStorage)
  useEffect(() => {
    const loadExtendedProfile = async () => {
      if (!user?.id) return;

      try {
        // Try to load from backend first
        const response = await fetch(`/api/users/${user.id}/extended-profile`);
        if (response.ok) {
          const data = await response.json();
          setProfileData((prev) => ({
            ...prev,
            bio: data.bio || prev.bio,
            specialization: data.specialization || prev.specialization,
            location: data.location || prev.location,
          }));
          return;
        }
      } catch (error) {
        console.warn("Failed to load from backend, trying localStorage:", error);
      }

      // Fallback: Load from localStorage
      const extendedProfile = localStorage.getItem("user_extended_profile");
      if (extendedProfile) {
        const data = JSON.parse(extendedProfile);
        setProfileData((prev) => ({
          ...prev,
          bio: data.bio || prev.bio,
          specialization: data.specialization || prev.specialization,
          location: data.location || prev.location,
        }));
      }
    };

    loadExtendedProfile();

    const userSettings = localStorage.getItem("user_settings");
    if (userSettings) {
      setSettings(JSON.parse(userSettings));
    }
  }, [user?.id]);

  // Persist settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("user_settings", JSON.stringify(settings));
  }, [settings]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({
          ...profileData,
          avatar: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // Update core profile fields through AuthContext
      // Note: Email changes should be handled separately with verification in production
      await updateAuthProfile({
        name: profileData.name,
        phone: profileData.phone,
        avatar: profileData.avatar,
      });
      
      // Try to save extended profile data to backend
      try {
        if (user?.id) {
          const response = await fetch(`/api/users/${user.id}/extended-profile`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bio: profileData.bio,
              specialization: profileData.specialization,
              location: profileData.location,
            }),
          });

          if (!response.ok) {
            throw new Error("Backend save failed");
          }
        }
      } catch (backendError) {
        console.warn("Failed to save to backend, using localStorage fallback:", backendError);
        // Fallback: Store in localStorage if backend fails
        localStorage.setItem("user_extended_profile", JSON.stringify({
          bio: profileData.bio,
          specialization: profileData.specialization,
          location: profileData.location,
        }));
      }
      
      toast.success("تم حفظ التغييرات بنجاح");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("حدث خطأ أثناء حفظ التغييرات");
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    try {
      // Note: In production, this should use AuthContext's Supabase instance
      // For now, this is a placeholder - password changes should be handled
      // through a proper backend API endpoint with authentication
      toast.info("وظيفة تغيير كلمة المرور ستكون متاحة قريباً");
      
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordChange(false);
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error?.message || "حدث خطأ أثناء تغيير كلمة المرور");
    }
  };

  const InfoField = ({
    icon: Icon,
    label,
    value,
    field,
    editable = true,
  }: {
    icon: any;
    label: string;
    value: string;
    field: string;
    editable?: boolean;
  }) => (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-500 mb-1">{label}</div>
        {isEditing && editable ? (
          <input
            type="text"
            value={value}
            onChange={(e) =>
              setProfileData({ ...profileData, [field]: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <div className="text-sm font-medium text-gray-900">{value}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">الملف الشخصي</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>تعديل</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>حفظ</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
                <span>إلغاء</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img
                src={profileData.avatar}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
              {isEditing && (
                <button
                  onClick={handleImageClick}
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-8 h-8 text-white" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <div className="mt-4 text-center">
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-blue-600 font-medium">حساب موثق</span>
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField
              icon={User}
              label="الاسم الكامل"
              value={profileData.name}
              field="name"
            />
            <InfoField
              icon={Mail}
              label="البريد الإلكتروني"
              value={profileData.email}
              field="email"
              editable={false}
            />
            <InfoField
              icon={Phone}
              label="رقم الهاتف"
              value={profileData.phone}
              field="phone"
            />
            <InfoField
              icon={Briefcase}
              label="التخصص"
              value={profileData.specialization}
              field="specialization"
            />
            <InfoField
              icon={MapPin}
              label="الموقع"
              value={profileData.location}
              field="location"
            />
            <InfoField
              icon={Calendar}
              label="تاريخ الانضمام"
              value="15 مارس 2023"
              field="joinDate"
              editable={false}
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500 mb-2">نبذة عني</div>
          {isEditing ? (
            <textarea
              value={profileData.bio}
              onChange={(e) =>
                setProfileData({ ...profileData, bio: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="text-sm text-gray-700">{profileData.bio}</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-600" />
            الأمان والخصوصية
          </h2>
        </div>

        {!showPasswordChange ? (
          <button
            onClick={() => setShowPasswordChange(true)}
            className="w-full px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-colors text-sm font-medium"
          >
            تغيير كلمة المرور
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                كلمة المرور الحالية
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showOldPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                تأكيد كلمة المرور الجديدة
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handlePasswordChange}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors text-sm font-medium"
              >
                تحديث كلمة المرور
              </button>
              <button
                onClick={() => {
                  setShowPasswordChange(false);
                  setPasswordData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm font-medium"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-orange-600" />
          الإشعارات والتفضيلات
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  إشعارات البريد الإلكتروني
                </div>
                <div className="text-xs text-gray-500">
                  استلام الإشعارات عبر البريد الإلكتروني
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  emailNotifications: !settings.emailNotifications,
                })
              }
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                settings.emailNotifications ? "bg-blue-600" : "bg-gray-300"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 bg-white rounded-full absolute top-1 transition-all",
                  settings.emailNotifications ? "right-1" : "right-7"
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  إشعارات الرسائل النصية
                </div>
                <div className="text-xs text-gray-500">
                  استلام الإشعارات عبر الرسائل النصية
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  smsNotifications: !settings.smsNotifications,
                })
              }
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                settings.smsNotifications ? "bg-blue-600" : "bg-gray-300"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 bg-white rounded-full absolute top-1 transition-all",
                  settings.smsNotifications ? "right-1" : "right-7"
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">اللغة</div>
                <div className="text-xs text-gray-500">لغة عرض المنصة</div>
              </div>
            </div>
            <select
              value={settings.language}
              onChange={(e) =>
                setSettings({ ...settings, language: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
          <CreditCard className="w-5 h-5 text-green-600" />
          الاشتراك والدفع
        </h2>

        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  الباقة الحالية
                </div>
                <div className="text-lg font-bold text-green-600 mt-1">
                  مجانية
                </div>
              </div>
              <Award className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <Link
            to="/doctor/subscription"
            className="block w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-center rounded-xl transition-colors text-sm font-medium"
          >
            ترقية الباقة
          </Link>
        </div>
      </div>
    </div>
  );
}
