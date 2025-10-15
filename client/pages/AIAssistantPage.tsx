import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bot,
  MessageCircle,
  Send,
  Mic,
  MicOff,
  ArrowLeft,
  Settings,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Volume2,
  VolumeX,
  Sparkles,
  Brain,
  Stethoscope,
  Calendar,
  FileText,
  Users,
  Package,
  CreditCard,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  MapPin,
  Heart,
  Download,
  Share,
  Bookmark,
  Star,
  Filter,
  Search,
  PlusCircle,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: Array<{
    label: string;
    action: () => void;
    icon?: React.ComponentType;
    variant?: "default" | "outline" | "destructive";
  }>;
  attachments?: Array<{
    type: "image" | "file" | "link";
    url: string;
    name: string;
  }>;
  rating?: "up" | "down" | null;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType;
  color: string;
  action: () => void;
  category: string;
}

const AIAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    {
      id: "appointments-today",
      title: "مواعيد اليوم",
      description: "عرض وإدارة مواعيد اليوم",
      icon: Calendar,
      color: "blue",
      action: () => navigate("/clinic/reservations"),
      category: "appointments",
    },
    {
      id: "add-patient",
      title: "إضافة مريض جديد",
      description: "تسجيل مريض جديد في النظام",
      icon: Users,
      color: "green",
      action: () => navigate("/clinic/patients"),
      category: "patients",
    },
    {
      id: "lab-orders",
      title: "طلبات المختبر",
      description: "متابعة طلبات المختبر والتركيبات",
      icon: Package,
      color: "purple",
      action: () => navigate("/clinic/lab"),
      category: "lab",
    },
    {
      id: "financial-report",
      title: "التقرير المالي",
      description: "عرض الإيرادات والمصروفات",
      icon: BarChart3,
      color: "emerald",
      action: () => navigate("/clinic/accounts"),
      category: "finance",
    },
    {
      id: "patient-search",
      title: "البحث عن مريض",
      description: "البحث في قاعدة بيانات المرضى",
      icon: Search,
      color: "cyan",
      action: () => setCurrentMessage("ابحث عن مريض باسم"),
      category: "patients",
    },
    {
      id: "emergency-contacts",
      title: "جهات الاتصال الطارئة",
      description: "عرض أرقام الطوارئ والمختبرات",
      icon: Phone,
      color: "red",
      action: () => setCurrentMessage("عرض جهات الاتصال الطارئة"),
      category: "emergency",
    },
    {
      id: "clinic-stats",
      title: "إحصائيات العيادة",
      description: "عرض إحصائيات شاملة عن أداء العيادة",
      icon: Activity,
      color: "indigo",
      action: () => setCurrentMessage("عرض إحصائيات العيادة"),
      category: "reports",
    },
    {
      id: "treatment-plans",
      title: "خطط العلاج",
      description: "إدارة ومتابعة خطط العلاج",
      icon: Stethoscope,
      color: "orange",
      action: () => navigate("/clinic/treatments"),
      category: "treatments",
    },
  ];

  const categories = [
    { id: "all", name: "الكل" },
    { id: "appointments", name: "المواعيد" },
    { id: "patients", name: "المرضى" },
    { id: "lab", name: "المختبر" },
    { id: "finance", name: "المالية" },
    { id: "treatments", name: "العلاج" },
    { id: "reports", name: "التقارير" },
    { id: "emergency", name: "الطوارئ" },
  ];

  const commonResponses = {
    مرحبا: {
      content:
        "مرحباً بك في صفحة المساعد الذكي المتطورة! أنا هنا لمساعدتك في إدارة عيادتك بكفاءة عالية. كيف يمكنني مساعدتك اليوم؟",
      suggestions: [
        "عرض مواعيد اليوم",
        "إحصائيات العيادة",
        "طلبات المختبر المعلقة",
        "التقرير المالي",
      ],
    },
    المواعيد: {
      content:
        "يمكنني مساعدتك في إدارة المواعيد بطرق متعددة. هل تريد عرض مواعيد اليوم، إضافة موعد جديد، أم البحث عن موعد محدد؟",
      suggestions: [
        "مواعيد اليوم",
        "إضافة موعد جديد",
        "مواعيد الأسبوع",
        "مواعيد ملغية",
      ],
    },
    المرضى: {
      content:
        "أستطيع مساعدتك في إدارة ملفات المرضى بشكل شامل. يمكنني البحث عن مريض، إضافة مريض جديد، أو عرض تاريخ طبي مفصل.",
      suggestions: [
        "بحث عن مريض",
        "إضافة مريض جديد",
        "المرضى الجدد هذا الشهر",
        "المرضى بحاجة لمتابعة",
      ],
    },
    المختبر: {
      content:
        "يمكنني مساعدتك في متابعة جميع طلبات المختبر والتركيبات. هل تريد مشاهدة الطلبات المعلقة، إضافة طلب جديد، أم متابعة حالة التركيبات؟",
      suggestions: [
        "طلبات معلقة",
        "إضافة طلب مختبر",
        "تركيبات جاهزة",
        "مختبرات شريكة",
      ],
    },
    المالية: {
      content:
        "أستطيع تقديم تقارير مالية شاملة ومساعدتك في إدارة الفواتير والمدفوعات. ما نوع المعلومات المالية التي تحتاجها؟",
      suggestions: [
        "إيرادات الشهر",
        "المدفوعات المعلقة",
        "أرباح العيادة",
        "تكاليف المختبر",
      ],
    },
  };

  useEffect(() => {
    // Welcome message
    setMessages([
      {
        id: "welcome",
        type: "system",
        content: "مرحباً بك في المساعد الذكي المتطور! 🤖",
        timestamp: new Date(),
      },
      {
        id: "intro",
        type: "assistant",
        content:
          "أنا مساعدك الذكي المتخصص في إدارة العيادات. يمكنني مساعدتك في جميع جوانب إدارة عيادتك من المواعيد إلى التقارير المالية ومتابعة المختبر. كيف يمكنني مساعدتك اليوم؟",
        timestamp: new Date(),
        suggestions: [
          "عرض لوحة القيادة",
          "مواعيد اليوم",
          "طلبات المختبر",
          "إحصائيات سريعة",
        ],
        actions: [
          {
            label: "عرض الإجراءات السريعة",
            action: () => {},
            icon: Sparkles,
            variant: "default",
          },
        ],
      },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToProcess = currentMessage;
    setCurrentMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(messageToProcess);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        actions: response.actions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();

    // Check for common patterns
    for (const [key, response] of Object.entries(commonResponses)) {
      if (lowerMessage.includes(key)) {
        return {
          content: response.content,
          suggestions: response.suggestions,
          actions: getActionsForTopic(key),
        };
      }
    }

    // Specific responses for detailed queries
    if (lowerMessage.includes("إحصائيات")) {
      return {
        content:
          "إليك إحصائيات سريعة عن عيادتك: \n• مواعيد اليوم: 12 موعد\n• مرضى جدد هذا الشهر: 45 مريض\n• إيرادات الشهر: 15.7 مليون دينار\n• طلبات مختبر معلقة: 8 طلبات",
        suggestions: ["تفاصيل أكثر", "تقرير شامل", "مقارنة بالشهر الماضي"],
        actions: [
          {
            label: "عرض التقرير الكامل",
            action: () => navigate("/clinic/reports"),
            icon: BarChart3,
          },
        ],
      };
    }

    if (
      lowerMessage.includes("طلبات مختبر") ||
      lowerMessage.includes("المختبر")
    ) {
      return {
        content:
          "لديك حالياً 8 طلبات مختبر معلقة:\n• 3 تركيبات أسنان (متوقع الانتهاء: غداً)\n• 2 أطقم أسنان (متوقع: بعد 3 أيام)\n• 3 تيجان سيراميك (قيد التحضير)",
        suggestions: ["تفاصيل كل طلب", "إضافة طلب جديد", "اتصال بالمختبر"],
        actions: [
          {
            label: "إدارة المختبر",
            action: () => navigate("/clinic/lab"),
            icon: Package,
          },
        ],
      };
    }

    // Default response
    return {
      content:
        "شكراً لسؤالك. يمكنني مساعدتك في العديد من المهام. هل تحتاج مساعدة في إدارة المواعيد، متابعة المرضى، أم شيء آخر؟",
      suggestions: ["مواعيد اليوم", "بحث عن مريض", "تقرير مالي", "طلبات مختبر"],
      actions: [],
    };
  };

  const getActionsForTopic = (topic: string) => {
    switch (topic) {
      case "المواعيد":
        return [
          {
            label: "عرض مواعيد اليوم",
            action: () => navigate("/clinic/reservations"),
            icon: Calendar,
          },
        ];
      case "المرضى":
        return [
          {
            label: "قائمة المرضى",
            action: () => navigate("/clinic/patients"),
            icon: Users,
          },
        ];
      case "المختبر":
        return [
          {
            label: "إدارة المختبر",
            action: () => navigate("/clinic/lab"),
            icon: Package,
          },
        ];
      default:
        return [];
    }
  };

  const handleRateMessage = (messageId: string, rating: "up" | "down") => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, rating } : msg)),
    );
  };

  const filteredActions = quickActions.filter(
    (action) =>
      selectedCategory === "all" || action.category === selectedCategory,
  );

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500 text-white",
      green: "bg-green-500 text-white",
      purple: "bg-purple-500 text-white",
      emerald: "bg-emerald-500 text-white",
      cyan: "bg-cyan-500 text-white",
      red: "bg-red-500 text-white",
      indigo: "bg-indigo-500 text-white",
      orange: "bg-orange-500 text-white",
    };
    return colorMap[color] || "bg-gray-500 text-white";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/clinic"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  المساعد الذكي
                </h1>
                <p className="text-sm text-gray-600">
                  متاح للمساعدة على مدار الساعة
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                الإجراءات السريعة
              </h2>

              {/* Category Filter */}
              <div className="mb-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 gap-3">
                {filteredActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 text-right group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform",
                          getColorClasses(action.color),
                        )}
                      >
                        <div className="w-5 h-5 flex items-center justify-center">
                          {action.icon && React.createElement(action.icon)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {action.title}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">المساعد الذكي</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">متاح الآن</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsSpeaking(!isSpeaking)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.type === "user"
                          ? "justify-start"
                          : "justify-end",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] p-4 rounded-2xl",
                          message.type === "user"
                            ? "bg-blue-500 text-white rounded-br-md"
                            : message.type === "system"
                              ? "bg-purple-100 text-purple-900 rounded-lg mx-auto text-center"
                              : "bg-gray-100 text-gray-900 rounded-bl-md",
                        )}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>

                        {/* Message timestamp */}
                        <p
                          className={cn(
                            "text-xs mt-2 opacity-70",
                            message.type === "user"
                              ? "text-blue-100"
                              : "text-gray-500",
                          )}
                        >
                          {message.timestamp.toLocaleTimeString("ar-IQ", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>

                        {/* Suggestions */}
                        {message.suggestions && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentMessage(suggestion)}
                                className="px-3 py-1 bg-white/20 rounded-lg text-xs hover:bg-white/30 transition-colors border border-white/20"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        {message.actions && message.actions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.actions.map((action, index) => (
                              <button
                                key={index}
                                onClick={action.action}
                                className={cn(
                                  "w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2",
                                  action.variant === "outline"
                                    ? "border border-current hover:bg-current hover:text-white"
                                    : "bg-blue-600 text-white hover:bg-blue-700",
                                )}
                              >
                                <div className="w-3 h-3 flex items-center justify-center mr-1">
                                  {action.icon && React.createElement(action.icon)}
                                </div>
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Rating */}
                        {message.type === "assistant" && (
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleRateMessage(message.id, "up")
                              }
                              className={cn(
                                "p-1 rounded transition-colors",
                                message.rating === "up"
                                  ? "bg-green-500 text-white"
                                  : "hover:bg-gray-200",
                              )}
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() =>
                                handleRateMessage(message.id, "down")
                              }
                              className={cn(
                                "p-1 rounded transition-colors",
                                message.rating === "down"
                                  ? "bg-red-500 text-white"
                                  : "hover:bg-gray-200",
                              )}
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-end">
                      <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-md">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="اكتب رسالتك هنا..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => setIsListening(!isListening)}
                    className={cn(
                      "p-3 rounded-xl transition-colors",
                      isListening
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                    )}
                  >
                    {isListening ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim()}
                    className="px-6 py-3"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
