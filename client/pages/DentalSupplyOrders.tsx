import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Clock, CheckCircle, XCircle, MapPin, ChevronLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
  total: number;
  items: {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: string;
}

const mockOrders: Order[] = [
  {
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
    shippingAddress: "بغداد، الكرادة، شارع 62",
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

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
    icon: Package,
  },
  delivered: {
    label: "تم التوصيل",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "ملغي",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
};

export default function DentalSupplyOrders() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredOrders = activeTab === "all" 
    ? mockOrders 
    : mockOrders.filter(order => order.status === activeTab);

  const getStatusCounts = () => {
    return {
      all: mockOrders.length,
      pending: mockOrders.filter(o => o.status === "pending").length,
      shipping: mockOrders.filter(o => o.status === "shipping").length,
      delivered: mockOrders.filter(o => o.status === "delivered").length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="w-7 h-7" />
              طلباتي
            </h1>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/dental-supply")}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-white/90 text-sm">تتبع وإدارة جميع طلباتك من مكان واحد</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 -mt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-md rounded-xl">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-100">
              الكل ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-100">
              قيد الانتظار ({statusCounts.pending})
            </TabsTrigger>
            <TabsTrigger value="shipping" className="data-[state=active]:bg-purple-100">
              قيد التوصيل ({statusCounts.shipping})
            </TabsTrigger>
            <TabsTrigger value="delivered" className="data-[state=active]:bg-green-100">
              مكتمل ({statusCounts.delivered})
            </TabsTrigger>
          </TabsList>

          {/* Orders List */}
          <div className="mt-6 space-y-4">
            {filteredOrders.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  لا توجد طلبات
                </h3>
                <p className="text-gray-500 mb-6">
                  لم تقم بأي طلبات في هذه الفئة بعد
                </p>
                <Button
                  onClick={() => navigate("/dental-supply/products")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  تصفح المنتجات
                </Button>
              </Card>
            ) : (
              filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                return (
                  <Card
                    key={order.id}
                    className="p-4 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => navigate(`/dental-supply/order/${order.id}`)}
                  >
                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
                          <Badge
                            variant="outline"
                            className={`${statusConfig[order.status].color} border`}
                          >
                            <StatusIcon className="w-3 h-3 ml-1" />
                            {statusConfig[order.status].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString("ar-IQ", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-gray-500">الإجمالي</p>
                        <p className="text-lg font-bold text-purple-600">
                          {order.total.toLocaleString("ar-IQ")} د.ع
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm mb-1">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              الكمية: {item.quantity} × {item.price.toLocaleString("ar-IQ")} د.ع
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
