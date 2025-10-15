import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Bot,
  Send,
  X,
  Trash2,
  Stethoscope,
  FileText,
  ClipboardCheck,
  Sparkles,
  Brain,
  ChevronDown,
  Minimize2,
  Maximize2,
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
  actionType?: string;
}

const DentistAIAssistant: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { sendMessage, isLoading } = useAIDentalAssistant({
    agentType: "clinic",
    preferredModel: "gemini-2.5-flash",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
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
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    {
      label: "مساعدة تشخيصية",
      icon: Stethoscope,
      prompt: "أحتاج مساعدة في تشخيص حالة سريرية",
      color: "blue",
    },
    {
      label: "خطة علاجية",
      icon: FileText,
      prompt: "ساعدني في وضع خطة علاجية",
      color: "purple",
    },
    {
      label: "مراجعة حالة",
      icon: ClipboardCheck,
      prompt: "أريد مراجعة حالة معقدة والحصول على رأي ثانٍ",
      color: "indigo",
    },
  ];

  const shouldShow = () => {
    const path = location.pathname;
    return (
      path.startsWith("/dentist-hub") ||
      path.startsWith("/clinic_old") ||
      path.startsWith("/clinic/") ||
      path.startsWith("/smart-clinic-")
    );
  };

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

    try {
      const response = await sendMessage(textToSend, undefined, undefined, "clinic");

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

**تحليل أولي:**
بناءً على الحالة المذكورة، إليك بعض النقاط المهمة:

1. **التقييم السريري:** يُنصح بفحص شامل للحالة
2. **الخيارات العلاجية:** هناك عدة خيارات متاحة حسب شدة الحالة
3. **المتابعة:** يُفضل المتابعة الدورية لتقييم النتائج

⚠️ ملاحظة: هذه توصيات عامة. يرجى الاعتماد على تقييمك السريري المباشر.

هل تريد مزيداً من التفاصيل حول نقطة معينة؟`,
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

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        content: `تم مسح المحادثة. كيف يمكنني مساعدتك؟`,
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
    toast({
      title: "تم مسح المحادثة",
      description: "يمكنك بدء محادثة جديدة الآن",
    });
  };

  if (!shouldShow()) {
    return null;
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 md:right-8 z-50 group"
          aria-label="فتح المساعد الذكي"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95">
              <Bot className="w-7 h-7 md:w-8 md:h-8 text-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            مساعد سريري ذكي
          </div>
        </button>
      )}

      {isOpen && (
        <div
          className={cn(
            "fixed z-50 transition-all duration-300",
            isMobile
              ? "inset-0 bg-white"
              : isMinimized
                ? "bottom-6 right-6 w-80 h-16 bg-white rounded-2xl shadow-xl border border-gray-200"
                : "bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-xl border border-gray-200"
          )}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">مساعد سريري ذكي</h3>
                <p className="text-xs text-blue-100">دعم القرار السريري</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isMobile && (
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label={isMinimized ? "تكبير" : "تصغير"}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div
                className={cn(
                  "overflow-y-auto bg-gray-50 p-4 space-y-3",
                  isMobile ? "h-[calc(100vh-280px)]" : "h-[360px]"
                )}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-2",
                      msg.sender === "user" ? "flex-row-reverse" : ""
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        msg.sender === "ai"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                          : "bg-blue-600"
                      )}
                    >
                      {msg.sender === "ai" ? (
                        <Brain className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-white text-sm">د.</span>
                      )}
                    </div>
                    <div
                      className={cn(
                        "flex-1",
                        msg.sender === "user" ? "text-right" : ""
                      )}
                    >
                      <div
                        className={cn(
                          "inline-block max-w-[85%] p-3 rounded-xl text-sm",
                          msg.sender === "ai"
                            ? "bg-white shadow-sm border border-gray-100"
                            : "bg-blue-600 text-white"
                        )}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1 px-1">
                        {msg.timestamp.toLocaleTimeString("ar-IQ", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white shadow-sm border border-gray-100 p-3 rounded-xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-3 bg-white border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-medium text-gray-600">
                    إجراءات سريعة:
                  </div>
                  <button
                    onClick={handleClearChat}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    مسح المحادثة
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(action.prompt)}
                      className={cn(
                        "flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:shadow-md active:scale-95",
                        action.color === "blue" &&
                          "bg-blue-50 text-blue-700 hover:bg-blue-100",
                        action.color === "purple" &&
                          "bg-purple-50 text-purple-700 hover:bg-purple-100",
                        action.color === "indigo" &&
                          "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      )}
                    >
                      <action.icon className="w-3 h-3 inline-block ml-1" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="اكتب استفسارك السريري..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  مدعوم بتقنية Google Gemini • دعم قرار سريري
                </p>
              </div>
            </>
          )}

          {isMinimized && (
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsMinimized(false)}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  مساعد سريري ذكي
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          )}
        </div>
      )}

      {isOpen && isMobile && (
        <style>{`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .fixed.inset-0 {
            animation: slideUp 0.3s ease-out;
          }
        `}</style>
      )}
    </>
  );
};

export default DentistAIAssistant;
