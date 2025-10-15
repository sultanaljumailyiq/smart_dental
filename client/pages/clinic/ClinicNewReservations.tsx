import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  Phone,
  User,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  X,
  MapPin,
  Stethoscope,
  Timer,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ClinicSubNav from "@/components/ClinicSubNav";

// Mock appointments data - shared with clinic_old system
const mockAppointments = [
  {
    id: "1",
    patientId: "1",
    patientName: "أحمد محمد الطائي",
    patientPhone: "+964 770 123 4567",
    date: "2024-01-22",
    time: "10:00",
    duration: 60,
    treatment: "تنظيف الأسنان",
    doctorId: "doc1",
    doctorName: "د. سارة أحمد",
    status: "scheduled",
    priority: "normal",
    notes: "المريض يفضل المواعيد الصباحية",
    reminder: true,
    price: 50000,
  },
  {
    id: "2",
    patientId: "2",
    patientName: "فاطمة علي السعد",
    patientPhone: "+964 750 987 6543",
    date: "2024-01-22",
    time: "11:30",
    duration: 90,
    treatment: "حشوة ضرس",
    doctorId: "doc1",
    doctorName: "د. سارة أحمد",
    status: "confirmed",
    priority: "high",
    notes: "حساسية من البنسلين",
    reminder: true,
    price: 75000,
  },
  {
    id: "3",
    patientId: "3",
    patientName: "محمد حسن الكريم",
    patientPhone: "+964 771 456 7890",
    date: "2024-01-22",
    time: "14:00",
    duration: 120,
    treatment: "زراعة أسنان - المرحلة الثانية",
    doctorId: "doc2",
    doctorName: "د. أحمد الطبيب",
    status: "in_progress",
    priority: "high",
    notes: "متابعة زراعة الأسنان",
    reminder: false,
    price: 200000,
  },
  {
    id: "4",
    patientId: "4",
    patientName: "سارة أحمد النور",
    patientPhone: "+964 782 321 6547",
    date: "2024-01-23",
    time: "09:00",
    duration: 45,
    treatment: "فحص تقويم الأسنان",
    doctorId: "doc1",
    doctorName: "د. سارة أحمد",
    status: "scheduled",
    priority: "normal",
    notes: "فحص دوري للتقويم",
    reminder: true,
    price: 30000,
  },
  {
    id: "5",
    patientId: "5",
    patientName: "عبد الله يوسف الشمري",
    patientPhone: "+964 790 654 3210",
    date: "2024-01-23",
    time: "10:30",
    duration: 90,
    treatment: "علاج عصب طارئ",
    doctorId: "doc2",
    doctorName: "د. أحمد الطبيب",
    status: "urgent",
    priority: "urgent",
    notes: "ألم شديد - حالة طارئة",
    reminder: false,
    price: 120000,
  },
];

const ClinicNewReservations: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter appointments based on selected date, status, and search
  const filteredAppointments = mockAppointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const matchesDate =
      appointmentDate.toDateString() === selectedDate.toDateString();
    const matchesStatus =
      filterStatus === "all" || appointment.status === filterStatus;
    const matchesSearch =
      appointment.patientName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.treatment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.patientPhone.includes(searchQuery);

    return matchesDate && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "مجدول";
      case "confirmed":
        return "مؤكد";
      case "in_progress":
        return "قيد التنفيذ";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغي";
      case "urgent":
        return "عاجل";
      default:
        return "غير محدد";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "high":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "normal":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ar-IQ", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const todayStats = {
    total: filteredAppointments.length,
    scheduled: filteredAppointments.filter((a) => a.status === "scheduled")
      .length,
    confirmed: filteredAppointments.filter((a) => a.status === "confirmed")
      .length,
    inProgress: filteredAppointments.filter((a) => a.status === "in_progress")
      .length,
    urgent: filteredAppointments.filter((a) => a.status === "urgent").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/clinic"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  إدارة الحجوزات
                </h1>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedDate)}
                </p>
              </div>
            </div>

            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              موعد جديد
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <ClinicSubNav />
        {/* Date Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">
                {formatDate(selectedDate)}
              </h3>
              <p className="text-sm text-gray-600">
                {filteredAppointments.length} موعد
              </p>
            </div>

            <button
              onClick={() => changeDate(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Quick Date Actions */}
          <div className="flex gap-2">
            <Button
              variant={
                selectedDate.toDateString() === new Date().toDateString()
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => setSelectedDate(new Date())}
            >
              اليوم
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setSelectedDate(tomorrow);
              }}
            >
              غداً
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن مريض أو علاج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="scheduled">مجدول</option>
              <option value="confirmed">مؤكد</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="urgent">عاجل</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {todayStats.total}
                </p>
                <p className="text-sm text-gray-600">إجما��ي المواعيد</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {todayStats.confirmed}
                </p>
                <p className="text-sm text-gray-600">مؤكد</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Timer className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {todayStats.inProgress}
                </p>
                <p className="text-sm text-gray-600">قيد التنفيذ</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {todayStats.urgent}
                </p>
                <p className="text-sm text-gray-600">عاجل</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {todayStats.scheduled}
                </p>
                <p className="text-sm text-gray-600">مجدول</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  {/* Appointment Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {appointment.patientName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {appointment.patientPhone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getPriorityIcon(appointment.priority)}
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusText(appointment.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {appointment.time} ({appointment.duration} دقيقة)
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Stethoscope className="w-4 h-4" />
                          {appointment.treatment}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          {appointment.doctorName}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Badge variant="outline">
                            {appointment.price.toLocaleString()} د.ع
                          </Badge>
                        </div>

                        {appointment.reminder && (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            تذكير مفعل
                          </div>
                        )}

                        {appointment.notes && (
                          <div className="text-sm text-gray-600">
                            <strong>ملاحظات:</strong> {appointment.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(`/clinic/patients/${appointment.patientId}`)
                        }
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        عرض المريض
                      </Button>

                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        تعديل
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(`tel:${appointment.patientPhone}`)
                        }
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        اتصال
                      </Button>

                      {appointment.status === "scheduled" && (
                        <Button size="sm">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          تأكيد
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد مواعيد
              </h3>
              <p className="text-gray-600 mb-4">
                لا توجد مواعيد في هذا التاريخ
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                إضافة موعد جديد
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicNewReservations;
