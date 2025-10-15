import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  DollarSign,
  Star,
  Calendar,
  TrendingUp,
  Award,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import SupplierHeader from "@/components/supplier/SupplierHeader";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: "active" | "inactive";
  rating: number;
  segment: "vip" | "regular" | "new";
}

export default function SupplierCustomers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSegment, setFilterSegment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "عيادة الابتسامة الذهبية",
      email: "smile@clinic.iq",
      phone: "07901234567",
      location: "بغداد - الكرادة",
      totalOrders: 24,
      totalSpent: 18500000,
      lastOrder: "منذ يومين",
      status: "active",
      rating: 4.9,
      segment: "vip",
    },
    {
      id: "2",
      name: "د. أحمد محمد",
      email: "ahmed@dentist.iq",
      phone: "07801234567",
      location: "بغداد - المنصور",
      totalOrders: 12,
      totalSpent: 8200000,
      lastOrder: "منذ 5 أيام",
      status: "active",
      rating: 4.7,
      segment: "regular",
    },
    {
      id: "3",
      name: "مركز بغداد للأسنان",
      email: "baghdad@dental.iq",
      phone: "07701234567",
      location: "بغداد - الجادرية",
      totalOrders: 35,
      totalSpent: 25600000,
      lastOrder: "أمس",
      status: "active",
      rating: 4.8,
      segment: "vip",
    },
    {
      id: "4",
      name: "عيادة النور",
      email: "alnoor@clinic.iq",
      phone: "07601234567",
      location: "بغداد - الكاظمية",
      totalOrders: 3,
      totalSpent: 1250000,
      lastOrder: "منذ أسبوع",
      status: "active",
      rating: 4.5,
      segment: "new",
    },
    {
      id: "5",
      name: "د. فاطمة علي",
      email: "fatima@dentist.iq",
      phone: "07501234567",
      location: "بغداد - الأعظمية",
      totalOrders: 8,
      totalSpent: 4800000,
      lastOrder: "منذ شهر",
      status: "inactive",
      rating: 4.6,
      segment: "regular",
    },
  ]);

  const segmentColors = {
    vip: "bg-purple-500",
    regular: "bg-blue-500",
    new: "bg-green-500",
  };

  const segmentLabels = {
    vip: "VIP",
    regular: "عادي",
    new: "جديد",
  };

  const filteredCustomers = customers.filter((customer) => {
    if (filterSegment !== "all" && customer.segment !== filterSegment)
      return false;
    if (filterStatus !== "all" && customer.status !== filterStatus) return false;
    if (searchQuery) {
      return (
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery)
      );
    }
    return true;
  });

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    vip: customers.filter((c) => c.segment === "vip").length,
    avgSpent:
      customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length,
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50"
      dir="rtl"
    >
      <SupplierHeader />
      <div className="p-4 lg:p-6 max-w-7xl mx-auto">
        <div className="mb-6">

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-r-4 border-r-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">إجمالي العملاء</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.total}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">عملاء نشطين</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.active}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">عملاء VIP</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.vip}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">متوسط الإنفاق</p>
                    <p className="text-lg font-bold text-gray-900">
                      {Math.round(stats.avgSpent).toLocaleString()}
                      <span className="text-xs text-gray-500 mr-1">د.ع</span>
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ابحث عن عميل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={filterSegment} onValueChange={setFilterSegment}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="الشريحة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الشرائح</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="regular">عادي</SelectItem>
                <SelectItem value="new">جديد</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => (
            <Card
              key={customer.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-lg">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {customer.name}
                      </h3>
                      <Badge
                        className={cn(
                          "text-white mt-1",
                          segmentColors[customer.segment]
                        )}
                      >
                        {segmentLabels[customer.segment]}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 ml-2" />
                        عرض التفاصيل
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 ml-2" />
                        إرسال رسالة
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{customer.location}</span>
                  </div>
                </div>

                <div className="border-t pt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">عدد الطلبات:</span>
                    <span className="font-semibold text-gray-900">
                      {customer.totalOrders}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">إجمالي الإنفاق:</span>
                    <span className="font-semibold text-green-600">
                      {customer.totalSpent.toLocaleString()} د.ع
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">آخر طلب:</span>
                    <span className="text-gray-900">{customer.lastOrder}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">التقييم:</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-900">
                        {customer.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1" size="sm">
                    <Eye className="w-4 h-4 ml-1" />
                    عرض
                  </Button>
                  <Button className="flex-1" size="sm">
                    <Mail className="w-4 h-4 ml-1" />
                    تواصل
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا يوجد عملاء
              </h3>
              <p className="text-gray-600">
                لم يتم العثور على عملاء يطابقون البحث أو الفلاتر
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
