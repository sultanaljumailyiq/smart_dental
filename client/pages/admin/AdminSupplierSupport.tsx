import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Building2,
  Search,
  Filter,
  Eye,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Star,
  BarChart3,
  Megaphone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: "technical" | "payment" | "product" | "shipping" | "complaint" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  reporterType: "customer" | "supplier";
  reporterName: string;
  reporterId: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  messages: number;
}

export default function AdminSupplierSupport() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "1",
      ticketNumber: "TCK-2024-001",
      subject: "مشكلة في نظام الدفع",
      category: "payment",
      priority: "high",
      status: "in_progress",
      reporterType: "supplier",
      reporterName: "شركة حلول الأسنان التقنية",
      reporterId: "SUP-001",
      assignedTo: "أحمد محمد",
      createdAt: "2024-01-20 10:30",
      updatedAt: "2024-01-20 14:45",
      messages: 5,
    },
    {
      id: "2",
      ticketNumber: "TCK-2024-002",
      subject: "شكوى من جودة المنتج",
      category: "complaint",
      priority: "urgent",
      status: "open",
      reporterType: "customer",
      reporterName: "عيادة الابتسامة الذهبية",
      reporterId: "CUST-045",
      createdAt: "2024-01-21 09:15",
      updatedAt: "2024-01-21 09:15",
      messages: 1,
    },
    {
      id: "3",
      ticketNumber: "TCK-2024-003",
      subject: "استفسار عن الشحن",
      category: "shipping",
      priority: "medium",
      status: "resolved",
      reporterType: "supplier",
      reporterName: "شركة الإمدادات الطبية",
      reporterId: "SUP-002",
      assignedTo: "فاطمة علي",
      createdAt: "2024-01-19 16:20",
      updatedAt: "2024-01-20 11:00",
      messages: 8,
    },
    {
      id: "4",
      ticketNumber: "TCK-2024-004",
      subject: "خطأ في المنتج المستلم",
      category: "product",
      priority: "high",
      status: "in_progress",
      reporterType: "customer",
      reporterName: "مركز بغداد للأسنان",
      reporterId: "CUST-078",
      assignedTo: "أحمد محمد",
      createdAt: "2024-01-21 11:45",
      updatedAt: "2024-01-21 13:20",
      messages: 3,
    },
  ]);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categoryLabels = {
    technical: "تقني",
    payment: "دفع",
    product: "منتج",
    shipping: "شحن",
    complaint: "شكوى",
    other: "أخرى",
  };

  const categoryColors = {
    technical: "bg-blue-500",
    payment: "bg-green-500",
    product: "bg-purple-500",
    shipping: "bg-orange-500",
    complaint: "bg-red-500",
    other: "bg-gray-500",
  };

  const priorityLabels = {
    low: "منخفض",
    medium: "متوسط",
    high: "عالي",
    urgent: "عاجل",
  };

  const priorityColors = {
    low: "bg-gray-500",
    medium: "bg-blue-500",
    high: "bg-orange-500",
    urgent: "bg-red-500",
  };

  const statusLabels = {
    open: "مفتوح",
    in_progress: "قيد المعالجة",
    resolved: "محلول",
    closed: "مغلق",
  };

  const statusColors = {
    open: "bg-yellow-500",
    in_progress: "bg-blue-500",
    resolved: "bg-green-500",
    closed: "bg-gray-500",
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filterStatus !== "all" && ticket.status !== filterStatus) return false;
    if (filterCategory !== "all" && ticket.category !== filterCategory)
      return false;
    if (filterPriority !== "all" && ticket.priority !== filterPriority)
      return false;
    if (searchQuery) {
      return (
        ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.reporterName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50"
      dir="rtl"
    >
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-7 h-7 text-blue-600" />
                مركز إدارة الموردين
              </h1>
              <p className="text-sm text-gray-600 mt-1">مراقبة وإدارة جميع الموردين في المنصة</p>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/suppliers")}
            >
              <Building2 className="w-4 h-4 ml-2" />
              الموردين
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/suppliers/analytics")}
            >
              <BarChart3 className="w-4 h-4 ml-2" />
              الإحصائيات
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/suppliers/promotions")}
            >
              <Megaphone className="w-4 h-4 ml-2" />
              الحملات الترويجية
            </Button>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/admin/suppliers/support")}
            >
              <MessageSquare className="w-4 h-4 ml-2" />
              الدعم
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                دعم العملاء والموردين
              </h1>
              <p className="text-gray-600">
                إدارة التذاكر والشكاوى والاستفسارات
              </p>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
              <MessageSquare className="w-4 h-4 ml-2" />
              تذكرة جديدة
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-r-4 border-r-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">إجمالي التذاكر</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.total}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-yellow-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">مفتوح</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.open}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">قيد المعالجة</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.inProgress}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">محلول</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.resolved}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ابحث عن تذكرة..."
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
                <SelectItem value="open">مفتوح</SelectItem>
                <SelectItem value="in_progress">قيد المعالجة</SelectItem>
                <SelectItem value="resolved">محلول</SelectItem>
                <SelectItem value="closed">مغلق</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                <SelectItem value="technical">تقني</SelectItem>
                <SelectItem value="payment">دفع</SelectItem>
                <SelectItem value="product">منتج</SelectItem>
                <SelectItem value="shipping">شحن</SelectItem>
                <SelectItem value="complaint">شكوى</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="الأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأولويات</SelectItem>
                <SelectItem value="low">منخفض</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="high">عالي</SelectItem>
                <SelectItem value="urgent">عاجل</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-white",
                        ticket.reporterType === "supplier"
                          ? "bg-blue-500"
                          : "bg-purple-500"
                      )}
                    >
                      {ticket.reporterType === "supplier" ? (
                        <Building2 className="w-6 h-6" />
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {ticket.ticketNumber}
                        </h3>
                        <Badge
                          className={cn(
                            "text-white",
                            categoryColors[ticket.category]
                          )}
                        >
                          {categoryLabels[ticket.category]}
                        </Badge>
                        <Badge
                          className={cn(
                            "text-white",
                            priorityColors[ticket.priority]
                          )}
                        >
                          {priorityLabels[ticket.priority]}
                        </Badge>
                        <Badge
                          className={cn(
                            "text-white",
                            statusColors[ticket.status]
                          )}
                        >
                          {statusLabels[ticket.status]}
                        </Badge>
                      </div>
                      <h4 className="text-lg font-medium text-gray-800 mb-2">
                        {ticket.subject}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">المُبلّغ:</span>{" "}
                          {ticket.reporterName}
                        </div>
                        <div>
                          <span className="font-medium">المسؤول:</span>{" "}
                          {ticket.assignedTo || "غير مُعيّن"}
                        </div>
                        <div>
                          <span className="font-medium">الرسائل:</span>{" "}
                          {ticket.messages}
                        </div>
                        <div>
                          <span className="font-medium">آخر تحديث:</span>{" "}
                          {ticket.updatedAt}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setDetailsOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4 ml-1" />
                      عرض
                    </Button>
                    <Button size="sm">
                      <MessageCircle className="w-4 h-4 ml-1" />
                      رد
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTickets.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد تذاكر
              </h3>
              <p className="text-gray-600">
                لم يتم العثور على تذاكر تطابق البحث أو الفلاتر
              </p>
            </CardContent>
          </Card>
        )}

        {/* Ticket Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>
                {selectedTicket?.ticketNumber} - {selectedTicket?.subject}
              </DialogTitle>
              <DialogDescription>
                تفاصيل التذكرة والمحادثات
              </DialogDescription>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>المُبلّغ</Label>
                    <p className="text-gray-900">{selectedTicket.reporterName}</p>
                  </div>
                  <div>
                    <Label>المسؤول</Label>
                    <p className="text-gray-900">
                      {selectedTicket.assignedTo || "غير مُعيّن"}
                    </p>
                  </div>
                  <div>
                    <Label>التصنيف</Label>
                    <Badge
                      className={cn(
                        "text-white",
                        categoryColors[selectedTicket.category]
                      )}
                    >
                      {categoryLabels[selectedTicket.category]}
                    </Badge>
                  </div>
                  <div>
                    <Label>الأولوية</Label>
                    <Badge
                      className={cn(
                        "text-white",
                        priorityColors[selectedTicket.priority]
                      )}
                    >
                      {priorityLabels[selectedTicket.priority]}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>إضافة رد</Label>
                  <Textarea placeholder="اكتب ردك هنا..." rows={4} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                إغلاق
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                إرسال الرد
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
