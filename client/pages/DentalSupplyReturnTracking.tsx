import { useNavigate, useParams } from "react-router-dom";
import { Package, ChevronLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ReturnTrackingTimeline from "@/components/ReturnTrackingTimeline";

interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  returnNumber: string;
  requestDate: string;
  status: "requested" | "approved" | "picked_up" | "inspected" | "refunded";
  productName: string;
  productImage: string;
  quantity: number;
  refundAmount: number;
  returnReason: string;
  approvedDate?: string;
  pickedUpDate?: string;
  inspectedDate?: string;
  refundedDate?: string;
  supplierNotes?: string;
}

const mockReturns: { [key: string]: ReturnRequest } = {
  "1": {
    id: "1",
    orderId: "2",
    orderNumber: "ORD-2024-002",
    returnNumber: "RET-2024-001",
    requestDate: "2024-10-09",
    status: "inspected",
    productName: "طقم كومبوت جراحي",
    productImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400",
    quantity: 1,
    refundAmount: 156000,
    returnReason: "المنتج لا يطابق المواصفات المذكورة في الوصف",
    approvedDate: "2024-10-09",
    pickedUpDate: "2024-10-10",
    inspectedDate: "2024-10-11",
    supplierNotes: "تم فحص المنتج وتأكيد سلامته. سيتم الإرجاع خلال 3-5 أيام عمل.",
  },
  "2": {
    id: "2",
    orderId: "1",
    orderNumber: "ORD-2024-001",
    returnNumber: "RET-2024-002",
    requestDate: "2024-10-08",
    status: "approved",
    productName: "راتنج مركب برو 2",
    productImage: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400",
    quantity: 1,
    refundAmount: 192500,
    returnReason: "العبوة تالفة عند الاستلام",
    approvedDate: "2024-10-08",
  },
};

const statusConfig = {
  requested: {
    label: "قيد المراجعة",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  approved: {
    label: "تمت الموافقة",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  picked_up: {
    label: "تم الاستلام",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  inspected: {
    label: "تم الفحص",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  refunded: {
    label: "تم الإرجاع",
    color: "bg-green-100 text-green-800 border-green-200",
  },
};

export default function DentalSupplyReturnTracking() {
  const navigate = useNavigate();
  const { returnId } = useParams<{ returnId: string }>();
  
  const returnRequest = returnId ? mockReturns[returnId] : null;

  if (!returnRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4" dir="rtl">
        <Card className="p-8 text-center max-w-md">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">لم يتم العثور على طلب الإرجاع</h2>
          <p className="text-gray-500 mb-6">طلب الإرجاع المطلوب غير موجود أو تم حذفه</p>
          <Button
            onClick={() => navigate("/dental-supply/orders")}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            العودة إلى الطلبات
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 to-red-600 text-white p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate(`/dental-supply/order/${returnRequest.orderId}`)}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{returnRequest.returnNumber}</h1>
              <p className="text-white/90 text-sm">
                طلب الإرجاع - {returnRequest.orderNumber}
              </p>
            </div>
            <Badge variant="outline" className={`${statusConfig[returnRequest.status].color} border-2`}>
              {statusConfig[returnRequest.status].label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-4 space-y-4">
        {/* Return Tracking Timeline */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-600" />
            تتبع الإرجاع
          </h3>
          <ReturnTrackingTimeline
            currentStatus={returnRequest.status}
            requestDate={returnRequest.requestDate}
            approvedDate={returnRequest.approvedDate}
            pickedUpDate={returnRequest.pickedUpDate}
            inspectedDate={returnRequest.inspectedDate}
            refundedDate={returnRequest.refundedDate}
            returnReason={returnRequest.returnReason}
          />
        </Card>

        {/* Product Info */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-600" />
            معلومات المنتج
          </h3>
          <div className="flex gap-4">
            <img
              src={returnRequest.productImage}
              alt={returnRequest.productName}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">{returnRequest.productName}</h4>
              <p className="text-sm text-gray-500 mb-2">الكمية: {returnRequest.quantity}</p>
              <p className="text-lg font-bold text-orange-600">
                {returnRequest.refundAmount.toLocaleString("ar-IQ")} د.ع
              </p>
            </div>
          </div>
        </Card>

        {/* Return Details */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">تفاصيل الإرجاع</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">رقم طلب الإرجاع</p>
              <p className="text-gray-900 font-medium">{returnRequest.returnNumber}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-500 mb-1">تاريخ الطلب</p>
              <p className="text-gray-900 font-medium">
                {new Date(returnRequest.requestDate).toLocaleDateString("ar-IQ", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-500 mb-1">سبب الإرجاع</p>
              <p className="text-gray-900 font-medium">{returnRequest.returnReason}</p>
            </div>
            {returnRequest.supplierNotes && (
              <>
                <Separator />
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-blue-800 mb-1">ملاحظات المورد</p>
                  <p className="text-sm text-blue-700">{returnRequest.supplierNotes}</p>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Refund Info */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات الاسترجاع</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">المبلغ المسترجع</span>
              <span className="font-bold text-orange-600">
                {returnRequest.refundAmount.toLocaleString("ar-IQ")} د.ع
              </span>
            </div>
            {returnRequest.status === "refunded" && returnRequest.refundedDate && (
              <>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">تاريخ الاسترجاع</span>
                  <span className="font-medium text-gray-900">
                    {new Date(returnRequest.refundedDate).toLocaleDateString("ar-IQ")}
                  </span>
                </div>
              </>
            )}
            {["inspected", "refunded"].includes(returnRequest.status) && !returnRequest.refundedDate && (
              <div className="bg-yellow-50 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  سيتم إرجاع المبلغ إلى حسابك خلال 3-5 أيام عمل
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => navigate(`/dental-supply/order/${returnRequest.orderId}`)}
            variant="outline"
            className="flex-1"
          >
            عرض الطلب الأصلي
          </Button>
          <Button
            onClick={() => navigate("/dental-supply/orders")}
            className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            العودة إلى الطلبات
          </Button>
        </div>
      </div>
    </div>
  );
}
