import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  User,
  Calendar,
  Star,
  MessageSquare,
  Download,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Eye,
  Search,
  Filter,
  MoreVertical,
  Copy,
  Share2,
  CreditCard,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingSpinner, ProgressBar } from "./LoadingIndicators";

interface Order {
  id: string;
  orderNumber: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  placedDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  tracking?: TrackingInfo[];
  supplier: {
    id: string;
    name: string;
    phone: string;
    rating: number;
  };
  notes?: string;
}

interface OrderItem {
  id: string;
  name: string;
  brand: string;
  image: string;
  quantity: number;
  price: number;
  total: number;
}

interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  governorate: string;
}

interface TrackingInfo {
  id: string;
  status: string;
  description: string;
  timestamp: string;
  location?: string;
  isCompleted: boolean;
}

// Mock data
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001234",
    status: "shipped",
    placedDate: "2024-01-15T10:30:00Z",
    estimatedDelivery: "2024-01-18T17:00:00Z",
    items: [
      {
        id: "1",
        name: "مادة التخدير الموضعي - يدوكائين 2%",
        brand: "Septodont",
        image:
          "https://images.unsplash.com/photo-1576671081837-49000212a370?w=300",
        quantity: 2,
        price: 15000,
        total: 30000,
      },
      {
        id: "2",
        name: "حشوة الكومبوزيت الضوئية",
        brand: "3M ESPE",
        image:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300",
        quantity: 1,
        price: 85000,
        total: 85000,
      },
    ],
    subtotal: 115000,
    shippingCost: 15000,
    discount: 0,
    total: 130000,
    shippingAddress: {
      name: "د. أحمد محمد علي",
      phone: "+964 770 123 4567",
      address: "شارع الكندي، بناية 15، الطابق 3",
      city: "حي الجامعة",
      governorate: "بغداد",
    },
    paymentMethod: "الدفع عند الاستلام",
    paymentStatus: "pending",
    supplier: {
      id: "sup1",
      name: "شركة الرائد للمستلزمات الطبية",
      phone: "+964 780 987 6543",
      rating: 4.8,
    },
    tracking: [
      {
        id: "1",
        status: "order_placed",
        description: "تم تقديم الطلب بنجاح",
        timestamp: "2024-01-15T10:30:00Z",
        location: "النظام الإلكتروني",
        isCompleted: true,
      },
      {
        id: "2",
        status: "confirmed",
        description: "تم تأكيد الطلب من المورد",
        timestamp: "2024-01-15T14:15:00Z",
        location: "مخازن الرائد - بغداد",
        isCompleted: true,
      },
      {
        id: "3",
        status: "processing",
        description: "جاري تحضير الطلب",
        timestamp: "2024-01-16T09:00:00Z",
        location: "مخازن الرائد - بغداد",
        isCompleted: true,
      },
      {
        id: "4",
        status: "shipped",
        description: "تم شحن الطلب",
        timestamp: "2024-01-16T16:30:00Z",
        location: "شركة الشحن السريع",
        isCompleted: true,
      },
      {
        id: "5",
        status: "out_for_delivery",
        description: "الطلب في طريقه للتسليم",
        timestamp: "",
        location: "بغداد - الكرخ",
        isCompleted: false,
      },
      {
        id: "6",
        status: "delivered",
        description: "تم تسليم الطلب",
        timestamp: "",
        location: "عنوان التسليم",
        isCompleted: false,
      },
    ],
  },
];

interface OrderTrackingProps {
  orderId?: string;
  className?: string;
}

export function OrderTracking({ orderId, className }: OrderTrackingProps) {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    orderId ? orders.find((order) => order.id === orderId) || null : null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "processing":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "shipped":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "في الانتظار";
      case "confirmed":
        return "مؤكد";
      case "processing":
        return "قيد التحضير";
      case "shipped":
        return "تم الشحن";
      case "delivered":
        return "تم التسليم";
      case "cancelled":
        return "ملغي";
      default:
        return status;
    }
  };

  const getProgressPercentage = (order: Order) => {
    if (!order.tracking) return 0;

    const completedSteps = order.tracking.filter(
      (step) => step.isCompleted,
    ).length;
    const totalSteps = order.tracking.length;

    return (completedSteps / totalSteps) * 100;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-IQ", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-IQ", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    // Show success message
  };

  return (
    <div className={cn("space-y-6", className)} dir="rtl">
      {!selectedOrder ? (
        <>
          {/* Search and Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">تتبع الطلبات</h2>

              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="رقم الطلب أو اسم المورد..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع الطلبات</option>
                  <option value="pending">في الانتظار</option>
                  <option value="confirmed">مؤكدة</option>
                  <option value="processing">قيد التحضير</option>
                  <option value="shipped">تم الشحن</option>
                  <option value="delivered">تم التسليم</option>
                  <option value="cancelled">ملغية</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  لا توجد طلبات
                </h3>
                <p className="text-gray-600">لم تقم بأي طلبات بعد</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {order.orderNumber}
                        </h3>
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-sm border flex items-center gap-1",
                            getStatusColor(order.status),
                          )}
                        >
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.supplier.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        تاريخ الطلب: {formatDate(order.placedDate)}
                      </p>
                    </div>

                    <div className="text-left">
                      <div className="font-bold text-lg text-purple-600 mb-1">
                        {formatCurrency(order.total)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.items.length} منتج
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>حالة الطلب</span>
                      <span>{Math.round(getProgressPercentage(order))}%</span>
                    </div>
                    <ProgressBar
                      progress={getProgressPercentage(order)}
                      color={order.status === "delivered" ? "green" : "blue"}
                      showPercentage={false}
                    />
                  </div>

                  {/* Items Preview */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <img
                          key={index}
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg border-2 border-white object-cover"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-8 h-8 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      {order.items[0].name}
                      {order.items.length > 1 &&
                        ` و ${order.items.length - 1} منتج آخر`}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>
                        التسليم المتوقع: {formatDate(order.estimatedDelivery)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyOrderNumber(order.orderNumber);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                        <Eye className="w-4 h-4" />
                        عرض التفاصيل
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        /* Order Details */
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-3"
                >
                  <ArrowRight className="w-4 h-4" />
                  العودة للطلبات
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedOrder.orderNumber}
                  </h2>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-sm border flex items-center gap-1",
                      getStatusColor(selectedOrder.status),
                    )}
                  >
                    {getStatusIcon(selectedOrder.status)}
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                <p className="text-gray-600">
                  تاريخ الطلب: {formatDate(selectedOrder.placedDate)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyOrderNumber(selectedOrder.orderNumber)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>تقدم الطلب</span>
                <span>{Math.round(getProgressPercentage(selectedOrder))}%</span>
              </div>
              <ProgressBar
                progress={getProgressPercentage(selectedOrder)}
                color={selectedOrder.status === "delivered" ? "green" : "blue"}
                showPercentage={false}
              />
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-6">تتبع الطلب</h3>

            <div className="space-y-6">
              {selectedOrder.tracking?.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full border-2 flex items-center justify-center",
                        step.isCompleted
                          ? "border-green-500 bg-green-500 text-white"
                          : index ===
                              selectedOrder.tracking?.findIndex(
                                (s) => !s.isCompleted,
                              )
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-gray-300 bg-white text-gray-400",
                      )}
                    >
                      {step.isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    {index < (selectedOrder.tracking?.length || 0) - 1 && (
                      <div
                        className={cn(
                          "w-0.5 h-12 mt-2",
                          step.isCompleted ? "bg-green-500" : "bg-gray-300",
                        )}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4
                      className={cn(
                        "font-medium mb-1",
                        step.isCompleted ? "text-gray-900" : "text-gray-600",
                      )}
                    >
                      {step.description}
                    </h4>
                    {step.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <MapPin className="w-3 h-3" />
                        <span>{step.location}</span>
                      </div>
                    )}
                    {step.timestamp && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(step.timestamp)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">منتجات الطلب</h3>

            <div className="space-y-4">
              {selectedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>الكمية: {item.quantity}</span>
                      <span>السعر: {formatCurrency(item.price)}</span>
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="font-bold text-purple-600">
                      {formatCurrency(item.total)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary & Shipping */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">ملخص الطلب</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span className="font-medium">
                    {formatCurrency(selectedOrder.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">رسوم الشحن</span>
                  <span className="font-medium">
                    {formatCurrency(selectedOrder.shippingCost)}
                  </span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>الخصم</span>
                    <span>-{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>الإجمالي</span>
                    <span className="text-purple-600">
                      {formatCurrency(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">طريقة الدفع</h4>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {selectedOrder.paymentMethod}
                  </span>
                </div>
                <div className="mt-2">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs",
                      selectedOrder.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : selectedOrder.paymentStatus === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700",
                    )}
                  >
                    {selectedOrder.paymentStatus === "paid" && "مدفوع"}
                    {selectedOrder.paymentStatus === "pending" && "في الانتظار"}
                    {selectedOrder.paymentStatus === "failed" && "فشل الدفع"}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                معلومات الشحن
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    عنوان التسليم
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{selectedOrder.shippingAddress.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{selectedOrder.shippingAddress.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <div>
                        <div>
                          {selectedOrder.shippingAddress.governorate}،{" "}
                          {selectedOrder.shippingAddress.city}
                        </div>
                        <div>{selectedOrder.shippingAddress.address}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">المورد</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">
                        {selectedOrder.supplier.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {selectedOrder.supplier.phone}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">
                        {selectedOrder.supplier.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      التسليم المتوقع:{" "}
                      {formatDate(selectedOrder.estimatedDelivery)}
                    </span>
                  </div>
                  {selectedOrder.actualDelivery && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        تم التسليم: {formatDate(selectedOrder.actualDelivery)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-wrap gap-4">
              {selectedOrder.status !== "delivered" &&
                selectedOrder.status !== "cancelled" && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                    <X className="w-4 h-4" />
                    إلغاء الطلب
                  </button>
                )}

              <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                <MessageSquare className="w-4 h-4" />
                تواصل مع المورد
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
                تحميل الفاتورة
              </button>

              {selectedOrder.status === "delivered" && (
                <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                  <Star className="w-4 h-4" />
                  تقييم الطلب
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTracking;
