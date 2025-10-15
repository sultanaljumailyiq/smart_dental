import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  DollarSign,
  CreditCard,
  Search,
  User,
  FileText,
  Edit,
  Eye,
  Building2,
  Phone,
  MapPin,
  Mail,
  Star,
  TrendingUp,
  Activity,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import { LabOrder, Laboratory } from "@/services/sharedClinicData";

interface LabOrdersSectionProps {
  labOrders: LabOrder[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  selectedLab: string;
  setSelectedLab: (lab: string) => void;
  laboratories: Laboratory[];
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  getOrderTypeText: (type: string) => string;
  isOverdue: (order: LabOrder) => boolean;
}

export function LabOrdersSection({
  labOrders,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  selectedLab,
  setSelectedLab,
  laboratories,
  getStatusColor,
  getStatusText,
  getOrderTypeText,
  isOverdue,
}: LabOrdersSectionProps) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في الطلبات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="ordered">مطلوب</option>
              <option value="in_progress">قيد التحضير</option>
              <option value="ready">جاهز</option>
              <option value="delivered">مستلم</option>
            </select>

            <select
              value={selectedLab}
              onChange={(e) => setSelectedLab(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">جميع المختبرات</option>
              {laboratories.map((lab) => (
                <option key={lab.id} value={lab.id}>
                  {lab.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المريض
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نوع الطلب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المختبر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ التسليم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التكلفة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الدفع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {labOrders.map((order) => (
                <tr
                  key={order.id}
                  className={cn(
                    "hover:bg-gray-50",
                    isOverdue(order) && "bg-red-50",
                  )}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="mr-3">
                        <div className="text-sm font-medium text-gray-900">
                          {order.patientName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getOrderTypeText(order.orderType)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.laboratoryName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                    {isOverdue(order) && (
                      <Badge className="bg-red-100 text-red-800 mr-2">
                        متأخر
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.expectedDeliveryDate).toLocaleDateString("ar-IQ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.cost.toLocaleString()} د.ع
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      className={
                        order.isPaid
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {order.isPaid ? "مدفوع" : "غير مدفوع"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Link
                        to={`/clinic_old/patient/${order.patientId}`}
                        className="inline-flex"
                      >
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface LaboratoriesSectionProps {
  laboratories: Laboratory[];
}

export function LaboratoriesSection({ laboratories }: LaboratoriesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {laboratories.map((lab) => (
          <div key={lab.id} className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{lab.name}</h3>
                <p className="text-sm text-gray-600">{lab.specialties.join(", ")}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {lab.phone || "غير محدد"}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                {lab.email || "غير محدد"}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                {lab.address}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">4.5</span>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  نشط
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LabStatsSectionProps {
  stats: {
    total: number;
    pending: number;
    ready: number;
    overdue: number;
    thisMonth: number;
    totalCost: number;
    unpaid: number;
  };
}

export function LabStatsSection({ stats }: LabStatsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div className="mr-3">
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">إجمالي الطلبات</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="mr-3">
              <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-600">قيد التحضير</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="mr-3">
              <p className="text-xl font-bold text-gray-900">{stats.ready}</p>
              <p className="text-sm text-gray-600">جاهز</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="mr-3">
              <p className="text-xl font-bold text-gray-900">{stats.overdue}</p>
              <p className="text-sm text-gray-600">متأخر</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="mr-3">
              <p className="text-xl font-bold text-gray-900">{stats.thisMonth}</p>
              <p className="text-sm text-gray-600">هذا الشهر</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mr-3">
              <p className="text-lg font-bold text-gray-900">
                {(stats.totalCost / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-gray-600">إجمالي التكلفة</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="mr-3">
              <p className="text-xl font-bold text-gray-900">{stats.unpaid}</p>
              <p className="text-sm text-gray-600">غير مدفوع</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="mr-3">
              <p className="text-xl font-bold text-gray-900">
                {((stats.ready / stats.total) * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-gray-600">معدل الإنجاز</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}