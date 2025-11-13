import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Plus, Search, Filter, ArrowLeft, Clock, CheckCircle, AlertTriangle, Phone, MapPin, Calendar, DollarSign, User, FileText, Eye, Edit, Star, Building2, Truck, CreditCard, Timer, Target, Activity, TrendingUp, Award, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ClinicSubNav from "@/components/ClinicSubNav";
import { sharedClinicData, Laboratory, LabOrder, TreatmentPlan } from "@/services/sharedClinicData";
const ClinicNewLab: React.FC = () => {
  const navigate = useNavigate();
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLab, setSelectedLab] = useState<string>("all");
  const [showAddOrder, setShowAddOrder] = useState(false);
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    try {
      const [orders, labs, plans] = await Promise.all([sharedClinicData.getLabOrders(), sharedClinicData.getLaboratories(), sharedClinicData.getTreatmentPlans()]);
      setLabOrders(orders);
      setLaboratories(labs);
      setTreatmentPlans(plans);
    } catch (error) {
      console.error("Failed to load lab data:", error);
    }
  };

  // Filter orders based on search, status, and lab
  const filteredOrders = labOrders.filter(order => {
    const matchesSearch = order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || order.description.toLowerCase().includes(searchQuery.toLowerCase()) || order.laboratoryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesLab = selectedLab === "all" || order.laboratoryId === selectedLab;
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
        return "غير مح��د";
    }
  };
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "normal":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };
  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case "prosthetics":
        return "🦷";
      case "crown":
        return "👑";
      case "bridge":
        return "🌉";
      case "implant":
        return "🔩";
      case "orthodontics":
        return "📐";
      default:
        return "🔬";
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
    return expectedDate < today && (order.status === "ordered" || order.status === "in_progress");
  };

  // Statistics
  const stats = {
    total: labOrders.length,
    pending: labOrders.filter(o => o.status === "ordered" || o.status === "in_progress").length,
    ready: labOrders.filter(o => o.status === "ready").length,
    overdue: labOrders.filter(o => isOverdue(o)).length,
    thisMonth: labOrders.filter(o => new Date(o.orderDate).getMonth() === new Date().getMonth()).length,
    totalCost: labOrders.reduce((sum, o) => sum + o.cost, 0),
    unpaid: labOrders.filter(o => !o.isPaid).length
  };
  return <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/clinic" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  إدارة المخت��ر
                </h1>
                <p className="text-sm text-gray-600">
                  {filteredOrders.length} طلب
                </p>
              </div>
            </div>

            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              طلب جديد
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <ClinicSubNav />
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="ابحث عن طلب أو مريض..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
            </div>

            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="all">جميع الحالات</option>
              <option value="ordered">مطلوب</option>
              <option value="in_progress">قيد التحضير</option>
              <option value="ready">جاهز</option>
              <option value="delivered">مستلم</option>
            </select>

            <select value={selectedLab} onChange={e => setSelectedLab(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="all">جميع المختبرات</option>
              {laboratories.map(lab => <option key={lab.id} value={lab.id}>
                  {lab.name}
                </option>)}
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
                <p className="text-sm text-gray-600">إجمالي الطلبات</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
                <p className="text-sm text-gray-600">قيد التحضير</p>
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
                  {stats.ready}
                </p>
                <p className="text-sm text-gray-600">جاهز</p>
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
                  {stats.overdue}
                </p>
                <p className="text-sm text-gray-600">متأخر</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.thisMonth}
                </p>
                <p className="text-sm text-gray-600">هذا الشهر</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {(stats.totalCost / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-gray-600">إجمالي التكلفة</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.unpaid}
                </p>
                <p className="text-sm text-gray-600">غير مدفوع</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lab Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? filteredOrders.map(order => <div key={order.id} className={cn("bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300", isOverdue(order) ? "border-red-200 bg-red-50" : "border-gray-100")}>
                {/* Order Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getOrderTypeIcon(order.orderType)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {order.patientName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {getOrderTypeText(order.orderType)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getPriorityIcon(order.priority)}
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                      {isOverdue(order) && <Badge className="bg-red-100 text-red-800">متأخر</Badge>}
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        {order.description}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4" />
                        {order.laboratoryName}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        تاريخ الطلب:{" "}
                        {new Date(order.orderDate).toLocaleDateString("ar-IQ")}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Timer className="w-4 h-4" />
                        التسليم المتوقع:{" "}
                        {new Date(order.expectedDeliveryDate).toLocaleDateString("ar-IQ")}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        التكلفة: {order.cost.toLocaleString()} د.ع
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard className="w-4 h-4" />
                        <span className={order.isPaid ? "text-green-600" : "text-red-600"}>
                          {order.isPaid ? "مدفوع" : "غير مدفوع"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Specifications */}
                  {order.specifications && (
                    <div className="text-xs text-gray-600 mt-2">
                      <strong>المواصفات:</strong> {JSON.stringify(order.specifications)}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      عرض التفاصيل
                    </Button>

                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      تعديل
                    </Button>

                    <Button size="sm" variant="outline" onClick={() => navigate(`/clinic/patients/${order.patientId}`)}>
                      <User className="w-4 h-4 mr-2" />
                      ملف المريض
                    </Button>

                    {order.status === "ready" && <Button size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        تأكيد الاستلام
                      </Button>}

                    {!order.isPaid && <Button size="sm" variant="outline">
                        <CreditCard className="w-4 h-4 mr-2" />
                        تسجيل الدفع
                      </Button>}
                  </div>
                </div>
              </div>) : <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد طلبات
              </h3>
              <p className="text-gray-600 mb-4">
                لا توجد طلبات مختبر مطابقة للبحث
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                إضافة طلب جديد
              </Button>
            </div>}
        </div>

        {/* Laboratory Partners */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              المختبرات الشريكة
            </h2>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              إضافة مختبر
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {laboratories.map(lab => <div key={lab.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{lab.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({
                    length: 5
                  }).map((_, i) => <Star key={i} className={cn("w-3 h-3", i < Math.floor(lab.qualityRating) ? "text-yellow-500 fill-current" : "text-gray-300")} />)}
                      <span className="text-xs text-gray-600 ml-1">
                        {lab.qualityRating}
                      </span>
                    </div>
                  </div>
                  <Badge variant={lab.isActive ? "default" : "secondary"}>
                    {lab.isActive ? "نشط" : "غير نشط"}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  
                  
                  
                  
                </div>

                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Phone className="w-3 h-3 mr-1" />
                    اتصا��
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    طلب جديد
                  </Button>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default ClinicNewLab;
