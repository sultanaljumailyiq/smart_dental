import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageSquare,
  Send,
  Bot,
  User,
  Paperclip,
  Mic,
  MoreVertical,
  Smile,
  Image,
  Phone,
  Video,
  Heart,
  ThumbsUp,
  AlertCircle,
  Clock,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { VisitorHeader } from "@/components/VisitorHeader";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "image" | "suggestion";
  suggestions?: string[];
  reactions?: string[];
}

const quickSuggestions = [
  "أعاني من ألم في الأسنان",
  "كيف أعتني بأسناني؟", 
  "ما أسباب نزيف اللثة؟",
  "نصائح لتبييض الأسنان",
  "علاج رائحة الفم",
  "أحتاج طبيب أسنان قريب",
];

const aiResponses: Record<string, string> = {
  "أعاني من ألم في الأسنان": "أفهم أنك تعاني من ألم في الأسنان. يمكن أن يكون الألم مزعجاً جداً. هل يمكنك وصف نوع الألم؟ هل هو مستمر أم متقطع؟ وهل يزداد عند تناول المشروبات الباردة أو الساخنة؟",
  "كيف أعتني بأسناني؟": "العناية بالأسنان أمر مهم جداً! إليك أهم النصائح:\n\n1. نظف أسنانك مرتين يومياً بمعجون يحتوي على الفلورايد\n2. استخدم خيط الأسنان يومياً\n3. استخدم غسول الفم المطهر\n4. قلل من تناول السكريات\n5. راجع طبيب الأسنان كل 6 أشهر",
  "ما أسباب نزيف اللثة؟": "نزيف اللثة له عدة أسباب محتملة:\n\n• التهاب اللثة (السبب الأكثر شيوعاً)\n• تراكم الجير\n• تنظيف الأسنان بقوة زائدة\n• نقص فيتامين C\n• بعض الأدوية\n• التغيرات الهرمونية\n\nيُنصح بمراجعة طبيب الأسنان لتحديد السبب الدقيق.",
  "نص��ئح لتبييض الأسنان": "إليك طرق آمنة لتبييض الأسنان:\n\n✨ طرق طبيعية:\n• تنظيف منتظم بمعجون مبيض\n• تجنب المشروبات الملونة (قهوة، شاي)\n• تناول الفواكه كالفراولة والأناناس\n• المضمضة بزيت جوز الهند\n\n🏥 طرق طبية:\n• تبييض عند طبيب الأسنان\n• قوالب التبييض المخصصة\n\nتجنب الوصفات المنزلية القاسية!",
  "علاج رائحة الفم": "رائحة الفم الكريهة يمكن علاجها:\n\n🦷 نظافة الفم:\n• تنظيف اللسان يومياً\n• استخدام غسول فم مطهر\n• تنظيف الأسنان بعد كل وجبة\n\n🍃 نصائح أخرى:\n• شرب الماء بكثرة\n• تجنب الأطعمة ذات الرائحة القوية\n• علاج أي التهابات في الفم\n\nإذا استمرت المشكلة، راجع طبيب الأسنان.",
  "أحتاج طبيب أسنان قريب": "يمكنني مساعدتك في العثور على طبيب أسنان مناسب! \n\n🔍 ما نحتاجه:\n• موقعك الحالي\n• نوع العلاج المطلوب\n• التأمين الطبي (��ن وجد)\n• الوقت المناسب للموعد\n\nهل تريد البحث عن عيادات قريبة منك الآن؟",
};

export default function SmartChat() {
  const { language } = useI18n();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "مرحباً! أنا مساعدك الذكي لطب الأسنان. كيف يمكنني مساعدتك اليوم؟",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
      suggestions: quickSuggestions.slice(0, 3),
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // إضافة رسالة المستخدم
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // محاكاة تأخير الرد
    setTimeout(() => {
      const aiResponse = aiResponses[text] || 
        "شكراً لك على سؤالك. سأحتاج إلى مزيد من التفاصيل لأتمكن من مساعدتك بشكل أفضل. هل يمكنك وصف حالتك أكثر؟";
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
        suggestions: text.includes("طبيب") ? ["البحث عن عيادات", "حجز موعد", "استشارة عاجلة"] : undefined,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const startRecording = () => {
    setIsRecording(true);
    // محاكاة التسجيل الصوتي
    setTimeout(() => {
      setIsRecording(false);
      sendMessage("تم تحويل الرسالة الصوتية: أعاني من ألم في الأسنان");
    }, 3000);
  };

  return (
    <>
      <VisitorHeader />
      <div className="min-h-screen bg-gray-50 pt-16" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Navigation */}
        <nav className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/medical-services"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
                <span>العودة للخدمات الطبية</span>
              </Link>
              
              <div className="w-px h-6 bg-gray-300"></div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  الدردشة الذكية
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>متاح الآن</span>
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-4rem)] flex flex-col">
        {/* Chat Header */}
        <div className="bg-white rounded-t-2xl shadow-sm p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                مساعد طب الأسنان الذكي
              </h3>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>نشط الآن</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <Video className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-white overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.sender === "ai" && (
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={cn(
                "max-w-md",
                message.sender === "user" ? "order-first" : ""
              )}>
                <div
                  className={cn(
                    "p-4 rounded-2xl",
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  )}
                >
                  <p className="whitespace-pre-line text-sm leading-relaxed">
                    {message.text}
                  </p>
                </div>
                
                {/* Quick Suggestions */}
                {message.suggestions && (
                  <div className="mt-3 space-y-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-right p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors text-sm border border-blue-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {formatTime(message.timestamp)}
                  </span>
                  {message.sender === "user" && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>

              {message.sender === "user" && (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions Bar */}
        <div className="bg-white border-t p-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex-shrink-0 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors border border-gray-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-b-2xl shadow-sm p-4 border-t">
          {isRecording && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-700 font-medium">جاري التسجيل...</span>
                <button
                  onClick={() => setIsRecording(false)}
                  className="mr-auto text-red-600 hover:text-red-700"
                >
                  إيقاف
                </button>
              </div>
            </div>
          )}

          <div className="flex items-end gap-3">
            <button className="p-3 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            
            <button className="p-3 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
              <Image className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب رسالتك هنا..."
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                disabled={isRecording}
              />
              <button className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700">
                <Smile className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => startRecording()}
              disabled={isRecording}
              className={cn(
                "p-3 rounded-xl transition-colors",
                isRecording
                  ? "bg-red-100 text-red-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              )}
            >
              <Mic className="w-5 h-5" />
            </button>

            <button
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isRecording}
              className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-amber-700 text-sm">
                هذا ��لمساعد الذكي يقدم معلومات عامة فقط ولا يغني عن استشارة طبيب مختص. 
                في حالات الطوارئ، يرجى الاتصال بالطوارئ فوراً.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
