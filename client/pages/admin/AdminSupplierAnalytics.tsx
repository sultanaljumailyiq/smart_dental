import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Building2,
  Megaphone,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

export default function AdminSupplierAnalytics() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("month");

  const revenueData = [
    { month: "يناير", revenue: 45000000, commission: 4500000, orders: 1200 },
    { month: "فبراير", revenue: 52000000, commission: 5200000, orders: 1350 },
    { month: "مارس", revenue: 48000000, commission: 4800000, orders: 1280 },
    { month: "أبريل", revenue: 61000000, commission: 6100000, orders: 1520 },
    { month: "مايو", revenue: 58000000, commission: 5800000, orders: 1450 },
    { month: "يونيو", revenue: 67000000, commission: 6700000, orders: 1680 },
  ];

  const categoryData = [
    { name: "أجهزة طبية", value: 35, revenue: 23000000 },
    { name: "مستلزمات استهلاكية", value: 25, revenue: 16500000 },
    { name: "أدوات جراحية", value: 20, revenue: 13200000 },
    { name: "معدات تشخيص", value: 15, revenue: 9900000 },
    { name: "أخرى", value: 5, revenue: 3300000 },
  ];

  const topSuppliers = [
    {
      id: "1",
      name: "شركة حلول الأسنان التقنية",
      revenue: 25000000,
      orders: 350,
      commission: 2500000,
      growth: 15.5,
    },
    {
      id: "2",
      name: "شركة الإمدادات الطبية",
      revenue: 18500000,
      orders: 280,
      commission: 1850000,
      growth: 12.3,
    },
    {
      id: "3",
      name: "معدات الأسنان المتقدمة",
      revenue: 15200000,
      orders: 220,
      commission: 1520000,
      growth: -3.2,
    },
    {
      id: "4",
      name: "شركة الابتسامة الطبية",
      revenue: 12800000,
      orders: 195,
      commission: 1280000,
      growth: 8.7,
    },
    {
      id: "5",
      name: "مستلزمات الأسنان المحترفة",
      revenue: 11000000,
      orders: 165,
      commission: 1100000,
      growth: 5.4,
    },
  ];

  const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#6b7280"];

  const stats = {
    totalRevenue: 324000000,
    totalCommission: 32400000,
    totalSuppliers: 127,
    activeSuppliers: 98,
    totalProducts: 5420,
    totalOrders: 8460,
    avgOrderValue: 38298,
    monthlyGrowth: 12.5,
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      dir="rtl"
    >
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-7 h-7 text-blue-600" />
                مركز إدارة الموردين
              </h1>
              <p className="text-sm text-gray-600 mt-1">مراقبة وإدارة جميع الموردين في المنصة</p>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/suppliers")}
            >
              <Building2 className="w-4 h-4 ml-2" />
              الموردين
            </Button>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/admin/suppliers/analytics")}
            >
              <BarChart3 className="w-4 h-4 ml-2" />
              الإحصائيات
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/suppliers/promotions")}
            >
              <Megaphone className="w-4 h-4 ml-2" />
              الحملات الترويجية
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/suppliers/support")}
            >
              <MessageSquare className="w-4 h-4 ml-2" />
              الدعم
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                إحصائيات الموردين الشاملة
              </h1>
              <p className="text-gray-600">
                تحليلات مفصلة لأداء الموردين والإيرادات
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">آخر أسبوع</SelectItem>
                  <SelectItem value="month">آخر شهر</SelectItem>
                  <SelectItem value="quarter">آخر 3 أشهر</SelectItem>
                  <SelectItem value="year">آخر سنة</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <Download className="w-4 h-4 ml-2" />
                تصدير التقرير
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border-r-4 border-r-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      +{stats.monthlyGrowth}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  إجمالي إيرادات المنصة
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalRevenue.toLocaleString()}
                  <span className="text-sm text-gray-500 mr-1">د.ع</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <Badge className="bg-blue-500">10%</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">عمولة المنصة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCommission.toLocaleString()}
                  <span className="text-sm text-gray-500 mr-1">د.ع</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <Badge className="bg-purple-500">
                    {stats.activeSuppliers} نشط
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الموردين</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalSuppliers}
                </p>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-orange-600" />
                  </div>
                  <Badge className="bg-orange-500">
                    {stats.avgOrderValue.toLocaleString()} د.ع
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalOrders.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>اتجاه الإيرادات والعمولات</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    name="الإيرادات"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="commission"
                    stroke="#8b5cf6"
                    name="العمولة"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>توزيع الفئات</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name} (${entry.value}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Orders Trend */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>اتجاه الطلبات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#10b981" name="عدد الطلبات" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Suppliers */}
        <Card>
          <CardHeader>
            <CardTitle>أفضل 5 موردين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSuppliers.map((supplier, index) => (
                <div
                  key={supplier.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {supplier.name}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>{supplier.orders} طلب</span>
                        <span>•</span>
                        <span>
                          عمولة: {supplier.commission.toLocaleString()} د.ع
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-bold text-gray-900 mb-1">
                      {supplier.revenue.toLocaleString()}
                      <span className="text-sm text-gray-500 mr-1">د.ع</span>
                    </p>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-sm font-medium",
                        supplier.growth >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      )}
                    >
                      {supplier.growth >= 0 ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span>{Math.abs(supplier.growth)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
