import React, { useState, useEffect } from "react";
import { Building, Crown, TrendingUp, Edit, Trash2, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AdminTopNavbar from "@/components/AdminTopNavbar";

interface Clinic {
  id: number;
  name: string;
  arabicName: string;
  phone: string;
  address: string;
  subscriptionTier: string;
  isPromoted: boolean;
  priorityLevel: number;
  isActive: boolean;
  subscriptionEnd: string | null;
}

export default function ClinicsManagement() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClinics();
  }, []);

  useEffect(() => {
    filterClinics();
  }, [searchQuery, filterTier, clinics]);

  const loadClinics = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/clinics");
      if (response.ok) {
        const data = await response.json();
        setClinics(data);
      }
    } catch (error) {
      console.error("Error loading clinics:", error);
      toast.error("فشل تحميل العيادات");
    } finally {
      setLoading(false);
    }
  };

  const filterClinics = () => {
    let filtered = clinics;

    if (searchQuery) {
      filtered = filtered.filter(
        (clinic) =>
          clinic.arabicName.includes(searchQuery) ||
          clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          clinic.phone.includes(searchQuery)
      );
    }

    if (filterTier !== "all") {
      filtered = filtered.filter((clinic) => clinic.subscriptionTier === filterTier);
    }

    setFilteredClinics(filtered);
  };

  const togglePromotion = async (clinicId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/clinics/${clinicId}/promotion`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPromoted: !currentStatus }),
      });

      if (response.ok) {
        toast.success(currentStatus ? "تم إيقاف الترويج" : "تم تفعيل الترويج");
        loadClinics();
      } else {
        toast.error("فشل تحديث الترويج");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const updatePriority = async (clinicId: number, newPriority: number) => {
    try {
      const response = await fetch(`/api/admin/clinics/${clinicId}/priority`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priorityLevel: newPriority }),
      });

      if (response.ok) {
        toast.success("تم تحديث الأولوية");
        loadClinics();
      } else {
        toast.error("فشل تحديث الأولوية");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const toggleStatus = async (clinicId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/clinics/${clinicId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        toast.success(currentStatus ? "تم إيقاف العيادة" : "تم تفعيل العيادة");
        loadClinics();
      } else {
        toast.error("فشل تحديث الحالة");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const getTierBadge = (tier: string) => {
    const badges = {
      free: { label: "مجاني", class: "bg-gray-100 text-gray-700" },
      basic: { label: "أساسي", class: "bg-blue-100 text-blue-700" },
      premium: { label: "بريميوم", class: "bg-purple-100 text-purple-700" },
      enterprise: { label: "مؤسسي", class: "bg-gold-100 text-gold-700" },
    };
    const badge = badges[tier as keyof typeof badges] || badges.free;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.class}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-6" dir="rtl">
      {/* Admin Top Navigation */}
      <AdminTopNavbar />

      <div className="max-w-7xl mx-auto px-6 pt-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة العيادات</h1>
              <p className="text-gray-600">إدارة العيادات والترويج والأولويات</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن عيادة..."
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="relative">
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">جميع الاشتراكات</option>
                <option value="free">مجاني</option>
                <option value="basic">أساسي</option>
                <option value="premium">بريميوم</option>
                <option value="enterprise">مؤسسي</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clinics List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto" />
              <p className="mt-4 text-gray-600">جاري التحميل...</p>
            </div>
          ) : filteredClinics.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد عيادات</p>
            </div>
          ) : (
            filteredClinics.map((clinic) => (
              <div
                key={clinic.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{clinic.arabicName}</h3>
                      {clinic.isPromoted && (
                        <Crown className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{clinic.phone}</p>
                    <p className="text-sm text-gray-500">{clinic.address}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {getTierBadge(clinic.subscriptionTier)}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        clinic.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {clinic.isActive ? "نشط" : "متوقف"}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Promotion Toggle */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">الترويج</label>
                    <button
                      onClick={() => togglePromotion(clinic.id, clinic.isPromoted)}
                      className={`w-full px-4 py-2 rounded-xl font-medium transition-colors ${
                        clinic.isPromoted
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {clinic.isPromoted ? "مروج" : "غير مروج"}
                    </button>
                  </div>

                  {/* Priority Level */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      مستوى الأولوية: {clinic.priorityLevel}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={clinic.priorityLevel}
                      onChange={(e) => updatePriority(clinic.id, parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Status Toggle */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">الحالة</label>
                    <button
                      onClick={() => toggleStatus(clinic.id, clinic.isActive)}
                      className={`w-full px-4 py-2 rounded-xl font-medium transition-colors ${
                        clinic.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {clinic.isActive ? "تفعيل" : "إيقاف"}
                    </button>
                  </div>
                </div>

                {clinic.subscriptionEnd && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-900">
                      ينتهي الاشتراك في: {new Date(clinic.subscriptionEnd).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
