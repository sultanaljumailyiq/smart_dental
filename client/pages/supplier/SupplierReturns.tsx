import React, { useState } from "react";
import {
  RotateCcw,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  RefreshCcw,
  Package,
  DollarSign,
  Calendar,
  User,
  MessageSquare,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import SupplierHeader from "@/components/supplier/SupplierHeader";

interface Return {
  id: string;
  returnNumber: string;
  orderNumber: string;
  customer: string;
  productName: string;
  quantity: number;
  refundAmount: number;
  reason: string;
  reasonArabic: string;
  status: "pending" | "approved" | "rejected" | "refunded" | "completed";
  date: string;
  description?: string;
  images?: string[];
}

export default function SupplierReturns() {
  const [returns, setReturns] = useState<Return[]>([
    {
      id: "1",
      returnNumber: "RET-2024-001",
      orderNumber: "ORD-2024-0012",
      customer: "عيادة الابتسامة الذهبية",
      productName: "مادة حشو الأسنان - Composite",
      quantity: 2,
      refundAmount: 170000,
      reason: "defective",
      reasonArabic: "معيب",
      status: "pending",
      date: "2024-10-10",
      description: "المنتج وصل معيب ومكسور",
    },
    {
      id: "2",
      returnNumber: "RET-2024-002",
      orderNumber: "ORD-2024-0011",
      customer: "د. أحمد محمد",
      productName: "قفازات طبية (علبة 100)",
      quantity: 1,
      refundAmount: 45000,
      reason: "wrong_item",
      reasonArabic: "منتج خاطئ",
      status: "approved",
      date: "2024-10-09",
      description: "استلمت منتج مختلف عن المطلوب",
    },
    {
      id: "3",
      returnNumber: "RET-2024-003",
      orderNumber: "ORD-2024-0010",
      customer: "مركز بغداد للأسنان",
      productName: "جهاز تبييض الأسنان",
      quantity: 1,
      refundAmount: 2500000,
      reason: "not_as_described",
      reasonArabic: "غير مطابق للوصف",
      status: "rejected",
      date: "2024-10-08",
      description: "الجهاز لا يتطابق مع المواصفات",
    },
  ]);

  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: "approve" | "reject" | null;
    returnId: string | null;
  }>({ open: false, type: null, returnId: null });

  const getStatusBadge = (status: Return["status"]) => {
    const statusConfig = {
      pending: { label: "قيد الانتظار", className: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: Clock },
      approved: { label: "موافق عليه", className: "bg-blue-100 text-blue-800 border-blue-300", icon: CheckCircle },
      rejected: { label: "مرفوض", className: "bg-red-100 text-red-800 border-red-300", icon: XCircle },
      refunded: { label: "تم الاسترجاع", className: "bg-purple-100 text-purple-800 border-purple-300", icon: DollarSign },
      completed: { label: "مكتمل", className: "bg-green-100 text-green-800 border-green-300", icon: CheckCircle },
    };
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge className={cn(config.className, "border flex items-center gap-1")}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getReasonBadge = (reason: string) => {
    const reasonConfig: Record<string, { label: string; className: string }> = {
      defective: { label: "معيب", className: "bg-red-50 text-red-700 border-red-200" },
      wrong_item: { label: "منتج خاطئ", className: "bg-orange-50 text-orange-700 border-orange-200" },
      not_as_described: { label: "غير مطابق", className: "bg-purple-50 text-purple-700 border-purple-200" },
      changed_mind: { label: "تغيير رأي", className: "bg-blue-50 text-blue-700 border-blue-200" },
    };
    const config = reasonConfig[reason] || { label: reason, className: "bg-gray-50 text-gray-700 border-gray-200" };
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const handleAction = (type: "approve" | "reject", returnId: string) => {
    setActionDialog({ open: true, type, returnId });
  };

  const confirmAction = () => {
    if (!actionDialog.returnId || !actionDialog.type) return;

    setReturns(returns.map(ret => {
      if (ret.id === actionDialog.returnId) {
        return {
          ...ret,
          status: actionDialog.type === "approve" ? "approved" : "rejected"
        };
      }
      return ret;
    }));

    setActionDialog({ open: false, type: null, returnId: null });
  };

  const filteredReturns = returns.filter(ret => {
    const matchesStatus = filterStatus === "all" || ret.status === filterStatus;
    const matchesSearch = ret.returnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ret.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ret.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    pending: returns.filter(r => r.status === "pending").length,
    approved: returns.filter(r => r.status === "approved").length,
    rejected: returns.filter(r => r.status === "rejected").length,
    total: returns.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      <SupplierHeader />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">قيد الانتظار</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">موافق عليها</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">مرفوضة</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي المرتجعات</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="بحث برقم الإرجاع، العميل، أو المنتج..."
                    className="pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="pending">قيد الانتظار</SelectItem>
                    <SelectItem value="approved">موافق عليها</SelectItem>
                    <SelectItem value="rejected">مرفوضة</SelectItem>
                    <SelectItem value="refunded">تم الاسترجاع</SelectItem>
                    <SelectItem value="completed">مكتملة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Returns List */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {filteredReturns.length === 0 ? (
                <div className="p-12 text-center">
                  <RotateCcw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">لا توجد مرتجعات</p>
                </div>
              ) : (
                filteredReturns.map((ret) => (
                  <div key={ret.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-sm font-bold text-gray-900">{ret.returnNumber}</span>
                          {getStatusBadge(ret.status)}
                          {getReasonBadge(ret.reason)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900 font-medium">{ret.productName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{ret.customer}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900 font-semibold">{ret.refundAmount.toLocaleString("ar-IQ")} IQD</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{ret.date}</span>
                          </div>
                        </div>

                        {ret.description && (
                          <div className="flex items-start gap-2 text-sm bg-gray-50 p-2 rounded">
                            <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                            <span className="text-gray-600">{ret.description}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedReturn(ret);
                            setDetailsOpen(true);
                          }}
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          التفاصيل
                        </Button>
                        {ret.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              className="gap-2 bg-green-600 hover:bg-green-700"
                              onClick={() => handleAction("approve", ret.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                              قبول
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="gap-2"
                              onClick={() => handleAction("reject", ret.id)}
                            >
                              <XCircle className="w-4 h-4" />
                              رفض
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === "approve" ? "تأكيد قبول الإرجاع" : "تأكيد رفض الإرجاع"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === "approve"
                ? "هل أنت متأكد من قبول طلب الإرجاع؟ سيتم استرجاع المبلغ للعميل."
                : "هل أنت متأكد من رفض طلب الإرجاع؟ يجب إضافة سبب الرفض."}
            </DialogDescription>
          </DialogHeader>
          {actionDialog.type === "reject" && (
            <Textarea placeholder="سبب الرفض..." className="min-h-[100px]" />
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setActionDialog({ open: false, type: null, returnId: null })}>
              إلغاء
            </Button>
            <Button
              variant={actionDialog.type === "approve" ? "default" : "destructive"}
              onClick={confirmAction}
            >
              {actionDialog.type === "approve" ? "قبول" : "رفض"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
