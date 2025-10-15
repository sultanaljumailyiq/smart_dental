import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User,
  FileText,
  Eye,
  Edit,
  Star,
  Building2,
  Truck,
  CreditCard,
  Timer,
  Target,
  Activity,
  TrendingUp,
  Award,
  Settings,
  Download,
  Printer,
  Mail,
  MoreHorizontal,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  sharedClinicData,
  Laboratory,
  LabOrder,
  TreatmentPlan,
} from "@/services/sharedClinicData";
import { LabOrdersSection, LaboratoriesSection, LabStatsSection } from "@/components/LabSections";
import { NewLabOrderModal } from "@/components/LabOrderModals";
import { toast } from "sonner";

const ClinicOldLab: React.FC = () => {
  const navigate = useNavigate();
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLab, setSelectedLab] = useState<string>("all");
  const [tab, setTab] = useState<"orders" | "labs" | "stats">("orders");
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [orders, labs, plans] = await Promise.all([
        sharedClinicData.getLabOrders(),
        sharedClinicData.getLaboratories(),
        sharedClinicData.getTreatmentPlans(),
      ]);
      setLabOrders(orders);
      setLaboratories(labs);
      setTreatmentPlans(plans);
    } catch (error) {
      console.error("Failed to load lab data:", error);
    }
  };

  const handleRefresh = async () => {
    toast.info("جاري تحديث البيانات...");
    await loadData();
    toast.success("تم تحديث البيانات بنجاح");
  };

  const handleExport = () => {
    if (labOrders.length === 0) {
      toast.error("لا توجد بيانات لتصديرها");
      return;
    }

    const csvData = labOrders.map(order => ({
      رقم_الطلب: order.id,
      اسم_المريض: order.patientName,
      المختبر: order.laboratoryName,
      نوع_العمل: getOrderTypeText(order.orderType),
      الحالة: getStatusText(order.status),
      التكلفة: order.cost,
      تاريخ_الطلب: new Date(order.orderDate).toLocaleDateString('ar-IQ'),
      تاريخ_التسليم_المتوقع: new Date(order.expectedDeliveryDate).toLocaleDateString('ar-IQ'),
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `lab_orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("تم تصدير البيانات بنجاح");
  };

  const handlePrint = () => {
    window.print();
    toast.success("جاري طباعة التقرير...");
  };

  const handleNewLab = () => {
    toast.info("سيتم إضافة هذه الميزة قريباً");
  };

  // Filter orders based on search, status, and lab
  const filteredOrders = labOrders.filter((order) => {
    const matchesSearch =
      order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.laboratoryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesLab =
      selectedLab === "all" || order.laboratoryId === selectedLab;

    return matchesSearch && matchesStatus && matchesLab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ordered":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-orange-100 text-orange-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-purple-100 text-purple-800";
      case "installed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ordered":
        return "مطلوب";
      case "in_progress":
        return "قيد التحضير";
      case "ready":
        return "جاهز";
      case "delivered":
        return "مستلم";
      case "installed":
        return "مركب";
      case "cancelled":
        return "ملغي";
      default:
        return "غير محدد";
    }
  };

  const getOrderTypeText = (type: string) => {
    switch (type) {
      case "prosthetics":
        return "أطقم أسنان";
      case "crown":
        return "تيجان";
      case "bridge":
        return "جسور";
      case "implant":
        return "زراعة";
      case "orthodontics":
        return "تقويم";
      default:
        return "أخرى";
    }
  };

  const isOverdue = (order: LabOrder) => {
    const expectedDate = new Date(order.expectedDeliveryDate);
    const today = new Date();
    return (
      expectedDate < today &&
      (order.status === "ordered" || order.status === "in_progress")
    );
  };

  // Statistics
  const stats = {
    total: labOrders.length,
    pending: labOrders.filter(
      (o) => o.status === "ordered" || o.status === "in_progress",
    ).length,
    ready: labOrders.filter((o) => o.status === "ready").length,
    overdue: labOrders.filter((o) => isOverdue(o)).length,
    thisMonth: labOrders.filter(
      (o) => new Date(o.orderDate).getMonth() === new Date().getMonth(),
    ).length,
    totalCost: labOrders.reduce((sum, o) => sum + o.cost, 0),
    unpaid: labOrders.filter((o) => !o.isPaid).length,
  };

  const tabs = [
    { id: "orders" as const, label: "الطلبات", icon: Package },
    { id: "labs" as const, label: "المختبرات", icon: Building2 },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">إدارة المختبر</h1>
              <p className="text-blue-100 text-lg">إدارة شاملة لطلبات المختبر والتركيبات</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleExport}
                className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-white font-medium hover:bg-white/30 transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                تصدير
              </button>
              <button 
                onClick={() => setShowNewOrderModal(true)}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                طلب جديد
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics at Top - Merged */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            الإحصائيات
          </h3>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            تحديث
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-3xl border border-blue-100">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</p>
            <p className="text-sm font-medium text-blue-700">إجمالي الطلبات</p>
          </div>

          <div className="text-center p-6 bg-orange-50 rounded-3xl border border-orange-100">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Timer className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-600 mb-2">{stats.pending}</p>
            <p className="text-sm font-medium text-orange-700">قيد التنفيذ</p>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-3xl border border-green-100">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">{stats.ready}</p>
            <p className="text-sm font-medium text-green-700">جاهز</p>
          </div>

          <div className="text-center p-6 bg-red-50 rounded-3xl border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600 mb-2">{stats.overdue}</p>
            <p className="text-sm font-medium text-red-700">متأخر</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 mb-1">الشهر الحالي</p>
                <p className="text-2xl font-bold text-purple-900">{stats.thisMonth}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">إجمالي التكلفة</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalCost.toLocaleString()} د.ع</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 border border-amber-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 mb-1">غير مدفوع</p>
                <p className="text-2xl font-bold text-amber-900">{stats.unpaid}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Horizontal */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 overflow-x-auto">
          <button 
            onClick={() => setShowNewOrderModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">طلب جديد</span>
          </button>
          <button 
            onClick={handleNewLab}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all whitespace-nowrap"
          >
            <Building2 className="w-4 h-4" />
            <span className="text-sm font-medium">مختبر جديد</span>
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-all whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            <span className="text-sm font-medium">طباعة التقرير</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-all whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">تصدير البيانات</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border rounded-3xl p-2 shadow-sm">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700",
                )}
              >
                <Icon className="w-5 h-5" /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {tab === "orders" && <LabOrdersSection 
          labOrders={filteredOrders} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          selectedLab={selectedLab}
          setSelectedLab={setSelectedLab}
          laboratories={laboratories}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          getOrderTypeText={getOrderTypeText}
          isOverdue={isOverdue}
        />}
        {tab === "labs" && <LaboratoriesSection laboratories={laboratories} />}
      </div>

      {/* New Lab Order Modal */}
      <NewLabOrderModal 
        isOpen={showNewOrderModal}
        onClose={() => setShowNewOrderModal(false)}
      />
      
    </div>
  );
};

export default ClinicOldLab;