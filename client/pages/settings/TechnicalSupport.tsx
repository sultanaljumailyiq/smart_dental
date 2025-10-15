import React, { useState } from "react";
import {
  HeadphonesIcon,
  MessageSquare,
  Send,
  Paperclip,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  User,
  Building2,
  Package,
  Users,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userType: "supplier" | "clinic_owner" | "staff";
  userAvatar?: string;
  clinicId?: string;
  clinicName?: string;
  subject: string;
  category: "technical" | "billing" | "general" | "feature_request";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "waiting" | "resolved" | "closed";
  createdAt: string;
  lastResponse: string;
  messages: {
    id: string;
    senderId: string;
    senderType: "user" | "support";
    message: string;
    timestamp: string;
    attachments?: string[];
  }[];
}

export default function TechnicalSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: "1",
      ticketNumber: "SUP-2024-001",
      userId: "sup1",
      userName: "شركة المعدات الطبية",
      userType: "supplier",
      subject: "مشكلة في رفع المنتجات",
      category: "technical",
      priority: "high",
      status: "open",
      createdAt: "منذ 30 دقيقة",
      lastResponse: "في انتظار الرد",
      messages: [
        {
          id: "m1",
          senderId: "sup1",
          senderType: "user",
          message: "السلام عليكم، أواجه مشكلة في رفع صور المنتجات الجديدة",
          timestamp: "11:30 ص",
        },
      ],
    },
    {
      id: "2",
      ticketNumber: "SUP-2024-002",
      userId: "clinic1",
      userName: "د. أحمد محمد",
      userType: "clinic_owner",
      clinicId: "clinic1",
      clinicName: "عيادة النور",
      subject: "طلب تفعيل ميزة الحجز الإلكتروني",
      category: "feature_request",
      priority: "medium",
      status: "in_progress",
      createdAt: "منذ ساعتين",
      lastResponse: "جاري العمل على الطلب",
      messages: [
        {
          id: "m2",
          senderId: "clinic1",
          senderType: "user",
          message: "أريد تفعيل ميزة الحجز الإلكتروني لعيادتي",
          timestamp: "10:00 ص",
        },
        {
          id: "m3",
          senderId: "support",
          senderType: "support",
          message: "سنفعل الميزة خلال 24 ساعة",
          timestamp: "10:15 ص",
        },
      ],
    },
    {
      id: "3",
      ticketNumber: "SUP-2024-003",
      userId: "staff1",
      userName: "سارة أحمد (سكرتيرة)",
      userType: "staff",
      clinicId: "clinic2",
      clinicName: "عيادة الأمل",
      subject: "استفسار عن إدارة المواعيد",
      category: "general",
      priority: "low",
      status: "resolved",
      createdAt: "أمس",
      lastResponse: "تم الحل",
      messages: [
        {
          id: "m4",
          senderId: "staff1",
          senderType: "user",
          message: "كيف يمكنني إلغاء موعد وإعادة جدولته؟",
          timestamp: "أمس 2:00 م",
        },
        {
          id: "m5",
          senderId: "support",
          senderType: "support",
          message: "يمكنك الضغط على الموعد ثم اختيار 'إعادة جدولة'",
          timestamp: "أمس 2:10 م",
        },
        {
          id: "m6",
          senderId: "staff1",
          senderType: "user",
          message: "شكراً، تم حل المشكلة",
          timestamp: "أمس 2:15 م",
        },
      ],
    },
  ]);

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterUserType, setFilterUserType] = useState<string>("all");

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesUserType = filterUserType === "all" || ticket.userType === filterUserType;
    
    return matchesSearch && matchesStatus && matchesUserType;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: "جديد", color: "bg-blue-100 text-blue-700" },
      in_progress: { label: "قيد المعالجة", color: "bg-yellow-100 text-yellow-700" },
      waiting: { label: "في الانتظار", color: "bg-orange-100 text-orange-700" },
      resolved: { label: "تم الحل", color: "bg-green-100 text-green-700" },
      closed: { label: "مغلق", color: "bg-gray-100 text-gray-700" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "منخفض", color: "bg-gray-100 text-gray-700" },
      medium: { label: "متوسط", color: "bg-blue-100 text-blue-700" },
      high: { label: "عالي", color: "bg-orange-100 text-orange-700" },
      urgent: { label: "عاجل", color: "bg-red-100 text-red-700" },
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case "supplier": return <Package className="w-4 h-4" />;
      case "clinic_owner": return <Building2 className="w-4 h-4" />;
      case "staff": return <Users className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getUserTypeBadge = (type: string) => {
    const typeConfig = {
      supplier: { label: "مورد", color: "bg-green-100 text-green-700" },
      clinic_owner: { label: "مالك عيادة", color: "bg-purple-100 text-purple-700" },
      staff: { label: "كادر", color: "bg-blue-100 text-blue-700" },
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return config ? (
      <Badge className={config.color}>
        {getUserTypeIcon(type)}
        <span className="mr-1">{config.label}</span>
      </Badge>
    ) : null;
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedTicket) return;

    const newMessage = {
      id: `m${Date.now()}`,
      senderId: "support",
      senderType: "support" as const,
      message: messageInput,
      timestamp: new Date().toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" }),
    };

    setTickets(tickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        return {
          ...ticket,
          messages: [...ticket.messages, newMessage],
          lastResponse: messageInput,
          status: "in_progress" as const,
        };
      }
      return ticket;
    }));

    if (selectedTicket) {
      setSelectedTicket({
        ...selectedTicket,
        messages: [...selectedTicket.messages, newMessage],
      });
    }

    setMessageInput("");
  };

  const getTicketCounts = () => {
    return {
      all: tickets.length,
      open: tickets.filter(t => t.status === "open").length,
      in_progress: tickets.filter(t => t.status === "in_progress").length,
      resolved: tickets.filter(t => t.status === "resolved").length,
    };
  };

  const counts = getTicketCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <HeadphonesIcon className="w-8 h-8 text-purple-600" />
                الدعم الفني
              </h1>
              <p className="text-gray-600 mt-1">
                إدارة طلبات الدعم من الموردين، مالكي العيادات، والكادر
              </p>
            </div>
            <div className="flex gap-4">
              <Card className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{counts.open}</p>
                  <p className="text-sm text-gray-600">جديد</p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{counts.in_progress}</p>
                  <p className="text-sm text-gray-600">قيد المعالجة</p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{counts.resolved}</p>
                  <p className="text-sm text-gray-600">تم الحل</p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="بحث بالرقم، الموضوع، أو المستخدم..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="تصفية حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="open">جديد</SelectItem>
                <SelectItem value="in_progress">قيد المعالجة</SelectItem>
                <SelectItem value="waiting">في الانتظار</SelectItem>
                <SelectItem value="resolved">تم الحل</SelectItem>
                <SelectItem value="closed">مغلق</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterUserType} onValueChange={setFilterUserType}>
              <SelectTrigger>
                <SelectValue placeholder="تصفية حسب نوع المستخدم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستخدمين</SelectItem>
                <SelectItem value="supplier">الموردين</SelectItem>
                <SelectItem value="clinic_owner">مالكي العيادات</SelectItem>
                <SelectItem value="staff">الكادر</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-400px)]">
          {/* Tickets List */}
          <Card className="lg:col-span-1 shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="border-b border-gray-200 bg-gray-50 pb-4">
              <CardTitle className="text-lg">
                قائمة التذاكر ({filteredTickets.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
              <div className="divide-y divide-gray-200">
                {filteredTickets.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>لا توجد تذاكر</p>
                  </div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={cn(
                        "p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                        selectedTicket?.id === ticket.id && "bg-purple-50 border-r-4 border-r-purple-500"
                      )}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono text-gray-600">{ticket.ticketNumber}</span>
                          <span className="text-xs text-gray-500">{ticket.createdAt}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                        <div className="flex items-center gap-2">
                          {getUserTypeBadge(ticket.userType)}
                          {ticket.clinicName && (
                            <Badge variant="outline" className="text-xs">
                              {ticket.clinicName}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{ticket.userName}</p>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ticket Detail */}
          <Card className="lg:col-span-2 shadow-lg flex flex-col">
            {selectedTicket ? (
              <>
                {/* Ticket Header */}
                <CardHeader className="border-b border-gray-200 bg-gray-50 pb-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">{selectedTicket.subject}</h2>
                      <span className="text-sm font-mono text-gray-600">{selectedTicket.ticketNumber}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedTicket.userAvatar} />
                        <AvatarFallback>
                          {getUserTypeIcon(selectedTicket.userType)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{selectedTicket.userName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getUserTypeBadge(selectedTicket.userType)}
                          {selectedTicket.clinicName && (
                            <span className="text-sm text-gray-600">• {selectedTicket.clinicName}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedTicket.status)}
                      {getPriorityBadge(selectedTicket.priority)}
                      <Badge variant="outline">{selectedTicket.category}</Badge>
                      <span className="text-sm text-gray-500 mr-auto">{selectedTicket.createdAt}</span>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedTicket.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.senderType === "support" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-3",
                          msg.senderType === "support"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-900"
                        )}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className={cn(
                            "text-xs",
                            msg.senderType === "support" ? "text-purple-200" : "text-gray-500"
                          )}>
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>

                {/* Reply Input */}
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="flex items-end gap-2 mb-3">
                    <Select defaultValue="in_progress">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_progress">قيد المعالجة</SelectItem>
                        <SelectItem value="waiting">في الانتظار</SelectItem>
                        <SelectItem value="resolved">تم الحل</SelectItem>
                        <SelectItem value="closed">إغلاق</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-end gap-2">
                    <Textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="اكتب ردك هنا..."
                      className="resize-none"
                      rows={3}
                    />
                    <Button
                      onClick={sendMessage}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={!messageInput.trim()}
                    >
                      <Send className="w-4 h-4 ml-2" />
                      إرسال
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <HeadphonesIcon className="w-16 h-16 mx-auto mb-4" />
                  <p>اختر تذكرة لعرض التفاصيل</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
