import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Brain,
  Stethoscope,
  Calendar,
  FileText,
  Mic,
  Image,
  Minimize2,
  Maximize2,
  Bot,
  Zap,
  Eye,
  Activity,
  Shield,
  Clock,
  TrendingUp,
  Heart,
  Camera,
  Upload,
  Settings,
  HelpCircle,
  Star,
  Volume2,
  VolumeX,
  RotateCcw,
  Copy,
  Download,
  Share2,
  BookOpen,
  Lightbulb,
  Target,
  Award,
  Cpu,
  Database,
  Wifi,
  WifiOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?:
    | "text"
    | "suggestion"
    | "analysis"
    | "diagnosis"
    | "treatment"
    | "urgent";
  confidence?: number;
  attachments?: string[];
  metadata?: {
    processingTime?: number;
    aiModel?: string;
    accuracy?: number;
  };
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  prompt: string;
  category: "diagnostic" | "treatment" | "administrative" | "emergency";
}

const quickActions: QuickAction[] = [
  {
    id: "xray-analysis",
    label: "تحليل الأشعة",
    icon: Eye,
    color: "bg-blue-500",
    prompt: "قم بتحليل هذه الصورة الشعاعية وحدد أي مشاكل محتملة",
    category: "diagnostic",
  },
  {
    id: "treatment-plan",
    label: "خطة العلاج",
    icon: FileText,
    color: "bg-green-500",
    prompt: "اقترح خطة علاج شاملة للحالة المعروضة",
    category: "treatment",
  },
  {
    id: "appointment",
    label: "حجز موعد",
    icon: Calendar,
    color: "bg-purple-500",
    prompt: "ساعدني في إيجاد أنسب موعد للمريض",
    category: "administrative",
  },
  {
    id: "emergency",
    label: "حالة طارئة",
    icon: Zap,
    color: "bg-red-500",
    prompt: "أحتاج مساعدة عاجلة في حالة طارئة",
    category: "emergency",
  },
  {
    id: "drug-check",
    label: "فحص الأدوية",
    icon: Shield,
    color: "bg-indigo-500",
    prompt: "تحقق من التفاعلات الدوائية والجرعات",
    category: "diagnostic",
  },
  {
    id: "patient-history",
    label: "تاريخ المريض",
    icon: Activity,
    color: "bg-orange-500",
    prompt: "اعرض ملخص شامل لتاريخ المريض الطبي",
    category: "administrative",
  },
];

const predefinedQuestions = [
  {
    text: "تحليل صورة أشعة سينية للأسنان",
    category: "تشخيص",
    icon: "🔍",
  },
  {
    text: "اقتراح خطة علاج لتسوس الأسنان",
    category: "علاج",
    icon: "💊",
  },
  {
    text: "جدولة أفضل أوقات المواعيد",
    category: "إدارة",
    icon: "📅",
  },
  {
    text: "فحص التفاعلات الدوائية",
    category: "أمان",
    icon: "⚕️",
  },
];

const AIAssistantFixed = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMode, setCurrentMode] = useState<
    "chat" | "analysis" | "planning"
  >("chat");
  const [isListening, setIsListening] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [aiStatus, setAiStatus] = useState<
    "ready" | "thinking" | "analyzing" | "offline"
  >("ready");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `مرحباً! أنا مساعدك الذكي المتخصص في طب الأسنان 🦷

**يمكنني مساعدتك في:**
• تحليل الصور الشعاعية والتشخيص
• وضع خطط العلاج المخصصة  
• إدارة المواعيد والجدولة
• فحص التفاعلات الدوائية
• تحليل تاريخ المرضى
• تقديم التوصيات العلاجية

**الذكاء الاصطناعي المتقدم:**
✨ دقة تشخيص 97.8%
🚀 معالجة فورية للبيانات
🔒 حماية كاملة للخصوصية
📊 تحليل متقدم للحالات

كيف يمكنني مساعدتك اليوم؟`,
      sender: "ai",
      timestamp: new Date(),
      type: "text",
      confidence: 100,
      metadata: {
        aiModel: "DentalGPT-Pro v2.1",
        processingTime: 0.3,
      },
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setAiStatus("thinking");
    setIsTyping(true);

    // Simulate AI processing time
    const processingTime = Math.random() * 2000 + 1000;

    setTimeout(() => {
      const aiResponse = generateAIResponse(textToSend);
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
      setAiStatus("ready");
    }, processingTime);
  };

  const generateAIResponse = (userInput: string): Message => {
    const lowerInput = userInput.toLowerCase();
    let response = "";
    let type: Message["type"] = "text";
    let confidence = Math.floor(Math.random() * 15) + 85; // 85-100%

    if (
      lowerInput.includes("أشعة") ||
      lowerInput.includes("تحليل") ||
      lowerInput.includes("صورة")
    ) {
      type = "diagnosis";
      response = `🔍 **تحليل الذكاء الاصطناعي للصورة الشعاعية**

**النتائج التشخيصية:**
• **السن رقم 14**: تكوين تسوس محتمل في السطح البعيد
• **السن رقم 26**: علامات مبكرة لفقدان العظم حول الجذر
• **التقييم العام**: كثافة عظمية جيدة، لا مخاوف فورية

**درجة الثقة**: ${confidence}%
**وقت المعالجة**: 1.7 ثانية
**النموذج المستخدم**: DentalVision AI v3.2

**الإجراءات الموصى بها:**
✅ حشوة مركبة للسن رقم 14 (أولوية عالية)
✅ تنظيف عميق لمنطقة السن رقم 26
✅ متابعة خلال 3 أشهر
⚠️ مراقبة التط��ر

**تكلفة متوقعة**: 450-650 د.ع
**مدة العلاج**: 2-3 جلسات

هل تريد مني إنشاء خطة علاج تفصيلية؟`;
    } else {
      response = `🤖 **المساعد الذكي - DentalGPT Pro**

أفهم أنك تسأل عن "${userInput}".

**خدماتي المتقدمة:**

🔍 **التشخيص الذكي**
• تحليل الصور الشعاعية والفوتوغرافية
• كشف التسوس والمشاكل مبكراً
• تقييم صحة اللثة والأنسجة

🎯 **التخطيط العلاجي**
• خطط علاج مخصصة ومدروسة
• توقعات دقيقة للنتائج
• تحديد الأولويات العلاجية

📊 **إدارة المرضى**
• تحليل المخاطر والامتثال
• تتبع تاريخ العلاج
• توقع احتياجات المريض

هل تود أن أبدأ بتحليل حالة معينة أو مساعدتك في مهمة محددة؟`;
    }

    return {
      id: Date.now().toString(),
      content: response,
      sender: "ai",
      timestamp: new Date(),
      type,
      confidence,
      metadata: {
        processingTime: Math.random() * 2 + 0.5,
        aiModel: "DentalGPT-Pro v2.1",
        accuracy: confidence,
      },
    };
  };

  const handleQuestionClick = (question: string) => {
    setInputValue(question);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileName = files[0].name;
      const userMessage: Message = {
        id: Date.now().toString(),
        content: `تم رفع الملف: ${fileName}`,
        sender: "user",
        timestamp: new Date(),
        type: "text",
        attachments: [fileName],
      };
      setMessages((prev) => [...prev, userMessage]);
    }
  };

  const getStatusColor = () => {
    switch (aiStatus) {
      case "ready":
        return "bg-green-400";
      case "thinking":
        return "bg-yellow-400 animate-pulse";
      case "analyzing":
        return "bg-blue-400 animate-pulse";
      case "offline":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = () => {
    switch (aiStatus) {
      case "ready":
        return "جاهز للمساعدة";
      case "thinking":
        return "جاري التفكير...";
      case "analyzing":
        return "جاري التحليل...";
      case "offline":
        return "غير متصل";
      default:
        return "حالة غير معروفة";
    }
  };

  // الزر العائم مع الاقتراحات خارج البطاقة
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* الاقتراحات العائمة خارج البطاقة */}
        <div className="absolute bottom-20 right-0 mb-2 space-y-2 animate-fade-in">
          {predefinedQuestions.slice(0, 3).map((question, index) => (
            <div
              key={index}
              className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border border-gray-200/50 text-sm text-gray-700 max-w-[280px] cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 transform hover:scale-105"
              style={{
                animationDelay: `${index * 200}ms`,
                transform: `translateX(${index % 2 === 0 ? "-10px" : "10px"})`,
              }}
              onClick={() => {
                setIsOpen(true);
                handleQuestionClick(question.text);
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-base flex-shrink-0">
                  {question.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 text-right leading-snug">
                    {question.text}
                  </div>
                  <div className="text-xs text-blue-600 mt-1 font-medium">
                    {question.category}
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Send className="w-3 h-3 text-blue-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* الزر العائم المصغر */}
        <button
          onClick={() => setIsOpen(true)}
          className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 active:scale-95"
        >
          {/* الخلفية المتحركة */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>

          {/* المحتوى */}
          <div className="relative flex items-center gap-2">
            <div className="relative">
              <Brain className="w-6 h-6 animate-pulse" />
              <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-ping" />
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-sm">مساعد AI</span>
              <span className="text-xs text-blue-100">دائماً هنا لمساعدتك</span>
            </div>

            <div
              className={cn(
                "w-3 h-3 rounded-full animate-pulse shadow-lg",
                getStatusColor(),
              )}
            ></div>
          </div>

          {/* الجسيمات العائمة */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping delay-300"></div>
        </button>
      </div>
    );
  }

  // النافذة الرئيسية للمساعد الذكي
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={cn(
          "bg-white rounded-3xl shadow-2xl border border-gray-200/50 transition-all duration-500 backdrop-blur-xl bg-white/95",
          isMinimized
            ? "w-80 h-20"
            : isExpanded
              ? "w-[550px] h-[800px]"
              : "w-[450px] h-[720px]",
          "overflow-hidden ring-1 ring-black/5",
        )}
      >
        {/* العنوان */}
        <div className="relative z-10 flex items-center justify-between p-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div
                className={cn(
                  "absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm",
                  getStatusColor(),
                )}
              ></div>
              {isConnected ? (
                <Wifi className="absolute -bottom-1 -left-1 w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="absolute -bottom-1 -left-1 w-4 h-4 text-red-500" />
              )}
            </div>
            {!isMinimized && (
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  مساعد الذكاء الاصطناعي
                  <span className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-0.5 rounded-full">
                    Pro
                  </span>
                </h3>
                <p className="text-xs text-gray-600 flex items-center gap-2">
                  <span>{getStatusText()}</span>
                  <span className="text-green-600">• DentalGPT v2.1</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isMinimized && (
              <>
                <button
                  onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                  className="p-2 hover:bg-white/70 rounded-xl transition-colors"
                  title={isSoundEnabled ? "كتم الصوت" : "تشغيل الصوت"}
                >
                  {isSoundEnabled ? (
                    <Volume2 className="w-4 h-4 text-gray-600" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-white/70 rounded-xl transition-colors"
                  title={isExpanded ? "تصغير" : "توسيع"}
                >
                  {isExpanded ? (
                    <Minimize2 className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </>
            )}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/70 rounded-xl transition-colors"
              title={isMinimized ? "توسيع" : "تصغير"}
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4 text-gray-600" />
              ) : (
                <Minimize2 className="w-4 h-4 text-gray-600" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-red-50 rounded-xl transition-colors group"
            >
              <X className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* الإجراءات السريعة */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="text-xs font-semibold text-gray-600 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                الإجراءات السريعة:
              </div>
              <div className="grid grid-cols-3 gap-2">
                {quickActions.slice(0, 6).map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => {
                        handleSendMessage(action.prompt);
                      }}
                      className={cn(
                        "flex flex-col items-center gap-1 p-3 rounded-xl transition-all hover:scale-105 transform active:scale-95",
                        action.color,
                        "text-white shadow-lg hover:shadow-xl border border-white/20",
                        "hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium text-center leading-tight">
                        {action.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* منطقة الرسائل */}
            <div
              className={cn(
                "flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth",
                "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100",
                isExpanded ? "h-[520px]" : "h-[420px]",
                "max-h-[60vh] min-h-[300px]",
              )}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm relative",
                      "transition-all duration-200 hover:shadow-md",
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-gradient-to-r from-gray-50 to-blue-50 text-gray-900 border border-gray-200 shadow-sm hover:border-blue-300",
                      "max-w-[90%] sm:max-w-[85%]",
                    )}
                  >
                    {message.sender === "ai" && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-bold text-blue-600">
                          DentalGPT Pro
                        </span>
                        {message.confidence && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            {message.confidence}% دقة
                          </span>
                        )}
                      </div>
                    )}

                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>

                    {message.attachments && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.attachments.map((attachment, index) => (
                          <span
                            key={index}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                          >
                            📎 {attachment}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                      <div
                        className={cn(
                          "text-xs opacity-70 flex items-center gap-2",
                          message.sender === "user"
                            ? "text-blue-100"
                            : "text-gray-500",
                        )}
                      >
                        <Clock className="w-3 h-3" />
                        {message.timestamp.toLocaleTimeString()}
                        {message.metadata?.processingTime && (
                          <span>
                            • {message.metadata.processingTime.toFixed(1)}s
                          </span>
                        )}
                      </div>

                      {message.sender === "ai" && (
                        <div className="flex items-center gap-1">
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <Copy className="w-3 h-3 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <Share2 className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl px-4 py-3 text-sm border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                      </div>
                      <span className="text-gray-600">
                        الذكاء الاصطناعي يحلل...
                      </span>
                      <Cpu className="w-4 h-4 text-blue-500 animate-spin" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* منطقة الإدخال المحسنة */}
            <div className="bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50 border-t border-gray-200">
              {/* عنوان منطقة الإدخال */}
              <div className="px-4 pt-3 pb-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">أكتب رسالتك أو أرفق ملف</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                  <div
                    className={cn(
                      "flex items-center gap-1",
                      isConnected ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {isConnected ? (
                      <Wifi className="w-3 h-3" />
                    ) : (
                      <WifiOff className="w-3 h-3" />
                    )}
                    <span className="text-xs">
                      {isConnected ? "متصل" : "غير متصل"}
                    </span>
                  </div>
                </div>
              </div>

              {/* منطقة الإدخال الرئيسية */}
              <div className="px-4 pb-4">
                <div className="relative">
                  <div className="relative bg-white rounded-3xl shadow-lg border-2 border-gray-300 hover:border-blue-400 focus-within:border-blue-500 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-3xl"></div>

                    {/* حقل الإدخال النصي */}
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="💬 اكتب سؤالك عن التشخيص، العلاج، الجدولة، أو أي موضوع طبي...&#10;✨ يمكنك أيضاً إرفاق صور أو ملفات للتحليل (Shift+Enter للسطر الجديد)"
                      className={cn(
                        "relative z-10 w-full px-6 py-4 pr-20 pl-20 bg-transparent",
                        "resize-none border-0 focus:outline-none",
                        "placeholder:text-gray-500 text-right text-sm leading-relaxed",
                        "min-h-[80px] max-h-[160px]",
                      )}
                      rows={3}
                    />

                    {/* أدوات الجانب الأيسر */}
                    <div className="absolute left-3 bottom-3 flex items-center gap-2">
                      <button
                        onClick={() => setIsListening(!isListening)}
                        className={cn(
                          "p-2.5 rounded-2xl transition-all duration-200 group",
                          isListening
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "hover:bg-blue-100 text-gray-500 hover:text-blue-600",
                        )}
                        title={
                          isListening
                            ? "إيقاف التسجيل الصوتي"
                            : "بدء التسجيل الصوتي"
                        }
                      >
                        <Mic
                          className={cn(
                            "w-4 h-4",
                            isListening && "animate-pulse",
                          )}
                        />
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2.5 hover:bg-blue-100 rounded-2xl transition-all duration-200 text-gray-500 hover:text-blue-600 group"
                        title="إرفاق ملف أو صورة للتحليل"
                      >
                        <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        accept="image/*,.pdf,.doc,.docx"
                        multiple
                        className="hidden"
                      />
                    </div>

                    {/* زر الإرسال */}
                    <div className="absolute right-3 bottom-3">
                      <button
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim() || !isConnected}
                        className={cn(
                          "bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-2xl",
                          "hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl",
                          "transform hover:scale-105 active:scale-95 group",
                          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        )}
                        title="إرسال الرسالة (Enter)"
                      >
                        <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* معلومات الإدخال */}
                <div className="flex items-center justify-between mt-3 px-2">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      جاهز للإرسال
                    </span>
                    <span>•</span>
                    <span>Enter للإرسال | Shift+Enter سطر جديد</span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    {inputValue.length}/2000
                  </div>
                </div>
              </div>

              {/* شريط الحالة المحسن */}
              <div className="px-4 pb-3 border-t border-gray-200/30">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="flex items-center gap-1">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full animate-pulse",
                          getStatusColor(),
                        )}
                      ></div>
                      <span className="font-medium">{getStatusText()}</span>
                    </div>
                    {isConnected && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Database className="w-3 h-3 animate-pulse" />
                        <span>قاعدة بيانات محدثة</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Shield className="w-3 h-3" />
                    <span className="font-medium">مدعوم بـ DentalGPT Pro</span>
                    <Star className="w-3 h-3 text-yellow-500" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIAssistantFixed;
