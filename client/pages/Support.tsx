import React, { useState } from "react";
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Star,
  Search,
  Filter,
  Plus,
  Eye,
  ArrowRight,
  Download,
  FileText,
  Video,
  Book,
  Headphones,
  Shield,
  Zap,
  Settings,
  Bug,
  RefreshCw,
  Send,
  Paperclip,
  X,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Sample support data
const supportStats = {
  totalTickets: 1247,
  openTickets: 45,
  avgResponseTime: "2.5 ساعات",
  satisfactionRate: 94.5,
};

const supportTickets = [
  {
    id: "TKT-001",
    title: "مشكلة في تسجيل الدخول",
    category: "technical",
    priority: "high",
    status: "open",
    customer: "د. أحمد محمد",
    email: "ahmed@email.com",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:45:00Z",
    description: "لا أستطيع تسجيل الدخول إلى النظام منذ الصباح",
    assignedTo: "فريق الدعم الفني",
    responses: 3,
  },
  {
    id: "TKT-002", 
    title: "استفسار حول الفواتير",
    category: "billing",
    priority: "medium",
    status: "in_progress",
    customer: "د. فاطمة علي",
    email: "fatima@email.com",
    createdAt: "2024-01-14T16:20:00Z",
    updatedAt: "2024-01-15T09:15:00Z",
    description: "أريد تفسير الرسوم الإضافية في فاتورة الشهر الماضي",
    assignedTo: "قسم المحاسبة",
    responses: 1,
  },
  {
    id: "TKT-003",
    title: "طلب ميزة جديدة",
    category: "feature",
    priority: "low",
    status: "resolved",
    customer: "د. محمد خالد",
    email: "mohammed@email.com",
    createdAt: "2024-01-12T11:45:00Z",
    updatedAt: "2024-01-14T15:30:00Z",
    description: "أقترح إضافة تقارير أكثر تفصيلاً للمرضى",
    assignedTo: "فريق التطوير",
    responses: 5,
    rating: 5,
  },
];

const faqData = [
  {
    id: 1,
    question: "كيف يمكنني إعادة تعيين كلمة المرور؟",
    answer: "يمكنك إعادة تعيين كلمة المرور عن طريق النقر على 'نسيت كلمة المرور' في صفحة تسجيل الدخول واتباع التعليمات المرسلة على بريدك الإلكتروني.",
    category: "account",
    views: 245,
  },
  {
    id: 2,
    question: "كيف أقوم بإضافة مريض جديد؟",
    answer: "اذهب إلى قسم المرضى من القائمة الجانبية، ثم انقر على 'إضافة مريض جديد' واملأ البيانات المطلوبة.",
    category: "patients",
    views: 189,
  },
  {
    id: 3,
    question: "كيف يمكنني تصدير التقارير؟",
    answer: "في صفحة التقارير، اختر نوع التقرير والفترة الزمنية المطلوبة، ثم انقر على زر 'تصدير' واختر التنسيق المناسب (PDF, Excel, CSV).",
    category: "reports",
    views: 167,
  },
];

const supportCategories = [
  { id: "technical", name: "مشاكل تقنية", icon: Settings, color: "text-red-600 bg-red-100" },
  { id: "billing", name: "الفواتير والدفع", icon: FileText, color: "text-green-600 bg-green-100" },
  { id: "feature", name: "طلب ميزة", icon: Plus, color: "text-blue-600 bg-blue-100" },
  { id: "bug", name: "بلاغ خطأ", icon: Bug, color: "text-orange-600 bg-orange-100" },
  { id: "account", name: "إدارة الحساب", icon: User, color: "text-purple-600 bg-purple-100" },
  { id: "general", name: "استفسار عام", icon: HelpCircle, color: "text-gray-600 bg-gray-100" },
];

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket?: any;
}

function TicketModal({ isOpen, onClose, ticket }: TicketModalProps) {
  const [newMessage, setNewMessage] = useState("");

  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{ticket.title}</h2>
            <p className="text-sm text-gray-500">#{ticket.id}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Ticket Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">الحالة</label>
              <div className="mt-1">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  ticket.status === "open" && "bg-red-100 text-red-700",
                  ticket.status === "in_progress" && "bg-yellow-100 text-yellow-700",
                  ticket.status === "resolved" && "bg-green-100 text-green-700"
                )}>
                  {ticket.status === "open" && "مفتوح"}
                  {ticket.status === "in_progress" && "قيد المعالجة"}
                  {ticket.status === "resolved" && "محلول"}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">الأولوية</label>
              <div className="mt-1">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  ticket.priority === "high" && "bg-red-100 text-red-700",
                  ticket.priority === "medium" && "bg-yellow-100 text-yellow-700",
                  ticket.priority === "low" && "bg-green-100 text-green-700"
                )}>
                  {ticket.priority === "high" && "عالية"}
                  {ticket.priority === "medium" && "متوسطة"}
                  {ticket.priority === "low" && "منخفضة"}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">العميل</label>
              <div className="mt-1 text-sm text-gray-900">{ticket.customer}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">المسؤول</label>
              <div className="mt-1 text-sm text-gray-900">{ticket.assignedTo}</div>
            </div>
          </div>

          {/* Original Message */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">الرسالة الأصلية</h4>
            <p className="text-gray-700">{ticket.description}</p>
            <div className="mt-2 text-xs text-gray-500">
              {new Date(ticket.createdAt).toLocaleDateString('ar-SA')} في {new Date(ticket.createdAt).toLocaleTimeString('ar-SA')}
            </div>
          </div>

          {/* Response Form */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">إضافة رد</h4>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب ردك هنا..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Paperclip className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-500">إرفاق ملف</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  إلغاء
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  إرسال الرد
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Support() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || ticket.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || ticket.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "text-red-600 bg-red-100";
      case "in_progress": return "text-yellow-600 bg-yellow-100";
      case "resolved": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الدعم الفني</h1>
          <p className="text-gray-600">إدارة تذاكر الدعم والمساعدة الفنية</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          تذكرة جديدة
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{supportStats.totalTickets}</div>
              <div className="text-sm text-gray-600">إجمالي التذاكر</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{supportStats.openTickets}</div>
              <div className="text-sm text-gray-600">تذاكر مفتوحة</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{supportStats.avgResponseTime}</div>
              <div className="text-sm text-gray-600">متوسط وقت الرد</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{supportStats.satisfactionRate}%</div>
              <div className="text-sm text-gray-600">معدل الرضا</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <nav className="flex">
          {[
            { id: "tickets", label: "التذاكر", icon: HelpCircle },
            { id: "faq", label: "الأسئلة الشائعة", icon: Book },
            { id: "contact", label: "معلومات الاتصال", icon: Phone },
            { id: "knowledge", label: "قاعدة المعرفة", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tickets Tab */}
      {activeTab === "tickets" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث في التذاكر..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الفئات</option>
                {supportCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="open">مفتوح</option>
                <option value="in_progress">قيد المعالجة</option>
                <option value="resolved">محلول</option>
              </select>
            </div>
          </div>

          {/* Tickets List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">تذاكر الدعم</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">العنوان</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">العميل</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الأولوية</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">آخر تحديث</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ticket.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                        <div className="text-sm text-gray-500">{ticket.responses} رد</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{ticket.customer}</div>
                        <div className="text-sm text-gray-500">{ticket.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(ticket.status))}>
                          {ticket.status === "open" && "مفتوح"}
                          {ticket.status === "in_progress" && "قيد المعالجة"}
                          {ticket.status === "resolved" && "محلول"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getPriorityColor(ticket.priority))}>
                          {ticket.priority === "high" && "عالية"}
                          {ticket.priority === "medium" && "متوسطة"}
                          {ticket.priority === "low" && "منخفضة"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(ticket.updatedAt).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          عرض
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === "faq" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">الأسئلة الشائعة</h3>
          <div className="space-y-4">
            {faqData.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-gray-700 text-sm">{faq.answer}</p>
                  </div>
                  <div className="text-xs text-gray-500 ml-4">
                    {faq.views} مشاهدة
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === "contact" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">معلومات الاتصال</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">الهاتف</div>
                  <div className="text-sm text-gray-600">+964 770 123 4567</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">البريد الإلكتروني</div>
                  <div className="text-sm text-gray-600">support@smartdental.iq</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">الدردشة المباشرة</div>
                  <div className="text-sm text-gray-600">متاح 24/7</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">ساعات العمل</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">الأحد - الخميس</span>
                <span className="font-medium">8:00 ص - 6:00 م</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الجمعة</span>
                <span className="font-medium">9:00 ص - 2:00 م</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">السبت</span>
                <span className="font-medium">مغلق</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  الدعم الطارئ متاح خارج ساعات العمل
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Knowledge Base Tab */}
      {activeTab === "knowledge" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">قاعدة المعرفة</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Book className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">دليل المستخدم</h4>
              <p className="text-sm text-gray-600">دليل شامل لاستخدام النظام</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Video className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">فيديوهات تعليمية</h4>
              <p className="text-sm text-gray-600">شروحات بالفيديو لجميع الميزات</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Headphones className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">دورات تدريبية</h4>
              <p className="text-sm text-gray-600">دورات مجانية للتدريب على النظام</p>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      <TicketModal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
      />
    </div>
  );
}
