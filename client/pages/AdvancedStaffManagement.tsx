import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Shield,
  Eye,
  EyeOff,
  Upload,
  Camera,
  Lock,
  Mail,
  Phone,
  User,
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  Building,
  Users,
  Settings,
  ChevronDown,
  ChevronUp,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sharedClinicData, Staff as SharedStaff } from "@/services/sharedClinicData";

interface StaffMember extends SharedStaff {
  arabicName?: string;
  username?: string;
  avatar?: string | null;
  arabicRole?: string;
  arabicSpecialization?: string;
  roleId?: number | null;
  clinicId?: number;
}

interface Role {
  id: number;
  name: string;
  arabicName: string;
  description: string;
  arabicDescription: string;
}

const AdvancedStaffManagement = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clinicId = searchParams.get("clinicId");
  
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [expandedStaffId, setExpandedStaffId] = useState<string | null>(null);
  const [clinicName, setClinicName] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    arabicName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    avatar: "",
    role: "doctor" as SharedStaff["role"],
    arabicRole: "طبيب",
    specialization: "",
    arabicSpecialization: "",
    status: "active" as SharedStaff["status"],
    permissions: [] as string[],
  });

  const roleTranslations: Record<SharedStaff["role"], string> = {
    doctor: "طبيب",
    nurse: "ممرض",
    assistant: "مساعد",
    receptionist: "موظف استقبال",
    manager: "مدير",
  };

  const statusTranslations: Record<SharedStaff["status"], string> = {
    active: "نشط",
    on_leave: "في إجازة",
    inactive: "غير نشط",
  };

  useEffect(() => {
    loadData();
  }, [clinicId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (clinicId) {
        const clinics = await sharedClinicData.getClinics();
        const clinic = clinics.find(c => c.id === clinicId);
        if (clinic) {
          setClinicName(clinic.nameAr);
        }
      }
      
      const staffData = await sharedClinicData.getStaff();
      
      const enhancedStaff: StaffMember[] = staffData.map(member => ({
        ...member,
        arabicName: member.name,
        arabicRole: roleTranslations[member.role],
        arabicSpecialization: member.specialization,
      }));
      
      setStaff(enhancedStaff);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaff = async () => {
    try {
      const newStaff: SharedStaff = {
        id: Date.now().toString(),
        name: formData.name || formData.arabicName,
        role: formData.role,
        phone: formData.phone,
        email: formData.email,
        specialization: formData.specialization || formData.arabicSpecialization,
        status: formData.status,
        permissions: formData.permissions,
      };

      await sharedClinicData.addStaffMember(newStaff);
      await loadData();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Error creating staff:", error);
    }
  };

  const handleUpdateStaff = async () => {
    if (!editingStaff) return;

    try {
      const updatedStaff: SharedStaff = {
        id: editingStaff.id,
        name: formData.name || formData.arabicName,
        role: formData.role,
        phone: formData.phone,
        email: formData.email,
        specialization: formData.specialization || formData.arabicSpecialization,
        status: formData.status,
        permissions: formData.permissions,
      };

      await sharedClinicData.updateStaffMember(editingStaff.id, updatedStaff);
      await loadData();
      setShowEditModal(false);
      setEditingStaff(null);
      resetForm();
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الموظف؟")) return;

    try {
      await sharedClinicData.deleteStaffMember(id);
      await loadData();
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      arabicName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      avatar: "",
      role: "doctor",
      arabicRole: "طبيب",
      specialization: "",
      arabicSpecialization: "",
      status: "active",
      permissions: [],
    });
  };

  const openEditModal = (member: StaffMember) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      arabicName: member.arabicName || member.name,
      email: member.email || "",
      phone: member.phone || "",
      username: member.username || "",
      password: "",
      avatar: member.avatar || "",
      role: member.role,
      arabicRole: member.arabicRole || roleTranslations[member.role],
      specialization: member.specialization || "",
      arabicSpecialization: member.arabicSpecialization || member.specialization || "",
      status: member.status,
      permissions: member.permissions || [],
    });
    setShowEditModal(true);
  };

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.arabicName && member.arabicName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      selectedStatus === "all" || member.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getSectionPermissions = (perms: string[]) => {
    const sections = {
      clinic_old: perms.some(p => p.startsWith("clinic_old:") || p.includes("clinic")),
      dentist_hub: perms.some(p => p.startsWith("dentist_hub:") || p.includes("dentist")),
      marketplace: perms.some(p => p.startsWith("marketplace:") || p.includes("marketplace")),
      community: perms.some(p => p.startsWith("community:") || p.includes("community")),
      jobs: perms.some(p => p.startsWith("jobs:") || p.includes("jobs")),
      platform_admin: perms.some(p => p.startsWith("platform_admin:") || p.includes("admin")),
      supplier_center: perms.some(p => p.startsWith("supplier_center:") || p.includes("supplier")),
    };
    return sections;
  };

  const getSectionBadge = (sectionName: string, hasAccess: boolean) => {
    if (!hasAccess) return null;

    const sectionConfig: Record<string, { label: string; color: string }> = {
      clinic_old: { label: "إدارة العيادة", color: "bg-blue-100 text-blue-700" },
      dentist_hub: { label: "مركز الأطباء", color: "bg-teal-100 text-teal-700" },
      marketplace: { label: "المتجر", color: "bg-purple-100 text-purple-700" },
      community: { label: "المجتمع", color: "bg-green-100 text-green-700" },
      jobs: { label: "التوظيف", color: "bg-orange-100 text-orange-700" },
      platform_admin: { label: "إدارة المنصة", color: "bg-red-100 text-red-700" },
      supplier_center: { label: "مركز الموردين", color: "bg-pink-100 text-pink-700" },
    };

    const config = sectionConfig[sectionName];
    if (!config) return null;

    return (
      <span key={sectionName} className={cn("px-2 py-1 rounded-lg text-xs font-medium", config.color)}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-8 text-white">
          {clinicId && (
            <button
              onClick={() => navigate("/dentist-hub/clinics")}
              className="flex items-center text-white hover:text-teal-100 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              رجوع إلى إدارة العيادات
            </button>
          )}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {clinicName ? `إدارة الموظفين - ${clinicName}` : "إدارة الموظفين"}
              </h1>
              <p className="text-teal-100">
                إدارة شاملة للموظفين مع التحكم الكامل بالصلاحيات
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white text-teal-600 px-6 py-3 rounded-xl font-medium hover:bg-teal-50 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              إضافة موظف جديد
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الموظفين</p>
                <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">نشط</p>
                <p className="text-2xl font-bold text-green-600">
                  {staff.filter(s => s.status === "active").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">في إجازة</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {staff.filter(s => s.status === "on_leave").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">أطباء</p>
                <p className="text-2xl font-bold text-purple-600">
                  {staff.filter(s => s.role === "doctor").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث عن موظف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="on_leave">في إجازة</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>
        </div>

        {/* Staff List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
              <p className="text-gray-600">جاري التحميل...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الموظف</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الدور</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">التخصص</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الحالة</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الصلاحيات</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStaff.map((member) => {
                    const sections = getSectionPermissions(member.permissions || []);
                    const isExpanded = expandedStaffId === member.id;

                    return (
                      <>
                        <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                                <User className="w-5 h-5 text-teal-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{member.arabicName || member.name}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  {member.email && (
                                    <>
                                      <Mail className="w-3 h-3" />
                                      <span>{member.email}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-700">
                              {member.arabicRole || roleTranslations[member.role]}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {member.arabicSpecialization || member.specialization || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "inline-flex px-3 py-1 rounded-lg text-sm font-medium",
                              member.status === "active" && "bg-green-100 text-green-700",
                              member.status === "on_leave" && "bg-yellow-100 text-yellow-700",
                              member.status === "inactive" && "bg-gray-100 text-gray-700"
                            )}>
                              {statusTranslations[member.status]}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setExpandedStaffId(isExpanded ? null : member.id)}
                              className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
                            >
                              {(member.permissions || []).length} صلاحية
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(member)}
                                className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteStaff(member.id)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 bg-gray-50">
                              <div className="space-y-3">
                                <p className="text-sm font-medium text-gray-700">الصلاحيات المتاحة:</p>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(sections).map(([section, hasAccess]) => 
                                    getSectionBadge(section, hasAccess)
                                  )}
                                  {(member.permissions || []).length === 0 && (
                                    <span className="text-sm text-gray-500">لا توجد صلاحيات</span>
                                  )}
                                </div>
                                {member.phone && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                    <Phone className="w-4 h-4" />
                                    <span>{member.phone}</span>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredStaff.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">لا يوجد موظفين</p>
              </div>
            )}
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">إضافة موظف جديد</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                    <input
                      type="text"
                      value={formData.arabicName}
                      onChange={(e) => setFormData({ ...formData, arabicName: e.target.value, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="أدخل الاسم"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الهاتف</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="أدخل رقم الهاتف"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الدور</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        role: e.target.value as SharedStaff["role"],
                        arabicRole: roleTranslations[e.target.value as SharedStaff["role"]]
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="doctor">طبيب</option>
                      <option value="nurse">ممرض</option>
                      <option value="assistant">مساعد</option>
                      <option value="receptionist">موظف استقبال</option>
                      <option value="manager">مدير</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">التخصص</label>
                    <input
                      type="text"
                      value={formData.arabicSpecialization}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        arabicSpecialization: e.target.value,
                        specialization: e.target.value
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="أدخل التخصص"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as SharedStaff["status"] })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="active">نشط</option>
                      <option value="on_leave">في إجازة</option>
                      <option value="inactive">غير نشط</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleCreateStaff}
                    className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    حفظ
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingStaff && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">تعديل موظف</h2>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                    <input
                      type="text"
                      value={formData.arabicName}
                      onChange={(e) => setFormData({ ...formData, arabicName: e.target.value, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الهاتف</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الدور</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        role: e.target.value as SharedStaff["role"],
                        arabicRole: roleTranslations[e.target.value as SharedStaff["role"]]
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="doctor">طبيب</option>
                      <option value="nurse">ممرض</option>
                      <option value="assistant">مساعد</option>
                      <option value="receptionist">موظف استقبال</option>
                      <option value="manager">مدير</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">التخصص</label>
                    <input
                      type="text"
                      value={formData.arabicSpecialization}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        arabicSpecialization: e.target.value,
                        specialization: e.target.value
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as SharedStaff["status"] })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="active">نشط</option>
                      <option value="on_leave">في إجازة</option>
                      <option value="inactive">غير نشط</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleUpdateStaff}
                    className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    حفظ التعديلات
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedStaffManagement;
