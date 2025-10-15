import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Package, TrendingUp, AlertCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import SupplierHeader from "@/components/supplier/SupplierHeader";
import { useAuth } from "@/contexts/AuthContext";

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  total: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  subtotal: string;
  commissionRate: string;
  commissionAmount: string;
}

export default function SupplierOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: "0",
    totalCommission: "0",
    netRevenue: "0",
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSupplierId = async () => {
      if (!user?.id) return;
      
      try {
        const res = await fetch(`/api/users/${user.id}/supplier-id`);
        if (res.ok) {
          const data = await res.json();
          setSupplierId(data.supplierId);
        } else {
          console.error("Failed to fetch supplier ID");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching supplier ID:", error);
        setLoading(false);
      }
    };

    fetchSupplierId();
  }, [user?.id]);

  useEffect(() => {
    if (supplierId === null) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/suppliers/${supplierId}/orders`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
          
          // Calculate stats
          let totalRev = 0;
          let totalComm = 0;
          
          data.orders?.forEach((order: Order) => {
            order.items?.forEach((item: OrderItem) => {
              totalRev += parseFloat(item.subtotal);
              totalComm += parseFloat(item.commissionAmount || "0");
            });
          });
          
          setStats({
            totalRevenue: totalRev.toFixed(2),
            totalCommission: totalComm.toFixed(2),
            netRevenue: (totalRev - totalComm).toFixed(2),
          });
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [supplierId]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: "قيد الانتظار", className: "bg-yellow-100 text-yellow-800" },
      confirmed: { label: "مؤكد", className: "bg-blue-100 text-blue-800" },
      processing: { label: "قيد المعالجة", className: "bg-purple-100 text-purple-800" },
      shipped: { label: "تم الشحن", className: "bg-indigo-100 text-indigo-800" },
      delivered: { label: "تم التسليم", className: "bg-green-100 text-green-800" },
      cancelled: { label: "ملغي", className: "bg-red-100 text-red-800" },
    };

    return statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" };
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6" dir="rtl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <SupplierHeader />
      <div className="p-4 lg:p-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900">إجمالي الإيرادات</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{parseFloat(stats.totalRevenue).toLocaleString("ar-IQ")} IQD</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900">عمولة المنصة</h3>
          </div>
          <p className="text-3xl font-bold text-amber-600">{parseFloat(stats.totalCommission).toLocaleString("ar-IQ")} IQD</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">صافي الأرباح</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{parseFloat(stats.netRevenue).toLocaleString("ar-IQ")} IQD</p>
        </div>
      </div>

      {/* Commission Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-blue-900 mb-1">معلومات العمولة</h4>
          <p className="text-sm text-blue-700">
            يتم خصم نسبة عمولة المنصة من كل طلب. العمولة الافتراضية 10% ويمكن أن تختلف حسب اتفاقك مع المنصة.
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600">
          <div className="col-span-2">رقم الطلب</div>
          <div className="col-span-2">العميل</div>
          <div className="col-span-2">الإجمالي</div>
          <div className="col-span-2">العمولة</div>
          <div className="col-span-2">الصافي</div>
          <div className="col-span-1">الحالة</div>
          <div className="col-span-1 text-left">عرض</div>
        </div>
        
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>لا توجد طلبات حتى الآن</p>
          </div>
        ) : (
          <div className="divide-y">
            {orders.map((order) => {
              const orderCommission = order.items?.reduce((sum, item) => 
                sum + parseFloat(item.commissionAmount || "0"), 0) || 0;
              const orderNet = parseFloat(order.total) - orderCommission;
              const status = getStatusBadge(order.status);

              return (
                <div
                  key={order.id}
                  className="grid grid-cols-12 px-4 py-3 items-center text-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-2 font-medium text-gray-900">
                    {order.orderNumber}
                  </div>
                  <div className="col-span-2 text-gray-700">{order.customerName || "عميل"}</div>
                  <div className="col-span-2 font-semibold text-gray-900">
                    {parseFloat(order.total).toLocaleString("ar-IQ")} IQD
                  </div>
                  <div className="col-span-2 text-amber-600 font-medium">
                    -{orderCommission.toLocaleString("ar-IQ")} IQD
                  </div>
                  <div className="col-span-2 text-emerald-600 font-semibold">
                    {orderNet.toLocaleString("ar-IQ")} IQD
                  </div>
                  <div className="col-span-1">
                    <Badge className={status.className}>
                      {status.label}
                    </Badge>
                  </div>
                  <div className="col-span-1 text-left">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">تفاصيل الطلب {selectedOrder.orderNumber}</h3>
            <div className="space-y-3">
              {selectedOrder.items?.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{item.productName}</h4>
                    <span className="text-sm text-gray-600">الكمية: {item.quantity}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">الإجمالي</p>
                      <p className="font-semibold">{parseFloat(item.subtotal).toLocaleString("ar-IQ")} IQD</p>
                    </div>
                    <div>
                      <p className="text-gray-600">العمولة ({item.commissionRate}%)</p>
                      <p className="font-semibold text-amber-600">-{parseFloat(item.commissionAmount).toLocaleString("ar-IQ")} IQD</p>
                    </div>
                    <div>
                      <p className="text-gray-600">الصافي</p>
                      <p className="font-semibold text-emerald-600">
                        {(parseFloat(item.subtotal) - parseFloat(item.commissionAmount)).toLocaleString("ar-IQ")} IQD
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
