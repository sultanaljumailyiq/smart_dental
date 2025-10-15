import React, { useState, useEffect } from "react";
import { 
  CheckCircle, XCircle, Eye, Calendar, CreditCard, User, DollarSign, FileText,
  Image as ImageIcon, Phone, Clock, MessageSquare, AlertCircle, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { notificationsService } from "@/services/notificationsService";

interface SubscriptionRequest {
  id: number;
  paymentNumber: string;
  clinicId: number;
  clinicName: string;
  userId: number;
  userName: string;
  userEmail: string;
  subscriptionType: string;
  amount: number;
  duration: number;
  paymentMethod: string;
  senderName?: string;
  zainCashPhoneNumber?: string;
  zainCashTransactionRef?: string;
  exchangeOfficeName?: string;
  depositReceiptNumber?: string;
  status: string;
  attachments: string[];
  createdAt: string;
}

export default function SubscriptionRequests() {
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<SubscriptionRequest | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/subscription-requests");
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        // Fallback data for testing
        setRequests([
          {
            id: 1,
            paymentNumber: "SUB-2025-001",
            clinicId: 1,
            clinicName: "عيادة النور لطب الأسنان",
            userId: 1,
            userName: "د. أحمد محمد",
            userEmail: "ahmad@clinic.com",
            subscriptionType: "premium",
            amount: 240000,
            duration: 6,
            paymentMethod: "zain_cash",
            senderName: "أحمد محمد علي",
            zainCashPhoneNumber: "07801234567",
            zainCashTransactionRef: "ZC-2025-12345",
            status: "pending_verification",
            attachments: [],
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            paymentNumber: "SUB-2025-002",
            clinicId: 2,
            clinicName: "مجمع الأمل الطبي",
            userId: 2,
            userName: "د. فاطمة حسن",
            userEmail: "fatima@clinic.com",
            subscriptionType: "basic",
            amount: 50000,
            duration: 1,
            paymentMethod: "bank_transfer",
            senderName: "فاطمة حسن",
            status: "pending_verification",
            attachments: [],
            createdAt: new Date(Date.now() - 3600000).toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error("Error loading requests:", error);
      // Use fallback data
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/subscription-requests/${requestId}/approve`, {
        method: "POST"
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add notification for the doctor
        if (data.notification) {
          notificationsService.addNotification({
            type: data.notification.type,
            title: data.notification.title,
            message: data.notification.message,
            category: data.notification.category,
            actionUrl: data.notification.actionUrl,
            sourceSection: "subscription",
            priority: "high"
          });
        }
        
        toast.success("تمت الموافقة على الطلب وتفعيل الاشتراك!");
        loadRequests();
        setShowDetailsDialog(false);
      } else {
        toast.error("فشلت الموافقة على الطلب");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الموافقة");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      toast.error("الرجاء إدخال سبب الرفض");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/subscription-requests/${selectedRequest.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add rejection notification for the doctor
        if (data.notification) {
          notificationsService.addNotification({
            type: data.notification.type,
            title: data.notification.title,
            message: data.notification.message,
            category: data.notification.category,
            actionUrl: data.notification.actionUrl,
            sourceSection: "subscription",
            priority: "high"
          });
        }
        
        toast.success("تم رفض الطلب وإرسال إشعار للطبيب");
        loadRequests();
        setShowRejectionDialog(false);
        setShowDetailsDialog(false);
        setRejectionReason("");
      } else {
        toast.error("فشل رفض الطلب");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الرفض");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      zain_cash: "زين كاش",
      bank_transfer: "تحويل بنكي",
      cash: "نقداً",
      stripe: "بطاقة ائتمانية"
    };
    return methods[method] || method;
  };

  const getSubscriptionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      basic: "الباقة الأساسية",
      premium: "الباقة المميزة",
      gold: "الباقة الذهبية",
      monthly: "الباقة الشهرية"
    };
    return types[type] || type;
  };

  const filteredRequests = requests.filter(req => {
    if (filter === "all") return true;
    if (filter === "pending") return req.status === "pending_verification";
    if (filter === "verified") return req.status === "verified";
    if (filter === "rejected") return req.status === "rejected";
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-6 px-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">طلبات الاشتراكات</h1>
          <p className="text-gray-600">إدارة طلبات الاشتراكات ومراجعة المدفوعات</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex gap-3">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-purple-600" : ""}
            >
              الكل ({requests.length})
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              onClick={() => setFilter("pending")}
              className={filter === "pending" ? "bg-orange-600" : ""}
            >
              قيد المراجعة ({requests.filter(r => r.status === "pending_verification").length})
            </Button>
            <Button
              variant={filter === "verified" ? "default" : "outline"}
              onClick={() => setFilter("verified")}
              className={filter === "verified" ? "bg-green-600" : ""}
            >
              مقبولة ({requests.filter(r => r.status === "verified").length})
            </Button>
            <Button
              variant={filter === "rejected" ? "default" : "outline"}
              onClick={() => setFilter("rejected")}
              className={filter === "rejected" ? "bg-red-600" : ""}
            >
              مرفوضة ({requests.filter(r => r.status === "rejected").length})
            </Button>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">لا توجد طلبات اشتراك</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{request.clinicName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === "pending_verification" ? "bg-orange-100 text-orange-700" :
                        request.status === "verified" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {request.status === "pending_verification" ? "قيد المراجعة" :
                         request.status === "verified" ? "مقبول" : "مرفوض"}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{request.userName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CreditCard className="w-4 h-4" />
                        <span>{getSubscriptionTypeLabel(request.subscriptionType)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{(request.amount / 1000).toLocaleString('ar-EG')} ألف د.ع</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Building2 className="w-4 h-4" />
                        <span>{getPaymentMethodLabel(request.paymentMethod)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>المدة: {request.duration} {request.duration === 1 ? "شهر" : "أشهر"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(request.createdAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowDetailsDialog(true);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>تفاصيل طلب الاشتراك</DialogTitle>
            </DialogHeader>

            {selectedRequest && (
              <div className="space-y-6">
                {/* Clinic & User Info */}
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-900 mb-3">معلومات العيادة والطبيب</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-purple-700 mb-1">اسم العيادة</p>
                      <p className="font-semibold text-purple-900">{selectedRequest.clinicName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-700 mb-1">اسم الطبيب</p>
                      <p className="font-semibold text-purple-900">{selectedRequest.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-700 mb-1">البريد الإلكتروني</p>
                      <p className="font-semibold text-purple-900 font-mono">{selectedRequest.userEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-700 mb-1">رقم الطلب</p>
                      <p className="font-semibold text-purple-900 font-mono">{selectedRequest.paymentNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Subscription Info */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">معلومات الاشتراك</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-blue-700 mb-1">نوع الباقة</p>
                      <p className="font-semibold text-blue-900">{getSubscriptionTypeLabel(selectedRequest.subscriptionType)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 mb-1">المدة</p>
                      <p className="font-semibold text-blue-900">{selectedRequest.duration} {selectedRequest.duration === 1 ? "شهر" : "أشهر"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 mb-1">المبلغ الإجمالي</p>
                      <p className="font-semibold text-blue-900">{(selectedRequest.amount / 1000).toLocaleString('ar-EG')} ألف د.ع</p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-semibold text-green-900 mb-3">معلومات الدفع</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-green-700 mb-1">طريقة الدفع</p>
                      <p className="font-semibold text-green-900">{getPaymentMethodLabel(selectedRequest.paymentMethod)}</p>
                    </div>
                    
                    {selectedRequest.senderName && (
                      <div>
                        <p className="text-sm text-green-700 mb-1">اسم الراسل</p>
                        <p className="font-semibold text-green-900">{selectedRequest.senderName}</p>
                      </div>
                    )}

                    {selectedRequest.zainCashTransactionRef && (
                      <div>
                        <p className="text-sm text-green-700 mb-1">رقم التحويل</p>
                        <p className="font-semibold text-green-900 font-mono">{selectedRequest.zainCashTransactionRef}</p>
                      </div>
                    )}

                    {selectedRequest.zainCashPhoneNumber && (
                      <div>
                        <p className="text-sm text-green-700 mb-1">رقم هاتف زين كاش</p>
                        <p className="font-semibold text-green-900 font-mono direction-ltr text-right">{selectedRequest.zainCashPhoneNumber}</p>
                      </div>
                    )}

                    {selectedRequest.exchangeOfficeName && (
                      <div>
                        <p className="text-sm text-green-700 mb-1">مكتب الصرافة</p>
                        <p className="font-semibold text-green-900">{selectedRequest.exchangeOfficeName}</p>
                      </div>
                    )}

                    {selectedRequest.depositReceiptNumber && (
                      <div>
                        <p className="text-sm text-green-700 mb-1">رقم إيصال الإيداع</p>
                        <p className="font-semibold text-green-900 font-mono">{selectedRequest.depositReceiptNumber}</p>
                      </div>
                    )}
                  </div>

                  {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-green-700 mb-2">المرفقات</p>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedRequest.attachments.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Attachment ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-green-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {selectedRequest.status === "pending_verification" && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => handleApprove(selectedRequest.id)}
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 ml-2" />
                      الموافقة وتفعيل الاشتراك
                    </Button>
                    <Button
                      onClick={() => {
                        setShowRejectionDialog(true);
                      }}
                      disabled={loading}
                      variant="outline"
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 ml-2" />
                      رفض الطلب
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Rejection Dialog */}
        <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle>رفض طلب الاشتراك</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  سبب الرفض *
                </label>
                <Input
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="أدخل سبب الرفض لإرساله للطبيب"
                  className="mb-2"
                />
                <p className="text-xs text-gray-500">
                  سيتم إرسال هذا السبب للطبيب عبر الإشعارات والبريد الإلكتروني
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleReject}
                  disabled={loading || !rejectionReason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  تأكيد الرفض
                </Button>
                <Button
                  onClick={() => {
                    setShowRejectionDialog(false);
                    setRejectionReason("");
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
