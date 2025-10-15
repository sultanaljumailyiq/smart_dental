import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  MessageCircle,
  Send,
  Mic,
  MicOff,
  X,
  Maximize2,
  Minimize2,
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: Array<{
    label: string;
    action: () => void;
    icon?: React.ComponentType;
  }>;
}

interface EnhancedAIAssistantProps {
  isFloating?: boolean;
  position?: "bottom-right" | "bottom-left" | "center";
  theme?: "light" | "dark" | "clinic";
}

const EnhancedAIAssistant: React.FC<EnhancedAIAssistantProps> = ({
  isFloating = true,
  position = "bottom-right",
  theme = "clinic",
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [quickActions, setQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Pre-defined responses for common clinic queries
  const commonResponses = {
    مرحبا: "مرحباً بك في عيادتك! كي�� يمكنني مساعدتك اليوم؟",
    المواعيد:
      "يمكنني مساعدتك في إدارة المواعيد. هل تريد مشاهدة مواعيد اليوم أم إضافة موعد جديد؟",
    المرضى:
      "أستطيع مساعدتك في البحث عن المرضى أو إضافة مريض جديد. ما الذي تحتاجه؟",
    المالية:
      "يمكنني عرض التقارير المالية أو مساعدتك في إدارة الفواتير والمدفوعات.",
    المختبر:
      "أستطيع مساعدتك في متابعة طلبات المختبر والتركيبات. هل تريد مشاهدة الطلبات المعلقة؟",
    التقارير:
      "يمكنني إنشاء تقارير مخصصة حول أداء العيادة. أي نوع من التقارير تحتاج؟",
  };

  const quickActionButtons = [
    {
      label: "مواعيد اليوم",
      icon: Calendar,
      action: () => navigate("/clinic/reservations"),
    },
    {
      label: "مرضى جدد",
      icon: Users,
      action: () => navigate("/clinic/patients"),
    },
    {
      label: "طلبات المختبر",
      icon: Package,
      action: () => navigate("/clinic/lab"),
    },
    {
      label: "التقارير المالية",
      icon: BarChart3,
      action: () => navigate("/clinic/accounts"),
    },
  ];

  useEffect(() => {
    if (messages.length === 0) {
      // Welcome message
      setMessages([
        {
          id: "welcome",
          type: "assistant",
          content:
            "مرحباً! أنا مساعدك الذكي المتخصص في طب الأسنان 🦷\n\nDentalGPT Pro - 100% دقة\n\nكيف يمكنني مساعدتك اليوم؟",
          timestamp: new Date(),
          suggestions: [
            "تحليل الأشعة",
            "خطة علاج",
            "جدولة المواعيد",
            "فحص الأدوية",
          ],
        },
      ]);
    }
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
    setCurrentMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(currentMessage);
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
          content: response,
          suggestions: getSuggestionsForTopic(key),
          actions: getActionsForTopic(key),
        };
      }
    }

    // Default response
    return {
      content:
        "شكراً لسؤالك. أستطيع مساعدتك في إدارة العيادة. هل تحتاج مساعدة في المواعيد، المرضى، أو التقارير؟",
      suggestions: [
        "مواعيد اليوم",
        "قائمة المرضى",
        "التقارير المالية",
        "إعدادات العيادة",
      ],
      actions: [],
    };
  };

  const getSuggestionsForTopic = (topic: string) => {
    switch (topic) {
      case "المواعيد":
        return [
          "مواعيد اليوم",
          "مواعيد الأسبوع",
          "إضافة موعد جديد",
          "مواعيد ملغية",
        ];
      case "المرضى":
        return ["بحث عن مريض", "إضافة مريض جديد", "المرضى الجدد", "تاريخ طبي"];
      case "المالية":
        return ["إيرادات الشهر", "المدفوعات المعلقة", "تقرير مالي", "الفواتير"];
      case "المختبر":
        return [
          "طلبات معلقة",
          "تركيبات جديدة",
          "مختبرات شريكة",
          "متابعة الطلبات",
        ];
      default:
        return ["مساعدة عامة", "إعدادات", "دعم تقني"];
    }
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

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        setCurrentMessage("مرحبا كيف الحال؟");
        setIsListening(false);
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  const handleExpand = () => {
    navigate("/dentist-hub/smart-clinic/ai-assistant");
  };

  const FloatingButton = () => (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "fixed z-50 w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110",
        "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
        "flex items-center justify-center",
        position === "bottom-right" ? "bottom-6 right-6" : "bottom-6 left-6",
      )}
    >
      {isOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <div className="relative">
          <Bot className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </button>
  );

  const ChatWindow = () => (
    <div
      className={cn(
        "fixed z-40 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300",
        "w-96 h-[500px]",
        // Mobile responsive
        "max-sm:w-[95vw] max-sm:h-[85vh] max-sm:max-w-none max-sm:rounded-t-2xl max-sm:rounded-b-none",
        // Position
        position === "bottom-right" 
          ? "bottom-24 right-6 max-sm:bottom-0 max-sm:right-0 max-sm:left-0" 
          : "bottom-24 left-6 max-sm:bottom-0 max-sm:left-0 max-sm:right-0",
        isOpen
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none",
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 max-sm:p-3 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 max-sm:gap-2">
            <div className="w-10 h-10 max-sm:w-8 max-sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 max-sm:w-5 max-sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base max-sm:text-sm">مساعد الذكاء الاصطناعي</h3>
                <span className="bg-yellow-400 text-blue-900 px-2 py-0.5 rounded-full text-xs font-bold">Pro</span>
              </div>
              <p className="text-blue-100 text-xs">جاهز للمساعدة • DentalGPT v2.1</p>
            </div>
          </div>
          <div className="flex items-center gap-2 max-sm:gap-1">
            <button
              onClick={handleExpand}
              className="p-2 max-sm:p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              title="تكبير"
            >
              <Maximize2 className="w-4 h-4 max-sm:w-3.5 max-sm:h-3.5" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 max-sm:p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 max-sm:w-3.5 max-sm:h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Smart Suggestions */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 max-sm:p-3 border-b border-gray-200">
        <h4 className="font-semibold text-gray-900 text-sm mb-3 max-sm:text-xs">الاقتراحات الذكية</h4>
        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3 max-sm:gap-2">
          <div className="bg-white rounded-xl p-3 max-sm:p-2 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-3 max-sm:gap-2">
              <div className="w-8 h-8 max-sm:w-6 max-sm:h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg max-sm:text-base">🔍</span>
              </div>
              <div className="min-w-0">
                <h5 className="font-medium text-gray-900 text-xs max-sm:text-[10px] leading-tight mb-1">تحليل صورة أشعة سينية للأسنان</h5>
                <p className="text-gray-600 text-[10px] max-sm:text-[9px] leading-tight mb-1">تحليل شامل للصور الطبية</p>
                <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[9px] max-sm:text-[8px] font-medium">تشخيص</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-3 max-sm:p-2 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-3 max-sm:gap-2">
              <div className="w-8 h-8 max-sm:w-6 max-sm:h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg max-sm:text-base">💊</span>
              </div>
              <div className="min-w-0">
                <h5 className="font-medium text-gray-900 text-xs max-sm:text-[10px] leading-tight mb-1">اقتراح خطة علاج لتسوس الأسنان</h5>
                <p className="text-gray-600 text-[10px] max-sm:text-[9px] leading-tight mb-1">خطط علاج مخصصة ومتقدمة</p>
                <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[9px] max-sm:text-[8px] font-medium">علاج</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-3 max-sm:p-2 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-3 max-sm:gap-2">
              <div className="w-8 h-8 max-sm:w-6 max-sm:h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg max-sm:text-base">📅</span>
              </div>
              <div className="min-w-0">
                <h5 className="font-medium text-gray-900 text-xs max-sm:text-[10px] leading-tight mb-1">جدولة أفضل أوقات المواعيد</h5>
                <p className="text-gray-600 text-[10px] max-sm:text-[9px] leading-tight mb-1">تنظيم ذكي للمواعيد</p>
                <span className="inline-block bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[9px] max-sm:text-[8px] font-medium">إدارة</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-3 max-sm:p-2 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-3 max-sm:gap-2">
              <div className="w-8 h-8 max-sm:w-6 max-sm:h-6 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg max-sm:text-base">⚕️</span>
              </div>
              <div className="min-w-0">
                <h5 className="font-medium text-gray-900 text-xs max-sm:text-[10px] leading-tight mb-1">فحص التفاعلات الدوائية</h5>
                <p className="text-gray-600 text-[10px] max-sm:text-[9px] leading-tight mb-1">تحقق من سلامة الأدوية</p>
                <span className="inline-block bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[9px] max-sm:text-[8px] font-medium">أمان</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 p-4 max-sm:p-3 border-b border-gray-200">
        <h4 className="font-semibold text-gray-900 text-sm mb-3 max-sm:text-xs">إجراءات سريعة:</h4>
        <div className="grid grid-cols-3 max-sm:grid-cols-2 gap-2 max-sm:gap-1.5">
          {[
            { label: "تحليل الأشعة", icon: "🔍" },
            { label: "خطة العلاج", icon: "💊" },
            { label: "حجز موعد", icon: "📅" },
            { label: "حالة طارئة", icon: "🚨" },
            { label: "فحص الأدوية", icon: "⚕️" },
            { label: "تاريخ المريض", icon: "📋" }
          ].map((action, index) => (
            <button
              key={index}
              className="bg-white rounded-lg p-2 max-sm:p-1.5 shadow-sm border border-gray-200 hover:shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <div className="text-center">
                <div className="text-lg max-sm:text-base mb-1">{action.icon}</div>
                <span className="text-xs max-sm:text-[10px] font-medium text-gray-700 leading-tight">{action.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 max-sm:p-2 h-32 max-sm:h-24 overflow-y-auto bg-gradient-to-b from-white to-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.type === "user" ? "justify-start" : "justify-end",
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] p-3 rounded-2xl text-sm",
                  message.type === "user"
                    ? "bg-blue-500 text-white rounded-br-md"
                    : "bg-gray-100 text-gray-900 rounded-bl-md",
                )}
              >
                <p>{message.content}</p>

                {/* Suggestions */}
                {message.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.suggestions
                      .slice(0, 2)
                      .map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentMessage(suggestion)}
                          className="px-2 py-1 bg-white/20 rounded-lg text-xs hover:bg-white/30 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                  </div>
                )}

                {/* Actions */}
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className="w-full px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        {/* {action.icon && <action.icon className="w-3 h-3" />} */}
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-end">
              <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-md">
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

      {/* Chat Footer */}
      <div className="bg-white p-3 max-sm:p-2 border-t border-gray-200 rounded-b-2xl">
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 max-sm:w-5 max-sm:h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Brain className="w-4 h-4 max-sm:w-3 max-sm:h-3 text-white" />
            </div>
            <span className="font-bold text-sm max-sm:text-xs text-gray-900">DentalGPT Pro</span>
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs max-sm:text-[10px] font-medium">100% دقة</span>
          </div>
        </div>
        
        {/* Input */}
        <div className="flex items-center gap-2 max-sm:gap-1">
          <div className="flex-1 relative">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="اكتب رسالتك..."
              className="w-full px-3 py-2 max-sm:px-2 max-sm:py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm max-sm:text-xs bg-white text-gray-900"
              style={{ fontSize: '14px', color: '#111827' }}
            />
          </div>
          <button
            onClick={handleVoiceInput}
            className={cn(
              "p-2 max-sm:p-1.5 rounded-lg transition-colors",
              isListening
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
          >
            {isListening ? (
              <MicOff className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
            ) : (
              <Mic className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
            )}
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim()}
            className="p-2 max-sm:p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
          </button>
        </div>
      </div>
    </div>
  );

  if (!isFloating) {
    return <ChatWindow />;
  }

  return (
    <>
      <FloatingButton />
      <ChatWindow />
    </>
  );
};

export default EnhancedAIAssistant;
