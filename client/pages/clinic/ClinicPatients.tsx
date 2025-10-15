import React, { useState } from "react";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Activity,
  Star,
  Clock,
  Heart,
  FileText,
  Download,
  Upload,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Timer,
  Badge as BadgeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// بيانات تجريبية للمرضى
const mockPatients = [
  {
    id: 1,
    name: "أحمد محمد الكردي",
    phone: "07801234567",
    email: "ahmed.mohammed@gmail.com",
    address: "بغداد - الكرادة",
    registered: "12 آذار 2021",
    lastVisit: "05 حزيران 2021",
    treatment: "تنظيف وتبييض الأسنان",
    avatar: "أ.م",
    color: "bg-blue-100 text-blue-700",
    age: 28,
    gender: "ذكر",
    status: "نشط",
    visits: 15,
    treatments: 8,
    rating: 4.8,
    balance: "250,000 د.ع",
    notes: "مريض دائم، يحتاج متابعة دورية",
    nextAppointment: "2024-01-20",
    emergencyContact: "07809876543",
  },
  {
    id: 2,
    name: "فاطمة علي الزهراء",
    phone: "07709876543",
    email: "fatima.ali@gmail.com",
    address: "البصرة - المعقل",
    registered: "15 أيار 2020",
    lastVisit: "12 كانون الثاني 2024",
    treatment: "حشو أسنان",
    avatar: "ف.ع",
    color: "bg-green-100 text-green-700",
    age: 34,
    gender: "أنثى",
    status: "نشط",
    visits: 22,
    treatments: 12,
    rating: 4.9,
    balance: "150,000 د.ع",
    notes: "حساسية من البنسلين",
    nextAppointment: "2024-01-18",
    emergencyContact: "07805554433",
  },
  {
    id: 3,
    name: "محمد عبدالله السعدي",
    phone: "07705555555",
    email: "mohammed.abdullah@gmail.com",
    address: "الموصل - اليرموك",
    registered: "8 تشرين الأول 2022",
    lastVisit: "28 كانون الأول 2023",
    treatment: "تقويم أسنان",
    avatar: "م.ع",
    color: "bg-purple-100 text-purple-700",
    age: 19,
    gender: "ذكر",
    status: "غير نشط",
    visits: 8,
    treatments: 3,
    rating: 4.6,
    balance: "500,000 د.ع",
    notes: "يحتاج متابعة شهرية للتقويم",
    nextAppointment: "2024-01-25",
    emergencyContact: "07701234567",
  },
  {
    id: 4,
    name: "نور سالم الياسري",
    phone: "07803456789",
    email: "noor.salem@gmail.com",
    address: "النجف - الكوفة",
    registered: "3 شباط 2023",
    lastVisit: "10 كانون الثاني 2024",
    treatment: "زراعة أسنان",
    avatar: "ن.س",
    color: "bg-pink-100 text-pink-700",
    age: 42,
    gender: "أنثى",
    status: "نشط",
    visits: 12,
    treatments: 6,
    rating: 5.0,
    balance: "750,000 د.ع",
    notes: "مريضة VIP، تحتاج رعاية خاصة",
    nextAppointment: "2024-01-16",
    emergencyContact: "07807778888",
  },
];

const ClinicPatients: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("جميع");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState("name");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // فلترة المرضى
  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "جميع" || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // إحصائيات سريعة
  const stats = {
    total: mockPatients.length,
    active: mockPatients.filter((p) => p.status === "نشط").length,
    inactive: mockPatients.filter((p) => p.status === "غير نشط").length,
    newThisMonth: 8,
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* الهيدر */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المرضى</h1>
          <p className="text-gray-600 mt-1">
            إدارة ملفات المرضى والمعلومات الطبية
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            {viewMode === "list" ? (
              <Grid3X3 className="w-4 h-4" />
            ) : (
              <List className="w-4 h-4" />
            )}
            {viewMode === "list" ? "شبكة" : "قائمة"}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            مريض جديد
          </button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">إجمالي المرضى</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-sm text-gray-600">نشط</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.inactive}
              </p>
              <p className="text-sm text-gray-600">غير نشط</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.newThisMonth}
              </p>
              <p className="text-sm text-gray-600">جدد هذا الشهر</p>
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
              placeholder="البحث عن مريض، رقم الهاتف أو البريد الإلكتروني..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="جميع">جميع المرضى</option>
              <option value="نشط">نشط</option>
              <option value="غير نشط">غير نشط</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">ترتيب بالاسم</option>
              <option value="date">ترتيب بالتاريخ</option>
              <option value="visits">ترتيب بالزيارات</option>
            </select>

            <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              فلاتر
            </button>
          </div>
        </div>
      </div>

      {/* عرض المرضى */}
      {viewMode === "list" ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              قائمة المرضى
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* صورة المريض */}
                    <div
                      className={cn(
                        "w-16 h-16 rounded-xl flex items-center justify-center font-semibold text-lg",
                        patient.color,
                      )}
                    >
                      {patient.avatar}
                    </div>

                    {/* معلومات المريض */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {patient.name}
                        </h4>
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium",
                            patient.status === "نشط"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800",
                          )}
                        >
                          {patient.status}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {patient.rating}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {patient.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {patient.address}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          آخر زيارة: {patient.lastVisit}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <p className="text-xs text-blue-600">الزيارات</p>
                          <p className="font-semibold text-blue-800">
                            {patient.visits}
                          </p>
                        </div>
                        <div className="bg-green-50 p-2 rounded-lg">
                          <p className="text-xs text-green-600">العلاجات</p>
                          <p className="font-semibold text-green-800">
                            {patient.treatments}
                          </p>
                        </div>
                        <div className="bg-purple-50 p-2 rounded-lg">
                          <p className="text-xs text-purple-600">الرصيد</p>
                          <p className="font-semibold text-purple-800">
                            {patient.balance}
                          </p>
                        </div>
                        <div className="bg-orange-50 p-2 rounded-lg">
                          <p className="text-xs text-orange-600">العمر</p>
                          <p className="font-semibold text-orange-800">
                            {patient.age} سنة
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* الإجراءات */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="عرض الملف"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="تعديل"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="تقرير"
                    >
                      <FileText className="w-4 h-4" />
                    </button>

                    <button
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {patient.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>ملاحظات:</strong> {patient.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* عرض الشبكة */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <div
                  className={cn(
                    "w-20 h-20 rounded-xl flex items-center justify-center font-bold text-xl mx-auto mb-4",
                    patient.color,
                  )}
                >
                  {patient.avatar}
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">
                  {patient.name}
                </h4>

                <div className="flex items-center justify-center gap-2 mb-3">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      patient.status === "نشط"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800",
                    )}
                  >
                    {patient.status}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">
                      {patient.rating}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p className="flex items-center justify-center gap-1">
                    <Phone className="w-3 h-3" />
                    {patient.phone}
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <Activity className="w-3 h-3" />
                    {patient.visits} زيارة
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPatient(patient)}
                    className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    عرض الملف
                  </button>
                  <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* تذييل الصفحة */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          عرض {filteredPatients.length} من أصل {mockPatients.length} مريض
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            السابق
          </button>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-medium">
            1
          </span>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            التالي
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicPatients;
