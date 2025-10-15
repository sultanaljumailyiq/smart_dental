import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Brain,
  Calendar,
  Clock,
  Star,
  Phone,
  Mail,
  MapPin,
  Activity,
  Users,
  Award,
  TrendingUp,
  Zap,
  Shield,
  UserCheck,
  Settings,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Timer,
  Grid3X3,
  List,
  Stethoscope,
  Briefcase,
  GraduationCap,
  Heart,
  Target,
  BookOpen,
  FileText,
  Download,
  Upload,
  Badge,
  Crown,
  UserPlus,
  Loader2,
  X,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sharedClinicData } from "@/services/sharedClinicData";
import { adaptStaffListToLegacy } from "@/services/clinicDataAdapter";

interface ExtendedStaffMember {
  id: string | number;
  name: string;
  role: string;
  specialization?: string;
  experience: number;
  rating: number;
  patients: number;
  availability: string;
  phone: string;
  email: string;
  aiScore: number;
  weeklyHours: number;
  nextAvailable: string;
  avatar: string;
  color: string;
  specialties: string[];
  aiInsights: {
    efficiency: number;
    patientSatisfaction: number;
    onTimeRate: number;
    successRate: number;
  };
  salary: string;
  joinDate: string;
  status: string;
  department: string;
  shift: string;
}


const Staff = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [staffMembers, setStaffMembers] = useState<ExtendedStaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<ExtendedStaffMember | null>(null);
  const [isStaffDetailOpen, setIsStaffDetailOpen] = useState(false);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"main" | "financial" | "other">("main");

  useEffect(() => {
    const loadStaff = async () => {
      try {
        setIsLoading(true);
        const staff = await sharedClinicData.getStaff();
        const legacyStaff = adaptStaffListToLegacy(staff);
        
        const extendedStaff: ExtendedStaffMember[] = legacyStaff.map((member, index) => {
          const roleDepartmentMap: Record<string, string> = {
            'طبيب': 'طب الأسنان',
            'ممرض': 'التمريض',
            'مساعد': 'الدعم الطبي',
            'موظف استقبال': 'الإدارة',
            'مدير': 'الإدارة',
          };
          
          const roleSpecialtiesMap: Record<string, string[]> = {
            'علاج الجذور': ['علاج الجذور', 'جراحة الجذور', 'حالات الطوارئ'],
            'جراحة الفم': ['زراعة الأسنان', 'خلع الأسنان', 'جراحة اللثة'],
            'الرعاية العامة': ['تحضير المريض', 'تعقيم الأدوات', 'متابعة ما بعد العلاج'],
            'تقويم الأسنان': ['تقويم معدني', 'تقويم شفاف', 'تقويم الأطفال'],
            'خدمة العملاء': ['حجز المواعيد', 'استقبال المرضى', 'إدارة الملفات'],
            'التصوير الطبي': ['أشعة سينية', 'أشعة بانوراما', 'أشعة ثلاثية الأبعاد'],
          };

          const availability = member.status === 'نشط' 
            ? (index % 3 === 0 ? 'متاح' : 'مشغول')
            : 'في إجازة';

          const nextAvailableMap: Record<string, string> = {
            'متاح': index % 2 === 0 ? 'اليوم 2:00 مساءً' : 'متاح الآن',
            'مشغول': 'غداً 10:00 صباحاً',
            'في إجازة': 'الأسبوع القادم',
          };

          return {
            id: member.id,
            name: member.name,
            role: member.role,
            specialization: member.specialization,
            experience: 5 + (index * 2),
            rating: 4.5 + (index % 5) * 0.1,
            patients: 75 + (index * 20),
            availability,
            phone: member.phone,
            email: member.email,
            aiScore: 85 + (index * 3),
            weeklyHours: 30 + (index * 2),
            nextAvailable: nextAvailableMap[availability],
            avatar: member.avatar || member.name.substring(0, 2),
            color: member.color || 'bg-blue-100 text-blue-700',
            specialties: roleSpecialtiesMap[member.specialization || ''] || [member.specialization || 'عام'],
            aiInsights: {
              efficiency: 87 + (index * 2),
              patientSatisfaction: 4.5 + (index % 5) * 0.1,
              onTimeRate: 94 + (index % 6),
              successRate: 85 + (index * 3),
            },
            salary: member.role === 'طبيب' ? '2000000 د.ع' : member.role === 'مساعد' ? '1000000 د.ع' : '700000 د.ع',
            joinDate: `20${20 + (index % 4)}-0${(index % 9) + 1}-15`,
            status: member.status,
            department: roleDepartmentMap[member.role] || 'عام',
            shift: 'نهاري',
          };
        });

        setStaffMembers(extendedStaff);
      } catch (error) {
        console.error('Error loading staff:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStaff();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "نشط":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            نشط
          </span>
        );
      case "في إجازة":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Timer className="w-3 h-3" />
            في إجازة
          </span>
        );
      case "غير نشط":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <AlertTriangle className="w-3 h-3" />
            غير نشط
          </span>
        );
      default:
        return null;
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "متاح":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            متاح
          </span>
        );
      case "مشغول":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700">
            <AlertTriangle className="w-3 h-3" />
            مشغول
          </span>
        );
      case "في إجازة":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-700">
            <Timer className="w-3 h-3" />
            في إجازة
          </span>
        );
      default:
        return null;
    }
  };

  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" || staff.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "all" || staff.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const staffStats = {
    total: staffMembers.length,
    active: staffMembers.filter((s) => s.status === "نشط").length,
    available: staffMembers.filter((s) => s.availability === "متاح").length,
    onLeave: staffMembers.filter((s) => s.status === "في إجازة").length,
    avgRating: (
      staffMembers.reduce((sum, s) => sum + s.rating, 0) / staffMembers.length
    ).toFixed(1),
    totalPatients: staffMembers.reduce((sum, s) => sum + s.patients, 0),
  };

  const departments = Array.from(
    new Set(staffMembers.map((s) => s.department)),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" dir="rtl">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">جاري تحميل بيانات الطاقم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">إدارة الطاقم</h1>
              <p className="text-teal-100 text-lg mb-4">
                إدارة شاملة لفريق العمل والموارد البشرية
              </p>
              <p className="text-teal-100">
                {staffStats.total} موظف، {staffStats.active} نشط و{" "}
                {staffStats.available} متاح حالياً
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-white font-medium hover:bg-white/30 transition-all flex items-center gap-2">
                <Download className="w-5 h-5" />
                تصدير الكشوفات
              </button>
              <button 
                onClick={() => setIsAddStaffOpen(true)}
                className="bg-white text-teal-600 px-6 py-3 rounded-xl font-medium hover:bg-teal-50 transition-all flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                موظف جديد
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Bento Style */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Stats */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">إحصائيات الطاقم</h3>
            <Users className="w-6 h-6 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-teal-50 rounded-3xl border border-teal-100">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <p className="text-3xl font-bold text-teal-600 mb-2">
                {staffStats.total}
              </p>
              <p className="text-sm font-medium text-teal-700">
                إجمالي الموظفين
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-3xl border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600 mb-2">
                {staffStats.available}
              </p>
              <p className="text-sm font-medium text-green-700">متاح الآن</p>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {staffStats.avgRating}
              </p>
              <p className="text-sm font-medium text-blue-700">متوسط التقييم</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-3xl border border-purple-100">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-2">
                {staffStats.totalPatients}
              </p>
              <p className="text-sm font-medium text-purple-700">
                إجمالي المرضى
              </p>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              أداء الفريق الشهري
            </h4>
            <div className="h-32 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl flex items-end justify-center p-4">
              <div className="flex items-end gap-2 h-full w-full">
                {[85, 92, 78, 95, 88, 90, 93, 97, 85, 89, 94, 91].map(
                  (height, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-teal-600 to-cyan-600 rounded-t-lg flex-1 transition-all duration-300 hover:from-teal-700 hover:to-cyan-700"
                      style={{ height: `${height}%` }}
                    ></div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">توزيع الأقسام</h3>
              <p className="text-sm text-gray-600">حسب التخصص</p>
            </div>
          </div>

          <div className="space-y-4">
            {departments.map((dept, index) => {
              const count = staffMembers.filter(
                (s) => s.department === dept,
              ).length;
              const percentage = Math.round((count / staffStats.total) * 100);
              const colors = [
                "bg-blue-500",
                "bg-green-500",
                "bg-purple-500",
                "bg-orange-500",
                "bg-pink-500",
                "bg-indigo-500",
              ];

              return (
                <div key={dept} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{dept}</span>
                    <span className="text-gray-600">{count} موظف</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        colors[index % colors.length],
                      )}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث عن موظف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">جميع الأقسام</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="نشط">نشط</option>
              <option value="في إجازة">في إجازة</option>
              <option value="غير نشط">غير نشط</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-3 rounded-2xl transition-all",
                viewMode === "grid"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-3 rounded-2xl transition-all",
                viewMode === "list"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div
        className={cn(
          "grid gap-6",
          viewMode === "grid"
            ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1",
        )}
      >
        {filteredStaff.map((staff) => (
          <div
            key={staff.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center font-semibold text-lg",
                    staff.color,
                  )}
                >
                  {staff.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors text-lg">
                    {staff.name}
                  </h3>
                  <p className="text-sm text-gray-600">{staff.role}</p>
                  <p className="text-xs text-gray-500">
                    {staff.specialization}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(staff.status)}
                    {getAvailabilityBadge(staff.availability)}
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{staff.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{staff.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>متاح: {staff.nextAvailable}</span>
              </div>
            </div>

            {/* Rating & Experience */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 mb-4 border border-yellow-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-yellow-800">
                  التقييم والخبرة
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-bold text-yellow-700">
                    {staff.rating}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-700">
                  {staff.experience} سنة خبرة
                </span>
                <span className="text-yellow-700">{staff.patients} مريض</span>
              </div>
            </div>

            {/* AI Performance */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-4 border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-blue-800">
                  أداء الذكاء الاصطناعي
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {staff.aiScore}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-blue-700">الكفاءة</span>
                  <div className="w-full bg-blue-200 rounded-full h-1 mt-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full"
                      style={{ width: `${staff.aiInsights.efficiency}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <span className="text-purple-700">الرضا</span>
                  <div className="w-full bg-purple-200 rounded-full h-1 mt-1">
                    <div
                      className="bg-purple-500 h-1 rounded-full"
                      style={{
                        width: `${staff.aiInsights.patientSatisfaction * 20}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <span className="text-green-700">الالتزام</span>
                  <div className="w-full bg-green-200 rounded-full h-1 mt-1">
                    <div
                      className="bg-green-500 h-1 rounded-full"
                      style={{ width: `${staff.aiInsights.onTimeRate}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <span className="text-red-700">النجاح</span>
                  <div className="w-full bg-red-200 rounded-full h-1 mt-1">
                    <div
                      className="bg-red-500 h-1 rounded-full"
                      style={{ width: `${staff.aiInsights.successRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                التخصصات
              </h4>
              <div className="flex flex-wrap gap-1">
                {staff.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-lg"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Work Info */}
            <div className="bg-gray-50 rounded-2xl p-3 mb-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">الراتب</span>
                  <p className="font-semibold text-gray-800">{staff.salary}</p>
                </div>
                <div>
                  <span className="text-gray-600">ساعات العمل</span>
                  <p className="font-semibold text-gray-800">
                    {staff.weeklyHours} ساعة/أسبوع
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">تاريخ الانضمام</span>
                  <p className="font-semibold text-gray-800">
                    {new Date(staff.joinDate).toLocaleDateString("ar-IQ")}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">النوبة</span>
                  <p className="font-semibold text-gray-800">{staff.shift}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setSelectedStaff(staff);
                    setIsStaffDetailOpen(true);
                  }}
                  className="p-2 text-teal-600 hover:bg-teal-100 rounded-xl transition-all"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    setSelectedStaff(staff);
                    setIsStaffDetailOpen(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-xl transition-all">
                  <Calendar className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Brain className="w-4 h-4 text-blue-500" />
                <span>مدعوم بالذكاء الاصطناعي</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Detail Modal */}
      {isStaffDetailOpen && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl", selectedStaff.color)}>
                    {selectedStaff.avatar}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{selectedStaff.name}</h2>
                    <p className="text-teal-100">{selectedStaff.role} - {selectedStaff.specialization}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsStaffDetailOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex gap-1 p-2">
                <button
                  onClick={() => setActiveTab("main")}
                  className={cn(
                    "px-6 py-3 rounded-xl font-medium transition-all",
                    activeTab === "main"
                      ? "bg-white text-teal-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  المعلومات الأساسية
                </button>
                <button
                  onClick={() => setActiveTab("financial")}
                  className={cn(
                    "px-6 py-3 rounded-xl font-medium transition-all",
                    activeTab === "financial"
                      ? "bg-white text-teal-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  المعلومات المالية
                </button>
                <button
                  onClick={() => setActiveTab("other")}
                  className={cn(
                    "px-6 py-3 rounded-xl font-medium transition-all",
                    activeTab === "other"
                      ? "bg-white text-teal-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  معلومات أخرى
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
              {activeTab === "main" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Financial Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    المعلومات المالية
                  </h3>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
                    <p className="text-sm text-green-700 mb-1">الراتب الشهري</p>
                    <p className="text-2xl font-bold text-green-900">{selectedStaff.salary}</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">ساعات العمل</span>
                      <span className="font-bold text-gray-900">{selectedStaff.weeklyHours} ساعة/أسبوع</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">النوبة</span>
                      <span className="font-bold text-gray-900">{selectedStaff.shift}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">القسم</span>
                      <span className="font-bold text-gray-900">{selectedStaff.department}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <p className="text-sm text-blue-700 mb-2">سجل الحضور</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600">الحضور هذا الشهر</span>
                        <span className="font-bold text-blue-900">22/25 يوم</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "88%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Column - Time & Sections */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    الجدول الزمني والأقسام
                  </h3>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                    <p className="text-sm text-blue-700 mb-2">تاريخ الانضمام</p>
                    <p className="text-xl font-bold text-blue-900">{new Date(selectedStaff.joinDate).toLocaleDateString("ar-IQ")}</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">التخصصات</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStaff.specialties.map((specialty, index) => (
                        <span key={index} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                    <h4 className="font-semibold text-purple-900 mb-3">الجدول الأسبوعي</h4>
                    <div className="space-y-2 text-sm">
                      {["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"].map((day, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-purple-700">{day}</span>
                          <span className="font-medium text-purple-900">9:00 ص - 5:00 م</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Reports & Performance */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    التقارير والأداء
                  </h3>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-yellow-700">التقييم</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="font-bold text-yellow-900">{selectedStaff.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-yellow-600">{selectedStaff.experience} سنة خبرة</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">أداء الذكاء الاصطناعي</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">الكفاءة</span>
                          <span className="font-bold text-blue-600">{selectedStaff.aiInsights.efficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${selectedStaff.aiInsights.efficiency}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">معدل النجاح</span>
                          <span className="font-bold text-green-600">{selectedStaff.aiInsights.successRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${selectedStaff.aiInsights.successRate}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">الالتزام بالمواعيد</span>
                          <span className="font-bold text-purple-600">{selectedStaff.aiInsights.onTimeRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${selectedStaff.aiInsights.onTimeRate}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-100">
                    <h4 className="font-semibold text-pink-900 mb-2">إحصائيات المرضى</h4>
                    <p className="text-3xl font-bold text-pink-900">{selectedStaff.patients}</p>
                    <p className="text-xs text-pink-600">إجمالي المرضى المعالجين</p>
                  </div>
                </div>
              </div>
              )}

              {activeTab === "financial" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
                    <h3 className="text-2xl font-bold text-green-900 mb-6">المعلومات المالية الكاملة</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-green-700 mb-1">الراتب الشهري</p>
                        <p className="text-3xl font-bold text-green-900">{selectedStaff.salary}</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-700 mb-1">ساعات العمل الأسبوعية</p>
                        <p className="text-3xl font-bold text-green-900">{selectedStaff.weeklyHours} ساعة</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-700 mb-1">سجل الحضور هذا الشهر</p>
                        <p className="text-3xl font-bold text-green-900">22/25 يوم</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-700 mb-1">النوبة</p>
                        <p className="text-3xl font-bold text-green-900">{selectedStaff.shift}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "other" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-8 border border-purple-100">
                    <h3 className="text-2xl font-bold text-purple-900 mb-6">معلومات إضافية</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-purple-700 mb-1">القسم</p>
                        <p className="text-xl font-bold text-purple-900">{selectedStaff.department}</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-700 mb-1">تاريخ الانضمام</p>
                        <p className="text-xl font-bold text-purple-900">{new Date(selectedStaff.joinDate).toLocaleDateString("ar-IQ")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-700 mb-1">الحالة</p>
                        <div className="mt-2">{getStatusBadge(selectedStaff.status)}</div>
                      </div>
                      <div>
                        <p className="text-sm text-purple-700 mb-1">التوفر</p>
                        <div className="mt-2">{getAvailabilityBadge(selectedStaff.availability)}</div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-semibold text-purple-900 mb-3">التخصصات</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedStaff.specialties.map((specialty, index) => (
                          <span key={index} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold text-purple-900 mb-3">معلومات الاتصال</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-purple-600" />
                          <span className="text-purple-800">{selectedStaff.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-purple-600" />
                          <span className="text-purple-800">{selectedStaff.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsStaffDetailOpen(false)}
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                >
                  إغلاق
                </button>
                <div className="flex gap-3">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    تعديل البيانات
                  </button>
                  <button className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    تصدير التقرير
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">إضافة موظف جديد</h2>
                <button
                  onClick={() => setIsAddStaffOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="أدخل الاسم الكامل"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="07XX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الدور</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option value="طبيب">طبيب</option>
                      <option value="ممرض">ممرض</option>
                      <option value="مساعد">مساعد</option>
                      <option value="موظف استقبال">موظف استقبال</option>
                      <option value="مدير">مدير</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">التخصص</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="علاج الجذور، جراحة الفم..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الراتب</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="2000000 د.ع"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ساعات العمل الأسبوعية</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option value="نشط">نشط</option>
                      <option value="في إجازة">في إجازة</option>
                      <option value="غير نشط">غير نشط</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>

            <div className="border-t border-gray-100 p-6 bg-gray-50">
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                >
                  إلغاء
                </button>
                <button
                  className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  إضافة الموظف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
