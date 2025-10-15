import { useNavigate, useParams } from "react-router-dom";
import { Package, MapPin, Phone, ChevronLeft, Truck, CheckCircle, Clock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import OrderTrackingTimeline from "@/components/OrderTrackingTimeline";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  deliveryDate?: string;
  trackingNumber?: string;
  trackingStatus: "ordered" | "warehouse" | "shipping_company" | "in_transit" | "delivered";
  warehouseDate?: string;
  shippingCompanyDate?: string;
  transitDate?: string;
  deliveredDate?: string;
}

const mockOrders: { [key: string]: Order } = {
  "1": {
    id: "1",
    orderNumber: "ORD-2024-001",
    date: "2024-10-08",
    status: "shipping",
    total: 385000,
    items: [
      {
        id: "1",
        name: "راتنج مركب برو 2",
        image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400",
        quantity: 2,
        price: 192500,
      },
    ],
    shippingAddress: "بغداد، الكرادة، شارع 62، بناية 15",
    customerName: "د. أحمد العراقي",
    customerPhone: "07701234567",
    paymentMethod: "الدفع عند الاستلام",
    trackingNumber: "TRK-2024-001234",
    deliveryDate: "2024-10-10",
    trackingStatus: "in_transit",
    warehouseDate: "2024-10-08",
    shippingCompanyDate: "2024-10-09",
    transitDate: "2024-10-09",
  },
  "2": {
    id: "2",
    orderNumber: "ORD-2024-002",
    date: "2024-10-05",
    status: "delivered",
    total: 156000,
    items: [
      {
        id: "2",
        name: "طقم كومبوت جراحي",
        image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400",
        quantity: 1,
        price: 156000,
      },
    ],
    shippingAddress: "أربيل، شارع 100",
    customerName: "د. فاطمة حسن",
    customerPhone: "07809876543",
    paymentMethod: "زين كاش",
    deliveryDate: "2024-10-07",
    trackingStatus: "delivered",
    warehouseDate: "2024-10-05",
    shippingCompanyDate: "2024-10-06",
    transitDate: "2024-10-06",
    deliveredDate: "2024-10-07",
  },
  "3": {
    id: "3",
    orderNumber: "ORD-2024-003",
    date: "2024-09-28",
    status: "cancelled",
    total: 89000,
    items: [
      {
        id: "3",
        name: "طقم خلاصرات عدنية",
        image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400",
        quantity: 3,
        price: 29666,
      },
    ],
    shippingAddress: "البصرة، العشار",
    customerName: "د. علي حسين",
    customerPhone: "07601112233",
    paymentMethod: "الدفع عند الاستلام",
    trackingStatus: "ordered",
  },
  "4": {
    id: "4",
    orderNumber: "ORD-2024-004",
    date: "2024-09-20",
    status: "confirmed",
    total: 450000,
    items: [
      {
        id: "4",
        name: "زرعة أسنان تيتانيوم",
        image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400",
        quantity: 1,
        price: 450000,
      },
    ],
    shippingAddress: "الموصل، الحدباء",
    customerName: "د. سارة محمد",
    customerPhone: "07509998877",
    paymentMethod: "تحويل بنكي",
    trackingStatus: "warehouse",
    warehouseDate: "2024-09-21",
  },
};

const statusConfig = {
  pending: {
    label: "قيد الانتظار",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  confirmed: {
    label: "تم التأكيد",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle,
  },
  shipping: {
    label: "قيد التوصيل",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Truck,
  },
  delivered: {
    label: "تم التوصيل",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "ملغي",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: Clock,
  },
};

export default function DentalSupplyOrderDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  
  const order = orderId ? mockOrders[orderId] : null;

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4" dir="rtl">
        <Card className="p-8 text-center max-w-md">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">لم يتم العثور على الطلب</h2>
          <p className="text-gray-500 mb-6">الطلب المطلوب غير موجود أو تم حذفه</p>
          <Button
            onClick={() => navigate("/dental-supply/orders")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            العودة إلى الطلبات
          </Button>
        </Card>
      </div>
    );
  }

  const StatusIcon = statusConfig[order.status].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/dental-supply/orders")}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
              <p className="text-white/90 text-sm">
                {new Date(order.date).toLocaleDateString("ar-IQ", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Badge variant="outline" className={`${statusConfig[order.status].color} border-2`}>
              <StatusIcon className="w-4 h-4 ml-1" />
              {statusConfig[order.status].label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-4 space-y-4">
        {/* Order Tracking Timeline */}
        {order.status !== "cancelled" && (
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-purple-600" />
              تتبع الطلب
            </h3>
            <OrderTrackingTimeline
              currentStatus={order.trackingStatus}
              orderDate={order.date}
              warehouseDate={order.warehouseDate}
              shippingDate={order.shippingCompanyDate}
              transitDate={order.transitDate}
              deliveredDate={order.deliveredDate}
            />
            {order.trackingNumber && (
              <div className="mt-4 bg-white/60 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">رقم التتبع</p>
                <p className="font-mono font-bold text-purple-600">{order.trackingNumber}</p>
              </div>
            )}
            {order.deliveryDate && order.trackingStatus !== "delivered" && (
              <div className="mt-4 bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  <strong>التوصيل المتوقع:</strong>{" "}
                  {new Date(order.deliveryDate).toLocaleDateString("ar-IQ", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Order Items */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600" />
            المنتجات ({order.items.length})
          </h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">الكمية: {item.quantity}</p>
                  <p className="text-lg font-bold text-purple-600">
                    {item.price.toLocaleString("ar-IQ")} د.ع
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Delivery Information */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            معلومات التوصيل
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">العنوان</p>
              <p className="text-gray-900 font-medium">{order.shippingAddress}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-500 mb-1">الاسم</p>
              <p className="text-gray-900 font-medium">{order.customerName}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-500 mb-1">رقم الهاتف</p>
              <p className="text-gray-900 font-medium direction-ltr text-right">{order.customerPhone}</p>
            </div>
          </div>
        </Card>

        {/* Payment Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">ملخص الدفع</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">طريقة الدفع</span>
              <span className="font-medium text-gray-900">{order.paymentMethod}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-gray-600">المجموع الفرعي</span>
              <span className="font-medium text-gray-900">
                {order.total.toLocaleString("ar-IQ")} د.ع
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">التوصيل</span>
              <span className="font-medium text-green-600">مجاني</span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between items-center bg-purple-50 p-4 rounded-lg">
              <span className="text-lg font-bold text-gray-900">الإجمالي</span>
              <span className="text-2xl font-bold text-purple-600">
                {order.total.toLocaleString("ar-IQ")} د.ع
              </span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {order.trackingStatus === "delivered" && (
            <Button
              onClick={() => navigate(`/dental-supply/return/${order.id}`)}
              variant="outline"
              className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              <RotateCcw className="w-4 h-4 ml-2" />
              طلب إرجاع المنتج
            </Button>
          )}
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/dental-supply/orders")}
              variant="outline"
              className="flex-1"
            >
              العودة إلى الطلبات
            </Button>
            <Button
              onClick={() => navigate(`/dental-supply/support?order=${order.orderNumber}`)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Phone className="w-4 h-4 ml-2" />
              الدعم الفني
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
