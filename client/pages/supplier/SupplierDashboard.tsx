import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Bell,
  MessageSquare,
  Truck,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  BarChart3,
  Calendar,
  Star,
  Award,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  RefreshCcw,
  Settings,
  Search,
  ChevronRight,
  Box,
  Percent,
  Zap,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import SupplierHeader from "@/components/supplier/SupplierHeader";
import QuickActions from "@/components/supplier/QuickActions";

interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  pendingOrders: number;
  activeProducts: number;
  productsChange: number;
  unreadMessages: number;
  newNotifications: number;
  platformCommission: number;
  netRevenue: number;
  avgOrderValue: number;
  completionRate: number;
  customerSatisfaction: number;
  returnsCount: number;
  activeDeliveries: number;
}


interface RecentOrder {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  items: number;
}

interface ProductPerformance {
  id: string;
  name: string;
  sold: number;
  revenue: number;
  stock: number;
  trend: "up" | "down" | "stable";
}

export default function EnhancedSupplierDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 45000000,
    revenueChange: 12.5,
    totalOrders: 156,
    ordersChange: 8.3,
    pendingOrders: 12,
    activeProducts: 89,
    productsChange: 5.2,
    unreadMessages: 7,
    newNotifications: 15,
    platformCommission: 4500000,
    netRevenue: 40500000,
    avgOrderValue: 288461,
    completionRate: 94.5,
    customerSatisfaction: 4.7,
    returnsCount: 3,
    activeDeliveries: 18,
  });

  const quickActions = [
    {
      id: "1",
      titleArabic: "طلبات قيد الانتظار",
      icon: <Clock className="w-4 h-4" />,
      count: 12,
      color: "bg-amber-500",
      link: "/supplier/orders?status=pending",
      urgent: true,
    },
    {
      id: "2",
      titleArabic: "رسائل غير مقروءة",
      icon: <MessageSquare className="w-4 h-4" />,
      count: 7,
      color: "bg-blue-500",
      link: "/supplier/messages",
    },
    {
      id: "3",
      titleArabic: "شحنات نشطة",
      icon: <Truck className="w-4 h-4" />,
      count: 18,
      color: "bg-purple-500",
      link: "/supplier/shipping",
    },
    {
      id: "4",
      titleArabic: "مرتجعات",
      icon: <RotateCcw className="w-4 h-4" />,
      count: 3,
      color: "bg-red-500",
      link: "/supplier/returns",
      urgent: stats.returnsCount > 0,
    },
    {
      id: "5",
      titleArabic: "منتجات منخفضة المخزون",
      icon: <AlertCircle className="w-4 h-4" />,
      count: 8,
      color: "bg-orange-500",
      link: "/supplier/products?filter=low_stock",
    },
    {
      id: "6",
      titleArabic: "إشعارات جديدة",
      icon: <Bell className="w-4 h-4" />,
      count: 15,
      color: "bg-green-500",
      link: "/supplier/notifications",
    },
  ];

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([
    {
      id: "1",
      orderNumber: "ORD-2024-0012",
      customer: "عيادة الابتسامة الدهبية",
      total: 1250000,
      status: "pending",
      date: "منذ ساعتين",
      items: 5,
    },
    {
      id: "2",
      orderNumber: "ORD-2024-0011",
      customer: "د. أحمد محمد",
      total: 850000,
      status: "confirmed",
      date: "منذ 4 ساعات",
      items: 3,
    },
    {
      id: "3",
      orderNumber: "ORD-2024-0010",
      customer: "مركز بغداد للأسنان",
      total: 2100000,
      status: "processing",
      date: "اليوم",
      items: 8,
    },
    {
      id: "4",
      orderNumber: "ORD-2024-0009",
      customer: "عيادة النور",
      total: 650000,
      status: "shipped",
      date: "أمس",
      items: 2,
    },
  ]);

  const [topProducts, setTopProducts] = useState<ProductPerformance[]>([
    {
      id: "1",
      name: "مادة حشو الأسنان - Composite",
      sold: 45,
      revenue: 3825000,
      stock: 28,
      trend: "up",
    },
    {
      id: "2",
      name: "قفازات طبية (علبة 100)",
      sold: 120,
      revenue: 5400000,
      stock: 85,
      trend: "up",
    },
    {
      id: "3",
      name: "جهاز تبييض الأسنان",
      sold: 8,
      revenue: 20000000,
      stock: 4,
      trend: "stable",
    },
  ]);

  const getStatusBadge = (status: RecentOrder["status"]) => {
    const statusConfig = {
      pending: { label: "قيد الانتظار", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
      confirmed: { label: "مؤكد", className: "bg-blue-100 text-blue-800 border-blue-300" },
      processing: { label: "قيد المعالجة", className: "bg-purple-100 text-purple-800 border-purple-300" },
      shipped: { label: "تم الشحن", className: "bg-indigo-100 text-indigo-800 border-indigo-300" },
      delivered: { label: "تم التسليم", className: "bg-green-100 text-green-800 border-green-300" },
      cancelled: { label: "ملغي", className: "bg-red-100 text-red-800 border-red-300" },
    };
    const config = statusConfig[status];
    return <Badge className={cn(config.className, "border")}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      <SupplierHeader />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <QuickActions actions={quickActions} />
        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue Card */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-100">إجمالي الإيرادات</CardTitle>
                <DollarSign className="w-5 h-5 text-blue-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalRevenue.toLocaleString("ar-IQ")} IQD</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-sm bg-blue-400/30 rounded-full px-2 py-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stats.revenueChange}%</span>
                </div>
                <span className="text-xs text-blue-100">مقارنة بالشهر الماضي</span>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-400/30">
                <div className="flex justify-between text-xs text-blue-100">
                  <span>صافي الربح</span>
                  <span className="font-semibold">{stats.netRevenue.toLocaleString("ar-IQ")} IQD</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Card */}
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-100">إجمالي الطلبات</CardTitle>
                <ShoppingCart className="w-5 h-5 text-green-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalOrders}</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-sm bg-green-400/30 rounded-full px-2 py-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stats.ordersChange}%</span>
                </div>
                <span className="text-xs text-green-100">هذا الشهر</span>
              </div>
              <div className="mt-3 pt-3 border-t border-green-400/30">
                <div className="flex justify-between text-xs text-green-100">
                  <span>قيد الانتظار</span>
                  <span className="font-semibold bg-green-700 rounded-full px-2 py-0.5">{stats.pendingOrders}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Card */}
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-100">المنتجات النشطة</CardTitle>
                <Package className="w-5 h-5 text-purple-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeProducts}</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-sm bg-purple-400/30 rounded-full px-2 py-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stats.productsChange}%</span>
                </div>
                <span className="text-xs text-purple-100">نمو المنتجات</span>
              </div>
              <div className="mt-3 pt-3 border-t border-purple-400/30">
                <div className="flex justify-between text-xs text-purple-100">
                  <span>متوسط قيمة الطلب</span>
                  <span className="font-semibold">{stats.avgOrderValue.toLocaleString("ar-IQ")} IQD</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Satisfaction Card */}
          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-amber-100">رضا العملاء</CardTitle>
                <Star className="w-5 h-5 text-amber-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-center gap-2">
                {stats.customerSatisfaction}
                <span className="text-lg text-amber-100">/5.0</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-4 h-4",
                      star <= Math.floor(stats.customerSatisfaction) ? "fill-amber-200 text-amber-200" : "text-amber-300"
                    )}
                  />
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-amber-400/30">
                <div className="flex justify-between text-xs text-amber-100">
                  <span>معدل الإنجاز</span>
                  <span className="font-semibold">{stats.completionRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders - 2 columns */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader className="border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                    الطلبات الأخيرة
                  </CardTitle>
                  <CardDescription className="mt-1">آخر الطلبات المستلمة</CardDescription>
                </div>
                <Link to="/supplier/orders">
                  <Button variant="outline" size="sm" className="gap-2">
                    عرض الكل
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {recentOrders.map((order, index) => (
                  <div
                    key={order.id}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm font-semibold text-gray-900">{order.orderNumber}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Box className="w-3 h-3" />
                            {order.items} منتج
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {order.date}
                          </span>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-bold text-gray-900">{order.total.toLocaleString("ar-IQ")}</p>
                        <p className="text-xs text-gray-500">دينار عراقي</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products - 1 column */}
          <Card className="shadow-lg">
            <CardHeader className="border-b border-gray-200 bg-gray-50">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  المنتجات الأكثر مبيعاً
                </CardTitle>
                <CardDescription className="mt-1">أفضل الأداء</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold",
                          index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-600"
                        )}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 leading-tight">{product.name}</p>
                        </div>
                      </div>
                      {product.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {product.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">مبيعات</p>
                        <p className="text-sm font-bold text-gray-900">{product.sold}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">إيرادات</p>
                        <p className="text-sm font-bold text-green-600">
                          {(product.revenue / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">مخزون</p>
                        <p className={cn(
                          "text-sm font-bold",
                          product.stock < 10 ? "text-red-600" : "text-gray-900"
                        )}>
                          {product.stock}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Summary */}
        <Card className="shadow-lg">
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              الملخص المالي
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">إجمالي المبيعات</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalRevenue.toLocaleString("ar-IQ")}</p>
                <p className="text-xs text-gray-500 mt-1">دينار عراقي</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">عمولة المنصة ({((stats.platformCommission / stats.totalRevenue) * 100).toFixed(1)}%)</p>
                <p className="text-2xl font-bold text-red-600">{stats.platformCommission.toLocaleString("ar-IQ")}</p>
                <p className="text-xs text-gray-500 mt-1">دينار عراقي</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">صافي الربح</p>
                <p className="text-2xl font-bold text-green-600">{stats.netRevenue.toLocaleString("ar-IQ")}</p>
                <p className="text-xs text-gray-500 mt-1">دينار عراقي</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">متوسط قيمة الطلب</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgOrderValue.toLocaleString("ar-IQ")}</p>
                <p className="text-xs text-gray-500 mt-1">دينار عراقي</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="shadow-lg">
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              روابط سريعة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/supplier/products">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                  <Package className="w-5 h-5 text-blue-600" />
                  <div className="text-right">
                    <p className="font-semibold text-sm">إدارة المنتجات</p>
                    <p className="text-xs text-gray-500">إضافة وتعديل</p>
                  </div>
                </Button>
              </Link>
              <Link to="/supplier/orders">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                  <div className="text-right">
                    <p className="font-semibold text-sm">الطلبات</p>
                    <p className="text-xs text-gray-500">متابعة الطلبات</p>
                  </div>
                </Button>
              </Link>
              <Link to="/supplier/shipping">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                  <Truck className="w-5 h-5 text-purple-600" />
                  <div className="text-right">
                    <p className="font-semibold text-sm">الشحن</p>
                    <p className="text-xs text-gray-500">تتبع التوصيل</p>
                  </div>
                </Button>
              </Link>
              <Link to="/supplier/analytics">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <div className="text-right">
                    <p className="font-semibold text-sm">التحليلات</p>
                    <p className="text-xs text-gray-500">تقارير مفصلة</p>
                  </div>
                </Button>
              </Link>
              <Link to="/supplier/payments">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div className="text-right">
                    <p className="font-semibold text-sm">المدفوعات</p>
                    <p className="text-xs text-gray-500">المالية</p>
                  </div>
                </Button>
              </Link>
              <Link to="/supplier/customers">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                  <Users className="w-5 h-5 text-amber-600" />
                  <div className="text-right">
                    <p className="font-semibold text-sm">العملاء</p>
                    <p className="text-xs text-gray-500">إدارة العلاقات</p>
                  </div>
                </Button>
              </Link>
              <Link to="/supplier/returns">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                  <RotateCcw className="w-5 h-5 text-red-600" />
                  <div className="text-right">
                    <p className="font-semibold text-sm">المرتجعات</p>
                    <p className="text-xs text-gray-500">إدارة الاسترجاع</p>
                  </div>
                </Button>
              </Link>
              <Link to="/supplier/messages">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <div className="text-right">
                    <p className="font-semibold text-sm">الرسائل</p>
                    <p className="text-xs text-gray-500">التواصل مع العملاء</p>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
