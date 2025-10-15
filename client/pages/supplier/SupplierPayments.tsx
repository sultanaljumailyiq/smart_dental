import React, { useState } from "react";
import {
  DollarSign,
  Download,
  TrendingUp,
  Wallet,
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  FileText,
  Percent,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import SupplierHeader from "@/components/supplier/SupplierHeader";

interface Payment {
  id: string;
  date: string;
  type: "transfer" | "commission" | "refund";
  amount: number;
  status: "completed" | "pending" | "failed";
  description: string;
  referenceNumber: string;
}

export default function SupplierPayments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "1",
      date: "2024-01-20",
      type: "transfer",
      amount: 5000000,
      status: "completed",
      description: "تحويل أرباح الأسبوع الأول",
      referenceNumber: "TRF-2024-001",
    },
    {
      id: "2",
      date: "2024-01-19",
      type: "commission",
      amount: -450000,
      status: "completed",
      description: "عمولة المنصة - 10%",
      referenceNumber: "COM-2024-001",
    },
    {
      id: "3",
      date: "2024-01-18",
      type: "transfer",
      amount: 3500000,
      status: "pending",
      description: "تحويل أرباح معلقة",
      referenceNumber: "TRF-2024-002",
    },
    {
      id: "4",
      date: "2024-01-17",
      type: "refund",
      amount: -250000,
      status: "completed",
      description: "استرجاع طلب ORD-2024-0008",
      referenceNumber: "REF-2024-001",
    },
  ]);

  const stats = {
    totalEarnings: 45000000,
    platformCommission: 4500000,
    netRevenue: 40500000,
    pendingPayouts: 3500000,
  };

  const typeLabels = {
    transfer: "تحويل",
    commission: "عمولة",
    refund: "استرجاع",
  };

  const typeColors = {
    transfer: "bg-green-500",
    commission: "bg-orange-500",
    refund: "bg-red-500",
  };

  const statusLabels = {
    completed: "مكتمل",
    pending: "قيد الانتظار",
    failed: "فشل",
  };

  const statusColors = {
    completed: "bg-green-500",
    pending: "bg-yellow-500",
    failed: "bg-red-500",
  };

  const filteredPayments = payments.filter((payment) => {
    if (filterType !== "all" && payment.type !== filterType) return false;
    if (filterStatus !== "all" && payment.status !== filterStatus) return false;
    if (searchQuery) {
      return (
        payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.referenceNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50"
      dir="rtl"
    >
      <SupplierHeader />
      <div className="p-4 lg:p-6 max-w-7xl mx-auto">
        <div className="mb-6">

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-r-4 border-r-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalEarnings.toLocaleString()}
                  <span className="text-sm text-gray-500 mr-1">د.ع</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <Percent className="w-6 h-6 text-orange-600" />
                  </div>
                  <ArrowDownRight className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-sm text-gray-600 mb-1">عمولة المنصة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.platformCommission.toLocaleString()}
                  <span className="text-sm text-gray-500 mr-1">د.ع</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-blue-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600 mb-1">صافي الإيرادات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.netRevenue.toLocaleString()}
                  <span className="text-sm text-gray-500 mr-1">د.ع</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-yellow-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-sm text-gray-600 mb-1">دفعات معلقة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingPayouts.toLocaleString()}
                  <span className="text-sm text-gray-500 mr-1">د.ع</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ابحث في المدفوعات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="نوع العملية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="transfer">تحويلات</SelectItem>
                <SelectItem value="commission">عمولات</SelectItem>
                <SelectItem value="refund">استرجاعات</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="failed">فشل</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Payments List */}
        <Card>
          <CardHeader>
            <CardTitle>سجل المدفوعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-white",
                        typeColors[payment.type]
                      )}
                    >
                      {payment.type === "transfer" ? (
                        <ArrowUpRight className="w-6 h-6" />
                      ) : payment.type === "commission" ? (
                        <Percent className="w-6 h-6" />
                      ) : (
                        <ArrowDownRight className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {payment.description}
                        </h4>
                        <Badge
                          variant="secondary"
                          className={cn("text-white", typeColors[payment.type])}
                        >
                          {typeLabels[payment.type]}
                        </Badge>
                        <Badge
                          className={cn(
                            "text-white",
                            statusColors[payment.status]
                          )}
                        >
                          {statusLabels[payment.status]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {payment.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {payment.referenceNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <p
                      className={cn(
                        "text-xl font-bold",
                        payment.amount > 0 ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {payment.amount > 0 ? "+" : ""}
                      {payment.amount.toLocaleString()}
                      <span className="text-sm mr-1">د.ع</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  لا توجد مدفوعات
                </h3>
                <p className="text-gray-600">
                  لم يتم العثور على مدفوعات تطابق البحث أو الفلاتر
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>طرق الدفع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        الحساب البنكي الرئيسي
                      </h4>
                      <p className="text-sm text-gray-600">
                        بنك بغداد - **** 1234
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-500">افتراضي</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  تعديل
                </Button>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        محفظة زين كاش
                      </h4>
                      <p className="text-sm text-gray-600">
                        07901234567
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  تعديل
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
