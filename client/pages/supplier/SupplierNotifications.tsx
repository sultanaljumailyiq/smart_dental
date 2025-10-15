import React, { useState } from "react";
import {
  Bell,
  Package,
  ShoppingCart,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Star,
  Award,
  Truck,
  RotateCcw,
  Settings,
  Filter,
  Search,
  Check,
  Trash2,
  Archive,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import SupplierHeader from "@/components/supplier/SupplierHeader";

interface Notification {
  id: string;
  type: "order" | "message" | "payment" | "product" | "review" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  urgent?: boolean;
  actionUrl?: string;
  icon?: React.ReactNode;
  metadata?: {
    orderId?: string;
    amount?: number;
    productName?: string;
    customerName?: string;
  };
}

export default function SupplierNotifications() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "order",
      title: "طلب جديد",
      message: "تم استلام طلب جديد من عيادة الابتسامة الذهبية",
      timestamp: "منذ 5 دقائق",
      read: false,
      urgent: true,
      actionUrl: "/supplier/orders/12345",
      metadata: {
        orderId: "ORD-2024-0012",
        amount: 1250000,
        customerName: "عيادة الابتسامة الذهبية",
      },
    },
    {
      id: "2",
      type: "message",
      title: "رسالة جديدة",
      message: "د. أحمد محمد أرسل لك رسالة حول طلبه",
      timestamp: "منذ 15 دقيقة",
      read: false,
      actionUrl: "/supplier/messages",
      metadata: {
        customerName: "د. أحمد محمد",
      },
    },
    {
      id: "3",
      type: "payment",
      title: "تحويل مالي",
      message: "تم تحويل 5,000,000 دينار إلى حسابك البنكي",
      timestamp: "منذ ساعة",
      read: false,
      metadata: {
        amount: 5000000,
      },
    },
    {
      id: "4",
      type: "product",
      title: "تحذير مخزون",
      message: "منتج 'قفازات طبية' أوشك على النفاد (5 قطع متبقية)",
      timestamp: "منذ ساعتين",
      read: false,
      urgent: true,
      actionUrl: "/supplier/products",
      metadata: {
        productName: "قفازات طبية",
      },
    },
    {
      id: "5",
      type: "review",
      title: "تقييم جديد",
      message: "عيادة النور قيمت منتجك بـ 5 نجوم",
      timestamp: "منذ 3 ساعات",
      read: true,
      metadata: {
        customerName: "عيادة النور",
      },
    },
    {
      id: "6",
      type: "order",
      title: "تم شحن الطلب",
      message: "تم شحن طلب ORD-2024-0011 بنجاح",
      timestamp: "منذ 5 ساعات",
      read: true,
      metadata: {
        orderId: "ORD-2024-0011",
      },
    },
    {
      id: "7",
      type: "system",
      title: "تحديث النظام",
      message: "تم إضافة ميزات جديدة لمركز الموردين",
      timestamp: "أمس",
      read: true,
    },
    {
      id: "8",
      type: "payment",
      title: "عمولة المنصة",
      message: "تم خصم عمولة المنصة 450,000 دينار من إيراداتك",
      timestamp: "أمس",
      read: true,
      metadata: {
        amount: 450000,
      },
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="w-5 h-5" />;
      case "message":
        return <MessageSquare className="w-5 h-5" />;
      case "payment":
        return <DollarSign className="w-5 h-5" />;
      case "product":
        return <Package className="w-5 h-5" />;
      case "review":
        return <Star className="w-5 h-5" />;
      case "system":
        return <Bell className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-500";
      case "message":
        return "bg-purple-500";
      case "payment":
        return "bg-green-500";
      case "product":
        return "bg-orange-500";
      case "review":
        return "bg-yellow-500";
      case "system":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      order: "طلب",
      message: "رسالة",
      payment: "دفعة",
      product: "منتج",
      review: "تقييم",
      system: "نظام",
    };
    return labels[type] || type;
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab !== "all" && notif.type !== activeTab) return false;
    if (searchQuery) {
      return (
        notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const urgentCount = notifications.filter((n) => n.urgent && !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getTabCount = (type: string) => {
    if (type === "all") return notifications.length;
    return notifications.filter((n) => n.type === type).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50" dir="rtl">
      <SupplierHeader />
      <div className="p-4 lg:p-6 max-w-7xl mx-auto">
        <div className="mb-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-r-4 border-r-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">إجمالي الإشعارات</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {notifications.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">غير مقروءة</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {unreadCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-red-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">عاجلة</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {urgentCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ابحث في الإشعارات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 ml-2" />
              فلترة
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-6 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="all" className="gap-2">
              <Bell className="w-4 h-4" />
              الكل ({getTabCount("all")})
            </TabsTrigger>
            <TabsTrigger value="order" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              الطلبات ({getTabCount("order")})
            </TabsTrigger>
            <TabsTrigger value="message" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              الرسائل ({getTabCount("message")})
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2">
              <DollarSign className="w-4 h-4" />
              المدفوعات ({getTabCount("payment")})
            </TabsTrigger>
            <TabsTrigger value="product" className="gap-2">
              <Package className="w-4 h-4" />
              المنتجات ({getTabCount("product")})
            </TabsTrigger>
            <TabsTrigger value="review" className="gap-2">
              <Star className="w-4 h-4" />
              التقييمات ({getTabCount("review")})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    لا توجد إشعارات
                  </h3>
                  <p className="text-gray-600">
                    لم تتلق أي إشعارات في هذه الفئة
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={cn(
                    "transition-all duration-200 hover:shadow-md",
                    !notification.read && "bg-blue-50 border-r-4 border-r-blue-500",
                    notification.urgent && "border-r-4 border-r-red-500"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0",
                          getNotificationColor(notification.type)
                        )}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900">
                              {notification.title}
                            </h3>
                            <Badge variant="secondary">
                              {getTypeLabel(notification.type)}
                            </Badge>
                            {notification.urgent && (
                              <Badge
                                variant="destructive"
                                className="bg-red-500"
                              >
                                عاجل
                              </Badge>
                            )}
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                            )}
                          </div>
                          <span className="text-sm text-gray-500 whitespace-nowrap mr-2">
                            {notification.timestamp}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">
                          {notification.message}
                        </p>

                        {/* Metadata */}
                        {notification.metadata && (
                          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                            {notification.metadata.orderId && (
                              <span>رقم الطلب: {notification.metadata.orderId}</span>
                            )}
                            {notification.metadata.amount && (
                              <span className="font-semibold text-green-600">
                                {notification.metadata.amount.toLocaleString()} د.ع
                              </span>
                            )}
                            {notification.metadata.customerName && (
                              <span>العميل: {notification.metadata.customerName}</span>
                            )}
                            {notification.metadata.productName && (
                              <span>المنتج: {notification.metadata.productName}</span>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {notification.actionUrl && (
                            <Button size="sm" variant="default">
                              عرض التفاصيل
                            </Button>
                          )}
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="w-4 h-4 ml-1" />
                              تعليم كمقروء
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="w-4 h-4 ml-1" />
                            حذف
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
