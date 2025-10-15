import React, { useState } from "react";
import {
  Stethoscope,
  Search,
  Filter,
  Plus,
  Clock,
  DollarSign,
  User,
  Calendar,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  CheckCircle,
  Timer,
  AlertCircle,
  Star,
  Activity,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockTreatments = [
  {
    id: 1,
    name: "تنظيف وتبييض الأسنان",
    category: "وقائي",
    duration: "45 دقيقة",
    price: "150,000 د.ع",
    description: "تنظيف شامل للأسنان مع جلسة تبييض احترافية",
    sessions: 1,
    popularity: 4.8,
    monthlyCount: 45,
    color: "bg-blue-100 text-blue-700",
    status: "نشط",
  },
  {
    id: 2,
    name: "حشو الأسنان التجميلي",
    category: "ترميمي",
    duration: "60 دقيقة",
    price: "200,000 د.ع",
    description: "حشو تجميلي بمواد حديثة تحافظ على الشكل الطبيعي",
    sessions: 1,
    popularity: 4.6,
    monthlyCount: 32,
    color: "bg-green-100 text-green-700",
    status: "نشط",
  },
  {
    id: 3,
    name: "تقويم الأسنان",
    category: "تقويمي",
    duration: "90 دقيقة",
    price: "2,500,000 د.ع",
    description: "تقويم شامل للأسنان باستخدام أحدث التقنيات",
    sessions: 24,
    popularity: 4.9,
    monthlyCount: 15,
    color: "bg-purple-100 text-purple-700",
    status: "نشط",
  },
  {
    id: 4,
    name: "زراعة الأسنان",
    category: "جراحي",
    duration: "120 دقيقة",
    price: "1,800,000 د.ع",
    description: "زراعة أسنان بديلة بأعلى معايير الجودة",
    sessions: 3,
    popularity: 5.0,
    monthlyCount: 8,
    color: "bg-red-100 text-red-700",
    status: "نشط",
  },
];

const ClinicTreatments: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("��ميع");
  const [selectedTreatment, setSelectedTreatment] = useState<any>(null);

  const filteredTreatments = mockTreatments.filter((treatment) => {
    const matchesSearch =
      treatment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      treatment.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterCategory === "جميع" || treatment.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: mockTreatments.length,
    active: mockTreatments.filter((t) => t.status === "نشط").length,
    monthly: mockTreatments.reduce((sum, t) => sum + t.monthlyCount, 0),
    revenue: "12,500,000 د.ع",
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* الهيدر */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة العلاجات</h1>
          <p className="text-gray-600 mt-1">
            إدارة أنواع العلاجات والإجراءات الطبية
          </p>
        </div>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          علاج جديد
        </button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">أنواع العلاجات</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.monthly}
              </p>
              <p className="text-sm text-gray-600">هذا الشهر</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.revenue}
              </p>
              <p className="text-sm text-gray-600">إيرادات الشهر</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
              <p className="text-sm text-gray-600">متوسط التقييم</p>
            </div>
          </div>
        </div>
      </div>

      {/* أدوات البحث والفلترة */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث عن علاج أو فئة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="جميع">جميع الفئات</option>
              <option value="وقائي">وقائي</option>
              <option value="ترميمي">ترميمي</option>
              <option value="تقويمي">تقويمي</option>
              <option value="جراحي">جراحي</option>
            </select>

            <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              فلاتر
            </button>
          </div>
        </div>
      </div>

      {/* قائمة العلاجات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTreatments.map((treatment) => (
          <div
            key={treatment.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* هيدر البطاقة */}
            <div className={cn("p-4", treatment.color)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  <span className="font-medium">{treatment.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">
                    {treatment.popularity}
                  </span>
                </div>
              </div>
            </div>

            {/* محتوى البطاقة */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {treatment.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {treatment.description}
              </p>

              {/* معلومات العلاج */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">المدة</span>
                  </div>
                  <span className="text-sm font-medium">
                    {treatment.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">السعر</span>
                  </div>
                  <span className="text-sm font-medium">{treatment.price}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">الجلسات</span>
                  </div>
                  <span className="text-sm font-medium">
                    {treatment.sessions}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Activity className="w-4 h-4" />
                    <span className="text-sm">هذا الشهر</span>
                  </div>
                  <span className="text-sm font-medium">
                    {treatment.monthlyCount}
                  </span>
                </div>
              </div>

              {/* شارة الحالة */}
              <div className="mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  {treatment.status}
                </span>
              </div>

              {/* الإجراءات */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTreatment(treatment)}
                  className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  عرض التفاصيل
                </button>
                <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* شارة سريعة للعلاجات الشائعة */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          العلاجات الأكثر طلباً
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockTreatments
            .sort((a, b) => b.monthlyCount - a.monthlyCount)
            .slice(0, 3)
            .map((treatment, index) => (
              <div
                key={treatment.id}
                className="bg-white p-4 rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                      index === 0
                        ? "bg-yellow-100 text-yellow-700"
                        : index === 1
                          ? "bg-gray-100 text-gray-700"
                          : "bg-orange-100 text-orange-700",
                    )}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {treatment.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {treatment.monthlyCount} مرة
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ClinicTreatments;
