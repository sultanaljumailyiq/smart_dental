import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Bot,
  Send,
  X,
  Sparkles,
  Brain,
  Stethoscope,
  FileText,
  Calendar,
  Eye,
  Shield,
  Activity,
  ChevronDown,
  Minimize2,
  Maximize2,
  ClipboardCheck,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAIDentalAssistant } from "@/hooks/useAIDentalAssistant";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface QuickAction {
  label: string;
  icon: React.ComponentType<any>;
  prompt: string;
  color: string;
  description: string;
}

const UnifiedAIAssistant: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { sendMessage, isLoading } = useAIDentalAssistant({
    agentType: "clinic",
    preferredModel: "gemini-2.5-flash",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // تحديد نوع السياق (طبيب أو مريض)
  const getContextType = (): "doctor" | "patient" | null => {
    const path = location.pathname;
    if (
      path.startsWith("/dentist-hub") ||
      path.startsWith("/clinic_old") ||
      path.startsWith("/clinic/") ||
      path.startsWith("/smart-clinic")
    ) {
      return "doctor";
    }
    if (
      path.startsWith("/medical-services") ||
      path.startsWith("/emergency") ||
      path.startsWith("/patient")
    ) {
      return "patient";
    }
    return null;
  };

  const contextType = getContextType();

  // إجراءات سريعة للأطباء
  const doctorQuickActions: QuickAction[] = [
    {
      label: "تحليل صورة أشعة سينية للأسنان",
      icon: Eye,
      prompt: "تحليل صورة أشعة سينية للأسنان",
      color: "bg-blue-500",
      description: "تحليل شامل للصور الطبية",
    },
    {
      label: "اقتراح حطة علاج لتسوس الأسنان",
      icon: FileText,
      prompt: "اقتراح خطة علاج لتسوس الأسنان",
      color: "bg-purple-500",
      description: "خطط علاج مخصصة ومتقدمة",
    },
    {
      label: "إنشاء ملخص علاج للمريض",
      icon: ClipboardCheck,
      prompt: "إنشاء ملخص علاج للمريض",
      color: "bg-indigo-500",
      description: "تقارير طبية شاملة",
    },
    {
      label: "فحص التفاعلات الدوائية",
      icon: Shield,
      prompt: "فحص التفاعلات الدوائية",
      color: "bg-green-500",
      description: "تحقق من سلامة الأدوية",
    },
    {
      label: "جدولة أفضل أوقات المواعيد",
      icon: Calendar,
      prompt: "جدولة أفضل أوقات المواعيد",
      color: "bg-orange-500",
      description: "تنظيم ذكي للمواعيد",
    },
    {
      label: "توصيات للرعاية الوقائية",
      icon: Target,
      prompt: "توصيات للرعاية الوقائية",
      color: "bg-teal-500",
      description: "نصائح وقائية متخصصة",
    },
  ];

  // إجراءات سريعة للمرضى
  const patientQuickActions: QuickAction[] = [
    {
      label: "ما أسباب ألم الأسنان؟",
      icon: Activity,
      prompt: "ما أسباب ألم الأسنان؟",
      color: "bg-red-500",
      description: "فهم أعراض الألم",
    },
    {
      label: "كيف أعتني بأسناني يومياً؟",
      icon: Sparkles,
      prompt: "كيف أعتني بأسناني يومياً؟",
      color: "bg-blue-500",
      description: "نصائح العناية اليومية",
    },
    {
      label: "متى يجب زيارة طبيب الأسنان؟",
      icon: Stethoscope,
      prompt: "متى يجب زيارة طبيب الأسنان؟",
      color: "bg-purple-500",
      description: "توقيت الزيارات المناسبة",
    },
    {
      label: "ما هي أعراض التسوس؟",
      icon: Eye,
      prompt: "ما هي أعراض التسوس؟",
      color: "bg-orange-500",
      description: "علامات التسوس المبكر",
    },
  ];

  const quickActions = contextType === "doctor" ? doctorQuickActions : patientQuickActions;

  // رسالة الترحيب حسب السياق
  const getWelcomeMessage = (): Message => {
    if (contextType === "doctor") {
      return {
        id: "welcome",
        content: `مرحباً د.! أنا مساعدك السريري الذكي 🦷

**يمكنني مساعدتك في:**
• تحليل الحالات السريرية وتقديم توصيات تشخيصية
• اقتراح خطط علاجية بناءً على أحدث الإرشادات
• مراجعة الحالات المعقدة وتقديم آراء استشارية
• البحث عن معلومات طبية وأدلة علمية
• إدارة سير العمل السريري وتنظيم المهام

⚠️ **ملاحظة:** أنا أداة دعم قرار سريري. القرارات النهائية تعود لخبرتك المهنية.

كيف يمكنني مساعدتك اليوم؟`,
        sender: "ai",
        timestamp: new Date(),
      };
    } else {
      return {
        id: "welcome",
        content: `مرحباً! أنا مساعدك الصحي الذكي 🦷

**يمكنني مساعدتك في:**
• تحليل الأعراض وتقديم نصائح أولية
• فهم خيارات العلاج المتاحة
• نصائح الوقاية والعناية اليومية
• الإجابة على أسئلتك الصحية
• تحليل صور الأسنان والفم

⚠️ **تنويه مهم:** أنا أداة مساعدة فقط. دائماً راجع طبيب أسنان محترف للتشخيص والعلاج النهائي.

كيف يمكنني مساعدتك اليوم؟`,
        sender: "ai",
        timestamp: new Date(),
      };
    }
  };

  useEffect(() => {
    if (contextType && messages.length === 0) {
      setMessages([getWelcomeMessage()]);
    }
  }, [contextType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setShowQuickActions(false);

    try {
      const agentType = contextType === "doctor" ? "clinic" : "patient";
      const response = await sendMessage(textToSend, undefined, undefined, agentType);

      if (response?.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.response,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const placeholderResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `شكراً على سؤالك: "${textToSend}"

جاري معالجة طلبك وسأقدم لك الإجابة قريباً...`,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, placeholderResponse]);
      }
    } catch (error) {
      console.error("AI Assistant Error:", error);
      toast({
        title: "خطأ في المساعد الذكي",
        description: "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const handleQuickAction = (prompt: string) => {
    setInputValue(prompt);
    handleSendMessage(prompt);
  };

  if (!contextType) {
    return null;
  }

  return (
    <>
      {/* زر الإجراءات السريعة العائم */}
      {!isOpen && (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
          {/* زر الإجراءات السريعة */}
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className={cn(
              "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50",
              "flex items-center gap-3 px-6 py-4"
            )}
          >
            <div className="relative">
              <Bot className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div className="text-right">
              <div className="font-bold text-sm">مساعد الذكاء الاصطناعي</div>
              <div className="text-xs text-blue-100">
                {contextType === "doctor" ? "DentalGPT Pro • متاح الآن" : "مساعد صحي • متاح 24/7"}
              </div>
            </div>
            <ChevronDown className={cn("w-5 h-5 transition-transform", showQuickActions && "rotate-180")} />
          </button>

          {/* قائمة الإجراءات السريعة */}
          {showQuickActions && (
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-[280px] max-h-[400px] overflow-y-auto">
              <div className="text-sm font-bold text-gray-900 mb-3">إجراءات سريعة:</div>
              <div className="space-y-2">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        handleQuickAction(action.prompt);
                        setIsOpen(true);
                        setShowQuickActions(false);
                      }}
                      className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-right group"
                    >
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0", action.color)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{action.label}</div>
                        <div className="text-xs text-gray-500">{action.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setIsOpen(true)}
                className="w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
              >
                فتح المحادثة الكاملة
              </button>
            </div>
          )}
        </div>
      )}

      {/* نافذة المحادثة */}
      {isOpen && (
        <div className={cn(
          "fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300",
          isMobile ? "inset-4" : "bottom-6 left-6 w-[420px] h-[600px]",
          isMinimized && "h-16"
        )}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="w-8 h-8" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {contextType === "doctor" ? "مساعد الذكاء الاصطناعي" : "مساعدك الصحي"}
                </h3>
                <p className="text-xs text-blue-100">
                  {contextType === "doctor" ? "DentalGPT Pro v2.1" : "Google Gemini 2.5"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-[calc(100%-140px)] overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3",
                      msg.sender === "user" ? "flex-row-reverse" : ""
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                        msg.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                      )}
                    >
                      {msg.sender === "user" ? "أ" : <Brain className="w-5 h-5" />}
                    </div>
                    <div
                      className={cn(
                        "flex-1 px-4 py-3 rounded-2xl whitespace-pre-wrap",
                        msg.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-200"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center">
                      <Brain className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 rounded-xl"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default UnifiedAIAssistant;
