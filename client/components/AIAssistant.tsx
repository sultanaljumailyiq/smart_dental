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
    prompt: "اق��رح خ��ة علاج شاملة للحالة المعروضة",
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
  {
    text: "إنشاء ملخص علاج للمريض",
    category: "تقارير",
    icon: "📋",
  },
  {
    text: "توصيات للرعاية الوقائية",
    category: "وقاية",
    icon: "🛡️",
  },
];

const AIAssistant = () => {
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
• تحليل تاري�� المرضى
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

**النتا��ج التشخيصية:**
• **السن رقم 14**: تكوين تسوس محتمل في السطح البعيد
• **السن رقم 26**: علامات مبكرة لفقدان العظم حول الجذر
• **التقييم العام**: كثافة عظمية جي��ة، لا مخاوف فورية

**درجة الثقة**: ${confidence}%
**وقت المعالجة**: 1.7 ثانية
**النموذج المستخدم**: DentalVision AI v3.2

**الإجراءات الموصى بها:**
✅ حشوة مركبة للسن رقم 14 (أولوية عالية)
✅ تنظيف عميق لمنطقة السن رقم 26
✅ متابعة خلال 3 أشهر
⚠️ مراقبة التطور

**تكلفة متوقعة**: 450-650 د.ع
**مدة العلاج**: 2-3 جلسات

هل تريد مني إنشاء خطة علاج تفصيلية؟`;
    } else if (lowerInput.includes("علاج") || lowerInput.includes("خطة")) {
      type = "treatment";
      response = `📋 **خطة العلاج الذكية**

**المرحلة الأولى - العلاج الفوري (الأسبوع الأول):**
🔸 استشارة تشخيصية - 30 دقيقة
🔸 أشعة رقمية حسب الحاجة
🔸 إدارة الألم إذا لزم الأمر
🔸 تنظيف أولي

**المرحلة الثانية - العلاج الأساسي (2-4 أسابيع):**
🔸 إجراءات العلاج الرئيسية
🔸 الأعمال التعويضية المطلوبة
🔸 معالجة لبية إذا احتيج
🔸 حشوات مؤقتة أو دائمة

**المرحلة الثال��ة - المتابعة (3-6 أشهر):**
🔸 فحوصات المتابعة
🔸 جدولة الرعاية الوقائية
🔸 مواعيد الصيانة

**التكلفة المتوقعة**: 1,200-1,800 د.ع
**تغطية التأمين**: 70-85%
**مدة العلاج الإجمالية**: 4-8 أسابيع

**احتمالية النجاح**: 96.3%`;
    } else if (lowerInput.includes("موعد") || lowerInput.includes("جدولة")) {
      type = "suggestion";
      response = `📅 **نظام الجدولة الذكي**

**تحليل الأوقات المثلى:**
🕒 **اليوم**: 14:30 - فتحة طارئة متاحة
🕒 **غداً**: 10:00, 14:00, 16:30
🕒 **هذا الأسبوع**: 12 موعد متاح

**توصيات الذكاء الاصطناعي:**
✨ المواعيد الصباحية تُظهر نتائج أفضل ��ـ 18%
✨ د. سمير لديه أعلى معدل نجاح لهذا النوع من العلاج
✨ المريض يفضل عادة المواعيد بعد الظهر
✨ الثلاث��ء والخميس أفضل أيام للمتابعة

**الموعد الأمثل المقترح:**
📅 **الخميس 14 ديسمبر**
🕐 **الساعة 10:00 صباحاً**
👨‍⚕️ **مع د. سمير أحمد**
⏱️ **مدة الجلسة**: 45 دقيقة

**معدل الحضور المتوقع**: 94%
**رضا المريض المتوقع**: 4.8/5

هل تريد تأكيد هذا الموعد؟`;
    } else if (lowerInput.includes("دواء") || lowerInput.includes("تفاعل")) {
      type = "analysis";
      response = `💊 **فحص التفاعلات الدوائية الذكي**

**تحليل مكتمل - نتائج آمنة ✅**

**الأدوية الحالية:**
🔹 أموكسيسيلين 500 مجم - آمن للإجراءات السنية
🔹 إيبوبروفين 400 مجم - لا تفاعلات مكتشفة
🔹 باراسيتامول 500 مجم - استخدام آمن

**التحقق من السلامة:**
✅ لا توجد موانع رئيسية
⚠️ اعتبارات طفيفة:
   • مراقبة ردود الفعل التحسسية
   • فحص وظائف الكلى دورياً

**التوصيات:**
📌 استمرار المضادات الحيوية كما هو مو��وف
📌 النظر في المكملات البروبيوتيكية
📌 شرب كمية كافية من الماء

**تعديلات الجرعة:**
❌ غير مطلوبة للإجراءات السنية العادية

**درجة الأمان**: 98.5%
**آخر تحديث لقاعدة البيانات**: اليوم`;
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

⚡ **الذكاء المتطور:**
• معالجة 10,000 حالة/ثانية
• دقة تشخيص 97.8%
• تحديث مستمر للمعرفة الطبية
• دعم 15 لغة مختلفة

**الأنظمة المتكاملة:**
🔗 نظام إدارة ��لعيادة
🔗 قواعد البيانات الطبية
🔗 أنظمة التصوير الطبي
🔗 شبكات الذكاء الاصطناعي العالمية

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

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Suggestions floating outside */}
        <div className="absolute bottom-16 right-0 mb-4 space-y-2">
          {predefinedQuestions.slice(0, 3).map((question, index) => (
            <div
              key={index}
              className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-gray-200 text-xs text-gray-700 whitespace-nowrap max-w-[200px] cursor-pointer hover:bg-blue-50 transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => {
                setIsOpen(true);
                handleQuestionClick(question.text);
              }}
            >
              <div className="flex items-center gap-2">
                <span>{question.icon}</span>
                <span className="truncate">{question.text}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="group relative overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full animate-pulse"></div>

          {/* Main Button - Made Smaller */}
          <div className="relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:scale-105">
            <div className="relative">
              <Brain className="w-5 h-5 animate-bounce" />
              <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-ping" />
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-sm">AI</span>
              <span className="text-xs text-blue-100">متصل</span>
            </div>

            <div
              className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                getStatusColor(),
              )}
            ></div>
          </div>

          {/* Floating Particles */}
          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-150"></div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={cn(
          "bg-white rounded-3xl shadow-2xl border border-gray-200 transition-all duration-500 backdrop-blur-xl bg-white/95",
          isMinimized
            ? "w-80 h-20"
            : isExpanded
              ? "w-[500px] h-[750px]"
              : "w-[420px] h-[680px]",
          "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-r before:from-blue-500/10 before:via-purple-500/10 before:to-indigo-500/10",
          "after:absolute after:inset-0 after:rounded-3xl after:bg-gradient-to-t after:from-black/5 after:to-transparent",
          // تحسين الموقع للشاشات الصغيرة
          "max-w-[95vw] max-h-[90vh]",
          // ضمان عدم التداخل مع العناصر الأخرى والتموضع الصحيح
          isExpanded ? "fixed bottom-4 right-4" : "relative",
          // تحسين ال��لال والعمق
          "shadow-xl border-gray-300/50",
          // تأثيرات متقدمة
          "ring-1 ring-black/5",
          // منع الفيض
          "overflow-hidden",
        )}
      >
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-t-3xl">
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
            {/* Quick Actions - Improved and Activated */}
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

            {/* Messages */}
            <div
              className={cn(
                "flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth",
                "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100",
                isExpanded ? "h-[480px]" : "h-[380px]",
                // ت��سين للشاشات الصغيرة
                "max-h-[60vh] min-h-[250px]",
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
                      // تحسين للشاشات الصغيرة
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

            {/* Quick Questions - Redesigned */}
            <div className="px-4 pb-3 border-b border-gray-100">
              <div className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>اقتراحات ذكية</span>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent"></div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {predefinedQuestions.slice(0, 2).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(question.text)}
                    className="group w-full text-xs bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-gray-700 px-4 py-3 rounded-2xl hover:from-blue-100 hover:via-indigo-100 hover:to-purple-100 transition-all hover:scale-[1.02] border border-blue-200/50 hover:border-blue-300 flex items-center gap-3 text-right hover:shadow-lg"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-base group-hover:scale-110 transition-transform">
                      {question.icon}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
                        {question.text}
                      </span>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {question.category}
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors flex items-center justify-center">
                      <Send className="w-3 h-3 text-blue-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="اسأل عن التشخيص، العلاج، ��لجدول��، أو أي موضوع طبي..."
                    className={cn(
                      "w-full px-4 py-3 pr-16 border-2 border-gray-300 rounded-2xl",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      "bg-white shadow-sm transition-all duration-200",
                      "hover:border-blue-400 hover:shadow-md",
                      "placeholder:text-gray-500 text-right",
                      // تحسين للشاشات الصغيرة
                      "text-sm sm:text-base",
                    )}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <button
                      onClick={() => setIsListening(!isListening)}
                      className={cn(
                        "p-1.5 rounded-xl transition-colors",
                        isListening
                          ? "bg-red-100 text-red-600"
                          : "hover:bg-gray-100 text-gray-400",
                      )}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      accept="image/*,.pdf,.doc,.docx"
                      className="hidden"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || !isConnected}
                  className={cn(
                    "bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-2xl",
                    "hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl",
                    "transform hover:scale-105 active:scale-95",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    // تحسين للشاشات الصغيرة
                    "p-2.5 sm:p-3",
                  )}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Status Bar */}
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full animate-pulse",
                      getStatusColor(),
                    )}
                  ></div>
                  <span className="font-medium">{getStatusText()}</span>
                  {isConnected && (
                    <Database className="w-3 h-3 text-green-500 animate-pulse" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">مدعوم بـ DentalGPT Pro</span>
                  <Shield className="w-3 h-3 text-blue-500" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
