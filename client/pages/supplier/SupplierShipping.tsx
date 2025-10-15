import React, { useState } from "react";
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Navigation,
  Phone,
  Mail,
  Calendar,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import SupplierHeader from "@/components/supplier/SupplierHeader";

interface Shipment {
  id: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  status: "pending" | "picked_up" | "in_transit" | "delivered" | "returned";
  customer: string;
  destination: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  items: number;
}

interface Carrier {
  id: string;
  name: string;
  phone: string;
  email: string;
  coverage: string;
  activeShipments: number;
  rating: number;
}

export default function SupplierShipping() {
  const [activeTab, setActiveTab] = useState("shipments");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: "1",
      orderNumber: "ORD-2024-0012",
      trackingNumber: "TRK-BG-12345",
      carrier: "شركة بغداد للتوصيل السريع",
      status: "in_transit",
      customer: "عيادة الابتسامة الذهبية",
      destination: "بغداد - الكرادة",
      estimatedDelivery: "2024-01-25",
      items: 5,
    },
    {
      id: "2",
      orderNumber: "ORD-2024-0011",
      trackingNumber: "TRK-BG-12344",
      carrier: "شركة النجم للشحن",
      status: "delivered",
      customer: "د. أحمد محمد",
      destination: "بغداد - المنصور",
      estimatedDelivery: "2024-01-24",
      actualDelivery: "2024-01-24",
      items: 3,
    },
    {
      id: "3",
      orderNumber: "ORD-2024-0010",
      trackingNumber: "TRK-BG-12343",
      carrier: "شركة بغداد للتوصيل السريع",
      status: "pending",
      customer: "مركز بغداد للأسنان",
      destination: "بغداد - الجادرية",
      estimatedDelivery: "2024-01-26",
      items: 8,
    },
  ]);

  const [carriers, setCarriers] = useState<Carrier[]>([
    {
      id: "1",
      name: "شركة بغداد للتوصيل السريع",
      phone: "07901234567",
      email: "baghdad@delivery.iq",
      coverage: "بغداد وضواحيها",
      activeShipments: 45,
      rating: 4.8,
    },
    {
      id: "2",
      name: "شركة النجم للشحن",
      phone: "07809876543",
      email: "alnajm@shipping.iq",
      coverage: "جميع المحافظات",
      activeShipments: 32,
      rating: 4.6,
    },
    {
      id: "3",
      name: "خدمات التوصيل الوطنية",
      phone: "07701122334",
      email: "national@delivery.iq",
      coverage: "العراق بالكامل",
      activeShipments: 28,
      rating: 4.7,
    },
  ]);

  const statusColors = {
    pending: "bg-yellow-500",
    picked_up: "bg-blue-500",
    in_transit: "bg-purple-500",
    delivered: "bg-green-500",
    returned: "bg-red-500",
  };

  const statusLabels = {
    pending: "قيد الانتظار",
    picked_up: "تم الاستلام",
    in_transit: "في الطريق",
    delivered: "تم التوصيل",
    returned: "مرتجع",
  };

  const statusIcons = {
    pending: Clock,
    picked_up: Package,
    in_transit: Truck,
    delivered: CheckCircle,
    returned: XCircle,
  };

  const filteredShipments = shipments.filter((shipment) => {
    if (filterStatus !== "all" && shipment.status !== filterStatus) return false;
    if (searchQuery) {
      return (
        shipment.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.trackingNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        shipment.customer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter((s) => s.status === "in_transit").length,
    delivered: shipments.filter((s) => s.status === "delivered").length,
    pending: shipments.filter((s) => s.status === "pending").length,
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
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
                    <p className="text-sm text-gray-600">إجمالي الشحنات</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.total}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">في الطريق</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.inTransit}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">تم التوصيل</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.delivered}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-yellow-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">قيد الانتظار</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.pending}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
            <TabsTrigger value="shipments">
              <Truck className="w-4 h-4 ml-2" />
              الشحنات
            </TabsTrigger>
            <TabsTrigger value="carriers">
              <Navigation className="w-4 h-4 ml-2" />
              شركات الشحن
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shipments" className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="ابحث عن شحنة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="picked_up">تم الاستلام</SelectItem>
                  <SelectItem value="in_transit">في الطريق</SelectItem>
                  <SelectItem value="delivered">تم التوصيل</SelectItem>
                  <SelectItem value="returned">مرتجع</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 ml-2" />
                تصدير
              </Button>
            </div>

            {/* Shipments List */}
            <div className="space-y-3">
              {filteredShipments.map((shipment) => {
                const StatusIcon = statusIcons[shipment.status];
                return (
                  <Card key={shipment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center text-white",
                              statusColors[shipment.status]
                            )}
                          >
                            <StatusIcon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {shipment.trackingNumber}
                              </h3>
                              <Badge
                                className={cn(
                                  "text-white",
                                  statusColors[shipment.status]
                                )}
                              >
                                {statusLabels[shipment.status]}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">رقم الطلب:</span>{" "}
                                {shipment.orderNumber}
                              </div>
                              <div>
                                <span className="font-medium">العميل:</span>{" "}
                                {shipment.customer}
                              </div>
                              <div>
                                <span className="font-medium">الوجهة:</span>{" "}
                                {shipment.destination}
                              </div>
                              <div>
                                <span className="font-medium">الناقل:</span>{" "}
                                {shipment.carrier}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">
                                  التوصيل المتوقع: {shipment.estimatedDelivery}
                                </span>
                              </div>
                              {shipment.actualDelivery && (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>
                                    تم التوصيل: {shipment.actualDelivery}
                                  </span>
                                </div>
                              )}
                              <Badge variant="secondary">
                                {shipment.items} منتج
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 ml-1" />
                            تتبع
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 ml-1" />
                            تعديل
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="carriers" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {carriers.map((carrier) => (
                <Card key={carrier.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Truck className="w-6 h-6 text-blue-600" />
                      </div>
                      <Badge variant="secondary">
                        {carrier.activeShipments} شحنة نشطة
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {carrier.name}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{carrier.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{carrier.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{carrier.coverage}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={cn(
                                "text-lg",
                                i < Math.floor(carrier.rating)
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              )}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({carrier.rating})
                        </span>
                      </div>
                      <Button size="sm">
                        <Edit className="w-4 h-4 ml-1" />
                        تعديل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
