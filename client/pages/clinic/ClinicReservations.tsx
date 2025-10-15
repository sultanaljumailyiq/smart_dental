import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Plus,
  User,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Timer,
  Bell,
  Edit,
  Trash2,
  Eye,
  Smartphone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

// بيانات تجريبية للحجوزات
const mockReservations = [
  {
    id: 1,
    patient: "أحمد محمد الكردي",
    phone: "07801234567",
    email: "ahmed.mohammed@gmail.com",
    time: "09:00",
    date: "2024-01-15",
    treatment: "فحص دوري",
    status: "مؤكد",
    duration: "30 دقيقة",
    notes: "مراجعة دورية للتنظيف",
    avatar: "أ.م",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    patient: "فاطمة علي الزهراء",
    phone: "07709876543",
    email: "fatima.ali@gmail.com",
    time: "10:30",
    date: "2024-01-15",
    treatment: "تنظيف أسنان",
    status: "في الانتظار",
    duration: "45 دقيقة",
    notes: "التنظيف الدوري السنوي",
    avatar: "ف.ع",
    color: "bg-green-100 text-green-700",
  },
  {
    id: 3,
    patient: "محمد عبدالله السعدي",
    phone: "07705555555",
    email: "mohammed.abdullah@gmail.com",
    time: "14:00",
    date: "2024-01-15",
    treatment: "حشو أسنان",
    status: "مؤجل",
    duration: "60 دقيقة",
    notes: "حشو الضرس الخلفي",
    avatar: "م.ع",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 4,
    patient: "نور سالم الياسري",
    phone: "07803456789",
    email: "noor.salem@gmail.com",
    time: "15:30",
    date: "2024-01-15",
    treatment: "تقويم أسنان",
    status: "مؤكد",
    duration: "90 دقيقة",
    notes: "متا��عة تقويم الأسنان",
    avatar: "ن.س",
    color: "bg-pink-100 text-pink-700",
  },
];

const ClinicReservations: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("جميع");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  // فلترة الحجوزات
  const filteredReservations = mockReservations.filter((reservation) => {
    const matchesSearch =
      reservation.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.phone.includes(searchQuery) ||
      reservation.treatment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "جميع" || reservation.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // إحصائيات سريعة
  const todayStats = {
    total: mockReservations.length,
    confirmed: mockReservations.filter((r) => r.status === "مؤكد").length,
    waiting: mockReservations.filter((r) => r.status === "في الانتظار").length,
    postponed: mockReservations.filter((r) => (r) => r.status === "مؤجل")
      .length,
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* الهيدر */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الحجوزات</h1>
          <p className="text-gray-600 mt-1">
            إدارة مواعيد المرضى والحجوزات اليومية
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setViewMode(viewMode === "list" ? "calendar" : "list")
            }
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            {viewMode === "list" ? "عرض التقويم" : "عرض القائمة"}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            حجز جديد
          </button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {todayStats.total}
              </p>
              <p className="text-sm text-gray-600">إجمالي اليوم</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {todayStats.confirmed}
              </p>
              <p className="text-sm text-gray-600">مؤكدة</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Timer className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {todayStats.waiting}
              </p>
              <p className="text-sm text-gray-600">في الانتظار</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {todayStats.postponed}
              </p>
              <p className="text-sm text-gray-600">مؤجلة</p>
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
              placeholder="البحث عن مريض، رقم الهاتف أو نوع العلاج..."
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
              <option value="جميع">جميع الحجوزات</option>
              <option value="مؤكد">مؤكدة</option>
              <option value="في الانتظار">في الانتظار</option>
              <option value="مؤجل">مؤجلة</option>
            </select>

            <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              فلاتر
            </button>
          </div>
        </div>
      </div>

      {/* قائمة الحجوزات */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">حجوزات اليوم</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* صورة المريض */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center font-semibold",
                      reservation.color,
                    )}
                  >
                    {reservation.avatar}
                  </div>

                  {/* معلومات المريض */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {reservation.patient}
                      </h4>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          reservation.status === "مؤكد"
                            ? "bg-green-100 text-green-800"
                            : reservation.status === "في الانتظار"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800",
                        )}
                      >
                        {reservation.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {reservation.time} - {reservation.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {reservation.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {reservation.treatment}
                      </div>
                    </div>
                  </div>
                </div>

                {/* الإجراءا�� */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedReservation(reservation)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="عرض التفاصيل"
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
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="رسالة"
                  >
                    <MessageSquare className="w-4 h-4" />
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

              {reservation.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>ملاحظات:</strong> {reservation.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* إضافة تذييل للصفحة */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          عرض {filteredReservations.length} من أصل {mockReservations.length} حجز
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-medium">
            1
          </span>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicReservations;
