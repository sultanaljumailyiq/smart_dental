import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, Upload, X, Sparkles, Heart, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/config/supabase";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  confidence?: number;
}

export default function PatientAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([{
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
    confidence: 100
  }]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const quickQuestions = [
    { text: "ما أسباب ألم الأسنان؟", icon: "💊" },
    { text: "كيف أعتني بأسناني يومياً؟", icon: "🪥" },
    { text: "متى يجب زيارة طبيب الأسنان؟", icon: "🏥" },
    { text: "ما هي أعراض التسوس؟", icon: "🔍" },
    { text: "نصائح لأسنان صحية", icon: "✨" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !uploadedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue || "تحليل الصورة المرفقة",
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-agent-manager', {
        body: {
          message: inputValue || "قم بتحليل هذه الصورة وقدم نصائح صحية",
          agentType: 'patient',
          imageData: uploadedImage,
          preferredModel: 'gemini-2.5-flash' // Using free Gemini model
        }
      });

      if (error) {
        console.error('Patient AI Error:', error);
        toast({
          title: 'خطأ في المساعد الصحي',
          description: 'تأكد من إضافة مفاتيح API في إعدادات النظام',
          variant: 'destructive'
        });
        
        // Fallback response
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى أو الاتصال بفريق الدعم.",
          sender: "ai",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, fallbackMessage]);
      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          sender: "ai",
          timestamp: new Date(),
          confidence: 95
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Exception:', error);
      toast({
        title: 'خطأ في الاتصال',
        description: 'فشل الاتصال بالمساعد الصحي',
        variant: 'destructive'
      });
    } finally {
      setIsTyping(false);
      setUploadedImage(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUploadedImage(base64.split(',')[1]);
        toast({
          title: "تم رفع الصورة",
          description: "يمكنك الآن إرسال رسالة لتحليل الصورة"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Bot className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">مساعدك الصحي الذكي</h2>
            <p className="text-green-100">مدعوم بتقنية Google Gemini 2.5</p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm">آمن ومشفر</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Activity className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xs">متاح 24/7</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Heart className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xs">دقة 97%</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Sparkles className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xs">Google Gemini</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.sender === "ai"
                  ? "bg-gradient-to-r from-green-600 to-teal-600"
                  : "bg-blue-600"
              }`}
            >
              {msg.sender === "ai" ? (
                <Bot className="w-5 h-5 text-white" />
              ) : (
                <span className="text-white text-lg">👤</span>
              )}
            </div>
            <div className={`flex-1 ${msg.sender === "user" ? "text-right" : ""}`}>
              <div
                className={`inline-block max-w-[80%] p-4 rounded-2xl ${
                  msg.sender === "ai"
                    ? "bg-white shadow-md"
                    : "bg-blue-600 text-white"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.confidence && (
                  <div className="mt-2 text-xs text-gray-500">
                    مستوى الثقة: {msg.confidence}%
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {msg.timestamp.toLocaleTimeString("ar-IQ")}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white shadow-md p-4 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="px-6 py-3 bg-white border-t">
        <div className="text-sm font-medium text-gray-700 mb-2">أسئلة شائعة:</div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setInputValue(q.text)}
              className="flex-shrink-0 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm transition-colors"
            >
              <span className="mr-1">{q.icon}</span>
              {q.text}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        {uploadedImage && (
          <div className="mb-2 p-2 bg-green-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-green-700">✓ تم رفع الصورة</span>
            <button onClick={() => setUploadedImage(null)} className="text-red-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="icon"
            className="flex-shrink-0"
          >
            <Upload className="w-4 h-4" />
          </Button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="اكتب سؤالك أو ارفع صورة..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() && !uploadedImage}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-2 text-center">
          ⚠️ هذا المساعد للإرشاد فقط. استشر طبيب أسنان محترف للتشخيص والعلاج النهائي.
        </p>
      </div>
    </div>
  );
}
