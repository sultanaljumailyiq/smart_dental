import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  RefreshCcw,
  ArrowUpRight,
  ArrowDownRight,
  Star,
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
import { cn } from "@/lib/utils";
import SupplierHeader from "@/components/supplier/SupplierHeader";

export default function SupplierAnalytics() {
  const [timeRange, setTimeRange] = useState("month");

  const stats = [
    {
      title: "إجمالي الإيرادات",
      value: "45,000,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "عدد الطلبات",
      value: "156",
      change: "+8.3%",
      trend: "up",
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "المنتجات المباعة",
      value: "423",
      change: "+15.2%",
      trend: "up",
      icon: Package,
      color: "bg-purple-500",
    },
    {
      title: "العملاء الجدد",
      value: "34",
      change: "+22.1%",
      trend: "up",
      icon: Users,
      color: "bg-orange-500",
    },
  ];

  const salesData = [
    { month: "يناير", sales: 32000000, orders: 120 },
    { month: "فبراير", sales: 38000000, orders: 135 },
    { month: "مارس", sales: 35000000, orders: 128 },
    { month: "أبريل", sales: 42000000, orders: 145 },
    { month: "مايو", sales: 45000000, orders: 156 },
  ];

  const topProducts = [
    {
      name: "مادة حشو الأسنان",
      sales: 3825000,
      units: 45,
      growth: 18.5,
    },
    {
      name: "قفازات طبية",
      sales: 5400000,
      units: 120,
      growth: 15.2,
    },
    {
      name: "جهاز تعقيم",
      sales: 14800000,
      units: 8,
      growth: 22.8,
    },
    {
      name: "مخدر موضعي",
      sales: 3115000,
      units: 89,
      growth: 12.3,
    },
  ];

  const customerInsights = [
    {
      segment: "عيادات كبيرة",
      percentage: 45,
      revenue: 20250000,
      count: 12,
    },
    {
      segment: "عيادات متوسطة",
      percentage: 35,
      revenue: 15750000,
      count: 28,
    },
    {
      segment: "عيادات صغيرة",
      percentage: 20,
      revenue: 9000000,
      count: 45,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      <SupplierHeader />
      <div className="p-4 lg:p-6 max-w-7xl mx-auto">
        <div className="mb-6">

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <Card key={index} className="border-r-4" style={{ borderRightColor: stat.color.replace('bg-', 'rgb(var(--') }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", stat.color.replace('500', '100'))}>
                      <stat.icon className={cn("w-6 h-6", stat.color.replace('bg-', 'text-'))} />
                    </div>
                    <Badge className={cn(
                      "text-white",
                      stat.trend === "up" ? "bg-green-500" : "bg-red-500"
                    )}>
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    {stat.title.includes("الإيرادات") && (
                      <span className="text-sm text-gray-500">د.ع</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="sales">
              <BarChart3 className="w-4 h-4 ml-2" />
              المبيعات
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="w-4 h-4 ml-2" />
              المنتجات
            </TabsTrigger>
            <TabsTrigger value="customers">
              <Users className="w-4 h-4 ml-2" />
              العملاء
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>منحنى المبيعات الشهري</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Sales Chart */}
                <div className="h-80 flex items-end justify-between gap-4 px-4">
                  {salesData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all hover:opacity-80"
                        style={{ height: `${(data.sales / 50000000) * 100}%` }}
                      >
                        <div className="p-2 text-white text-center text-xs font-semibold">
                          {(data.sales / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{data.month}</p>
                      <Badge variant="secondary">{data.orders} طلب</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>متوسط قيمة الطلب</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-4xl font-bold text-blue-600">
                      288,461
                      <span className="text-lg text-gray-500 mr-2">د.ع</span>
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <ArrowUpRight className="w-5 h-5 text-green-500" />
                      <span className="text-green-600 font-semibold">+7.5%</span>
                      <span className="text-gray-500">عن الشهر الماضي</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>معدل التحويل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-4xl font-bold text-purple-600">
                      94.5%
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <ArrowUpRight className="w-5 h-5 text-green-500" />
                      <span className="text-green-600 font-semibold">+2.3%</span>
                      <span className="text-gray-500">عن الشهر الماضي</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>أفضل المنتجات مبيعاً</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600">{product.units} وحدة مباعة</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-bold text-gray-900">
                          {product.sales.toLocaleString()} د.ع
                        </p>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-semibold">+{product.growth}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تحليل شرائح العملاء</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerInsights.map((segment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: index === 0 ? '#3b82f6' : index === 1 ? '#8b5cf6' : '#f59e0b' }}
                          />
                          <span className="font-medium text-gray-900">{segment.segment}</span>
                          <Badge variant="secondary">{segment.count} عميل</Badge>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-900">
                            {segment.revenue.toLocaleString()} د.ع
                          </p>
                          <p className="text-sm text-gray-600">{segment.percentage}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${segment.percentage}%`,
                            backgroundColor: index === 0 ? '#3b82f6' : index === 1 ? '#8b5cf6' : '#f59e0b'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">85</p>
                  <p className="text-sm text-gray-600">إجمالي العملاء</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">4.7</p>
                  <p className="text-sm text-gray-600">متوسط التقييم</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <RefreshCcw className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">72%</p>
                  <p className="text-sm text-gray-600">معدل العودة</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
