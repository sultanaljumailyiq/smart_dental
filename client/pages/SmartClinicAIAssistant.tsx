import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SmartClinicSubNav from "@/components/SmartClinicSubNav";
import { useAIDentalAssistant } from "@/hooks/useAIDentalAssistant";
import { clinicDataIntegration } from "@/services/clinicDataIntegration";
import { sharedClinicData } from "@/services/sharedClinicData";
import {
  Bot,
  Send,
  Sparkles,
  Calendar,
  Users,
  Package,
  BarChart3,
  Building2,
  ChevronRight,
  Zap,
  Clock,
  TrendingUp,
  Heart,
  Loader2,
  MessageSquare,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  quickActions?: QuickAction[];
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  variant?: "primary" | "secondary" | "success" | "warning";
}

interface Clinic {
  id: string;
  name: string;
}

const SmartClinicAIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [availableClinics, setAvailableClinics] = useState<Clinic[]>([]);
  const [showClinicSelector, setShowClinicSelector] = useState(false);
  const [clinicData, setClinicData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { sendMessage, isLoading: aiLoading } = useAIDentalAssistant({
    clinicData,
    agentType: 'clinic',
    preferredModel: 'gemini-2.5-flash'
  });

  useEffect(() => {
    initializeAssistant();
  }, []);

  useEffect(() => {
    if (selectedClinic) {
      loadClinicData();
    }
  }, [selectedClinic]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeAssistant = async () => {
    const clinics = await loadClinics();
    
    if (clinics.length > 0) {
      setSelectedClinic(clinics[0]);
      
      setMessages([
        {
          id: "welcome",
          type: "assistant",
          content: `مرحباً بك في المساعد الذكي! 🤖\n\nأنا هنا لمساعدتك في إدارة عيادتك بكفاءة. يمكنني مساعدتك في:\n\n• إدارة المواعيد والحجوزات\n• متابعة المرضى وملفاتهم\n• تتبع طلبات المختبر\n• التقارير والإحصائيات المالية\n\nالعيادة المختارة: ${clinics[0].name}\n\nكيف يمكنني مساعدتك اليوم؟`,
          timestamp: new Date(),
          quickActions: getWelcomeActions(),
        },
      ]);
    }
  };

  const loadClinics = async (): Promise<Clinic[]> => {
    try {
      const clinicsData = await sharedClinicData.getClinics();
      
      if (clinicsData && clinicsData.length > 0) {
        const formattedClinics = clinicsData.map(c => ({
          id: c.id.toString(),
          name: c.name
        }));
        setAvailableClinics(formattedClinics);
        return formattedClinics;
      }
      
      const defaultClinics = [
        { id: "clinic-1", name: "العيادة الرئيسية" },
        { id: "clinic-2", name: "فرع المدينة" },
        { id: "clinic-3", name: "فرع الكرادة" },
      ];
      
      setAvailableClinics(defaultClinics);
      return defaultClinics;
    } catch (error) {
      console.error('Failed to load clinics:', error);
      const defaultClinics = [{ id: "clinic-1", name: "العيادة الرئيسية" }];
      setAvailableClinics(defaultClinics);
      return defaultClinics;
    }
  };

  const loadClinicData = async () => {
    if (!selectedClinic) return;
    
    try {
      const data = await clinicDataIntegration.getIntegratedData();
      setClinicData({
        ...data,
        clinicId: selectedClinic.id,
        clinicName: selectedClinic.name
      });
    } catch (error) {
      console.error('Failed to load clinic data:', error);
    }
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isTyping) return;

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

    try {
      const response = await sendMessage(messageToProcess);
      
      if (response?.response) {
        const quickActions = getContextualActions(messageToProcess);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: response.response,
          timestamp: new Date(),
          quickActions: quickActions.length > 0 ? quickActions : undefined,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('AI Error:', error);
      const response = generateSmartResponse(messageToProcess);
      setMessages((prev) => [...prev, response]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const generateSmartResponse = (message: string): Message => {
    const lowerMessage = message.toLowerCase();
    let content = "";
    let quickActions: QuickAction[] = [];

    if (lowerMessage.includes("موعد") || lowerMessage.includes("حجز")) {
      content = "يمكنك إدارة المواعيد بسهولة! لديك خيارات متعددة:\n\n• عرض مواعيد اليوم\n• إضافة موعد جديد\n• البحث عن موعد محدد\n• عرض المواعيد القادمة";
      quickActions = [
        {
          id: "view-appointments",
          label: "مواعيد اليوم",
          icon: Calendar,
          action: () => navigate("/clinic_old/reservations"),
          variant: "primary",
        },
        {
          id: "add-appointment",
          label: "حجز جديد",
          icon: Clock,
          action: () => navigate("/clinic_old/reservations"),
          variant: "secondary",
        },
      ];
    } else if (lowerMessage.includes("مريض") || lowerMessage.includes("مرضى")) {
      content = "نظام إدارة المرضى جاهز! يمكنني مساعدتك في:\n\n• البحث عن مريض\n• إضافة مريض جديد\n• عرض السجلات الطبية\n• متابعة خطط العلاج";
      quickActions = [
        {
          id: "patients-list",
          label: "قائمة المرضى",
          icon: Users,
          action: () => navigate("/clinic_old/patients"),
          variant: "primary",
        },
        {
          id: "add-patient",
          label: "مريض جديد",
          icon: Heart,
          action: () => navigate("/clinic_old/patients"),
          variant: "success",
        },
      ];
    } else if (lowerMessage.includes("مختبر") || lowerMessage.includes("تركيب")) {
      content = "إدارة المختبر والتركيبات:\n\n• تتبع الطلبات الحالية\n• إضافة طلب جديد\n• التواصل مع المختبرات\n• متابعة مواعيد التسليم";
      quickActions = [
        {
          id: "lab-orders",
          label: "طلبات المختبر",
          icon: Package,
          action: () => navigate("/clinic_old/lab"),
          variant: "primary",
        },
      ];
    } else if (lowerMessage.includes("تقرير") || lowerMessage.includes("إحصائ")) {
      content = "التقارير والإحصائيات المتاحة:\n\n• التقارير المالية\n• إحصائيات المرضى\n• تحليل الأداء\n• تقارير مخصصة";
      quickActions = [
        {
          id: "reports",
          label: "التقارير",
          icon: BarChart3,
          action: () => navigate("/clinic_old/reports"),
          variant: "primary",
        },
        {
          id: "stats",
          label: "الإحصائيات",
          icon: TrendingUp,
          action: () => navigate("/clinic_old/reports"),
          variant: "secondary",
        },
      ];
    } else {
      content = "يمكنني مساعدتك في العديد من المهام! اختر من الخيارات التالية أو اسألني عن:\n\n• المواعيد والحجوزات\n• إدارة المرضى\n• طلبات المختبر\n• التقارير المالية";
      quickActions = getWelcomeActions();
    }

    return {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content,
      timestamp: new Date(),
      quickActions,
    };
  };

  const getContextualActions = (message: string): QuickAction[] => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("موعد") || lowerMessage.includes("حجز")) {
      return [
        {
          id: "view-appointments",
          label: "مواعيد اليوم",
          icon: Calendar,
          action: () => navigate("/clinic_old/reservations"),
          variant: "primary",
        },
      ];
    } else if (lowerMessage.includes("مريض")) {
      return [
        {
          id: "patients-list",
          label: "قائمة المرضى",
          icon: Users,
          action: () => navigate("/clinic_old/patients"),
          variant: "primary",
        },
      ];
    }
    
    return [];
  };

  const getWelcomeActions = (): QuickAction[] => [
    {
      id: "appointments",
      label: "المواعيد",
      icon: Calendar,
      action: () => navigate("/clinic_old/reservations"),
      variant: "primary",
    },
    {
      id: "patients",
      label: "المرضى",
      icon: Users,
      action: () => navigate("/clinic_old/patients"),
      variant: "secondary",
    },
    {
      id: "lab",
      label: "المختبر",
      icon: Package,
      action: () => navigate("/clinic_old/lab"),
      variant: "secondary",
    },
    {
      id: "reports",
      label: "التقارير",
      icon: BarChart3,
      action: () => navigate("/clinic_old/reports"),
      variant: "secondary",
    },
  ];

  const getActionVariantClass = (variant?: string) => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700";
      case "success":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700";
      case "warning":
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  const handleQuickMessage = (text: string) => {
    setCurrentMessage(text);
    inputRef.current?.focus();
  };

  const quickSuggestions = [
    { icon: Calendar, text: "مواعيد اليوم" },
    { icon: Users, text: "قائمة المرضى" },
    { icon: Package, text: "طلبات المختبر" },
    { icon: BarChart3, text: "التقرير المالي" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <SmartClinicSubNav />

        {/* Mobile-First Chat Container */}
        <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] bg-white md:mx-4 md:rounded-2xl md:shadow-xl overflow-hidden">
          
          {/* Header - Compact on Mobile */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 md:p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-base md:text-lg font-bold text-white">المساعد الذكي</h1>
                <button
                  onClick={() => setShowClinicSelector(true)}
                  className="text-xs md:text-sm text-blue-100 hover:text-white flex items-center gap-1 transition-colors truncate max-w-full"
                >
                  <Building2 className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="truncate">{selectedClinic?.name || "اختر العيادة"}</span>
                  <ChevronRight className="w-3 h-3 flex-shrink-0" />
                </button>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse flex-shrink-0" />
          </div>

          {/* Messages Area - Optimized Scrolling */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.type === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] md:max-w-[75%] rounded-2xl p-3 md:p-4 shadow-sm",
                    message.type === "user"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                  )}
                >
                  <p className="text-sm md:text-base whitespace-pre-line leading-relaxed">
                    {message.content}
                  </p>

                  {/* Quick Actions - Mobile Optimized */}
                  {message.quickActions && message.quickActions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.quickActions.map((action) => (
                        <button
                          key={action.id}
                          onClick={action.action}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 active:scale-95",
                            getActionVariantClass(action.variant)
                          )}
                        >
                          {action.icon && <action.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-[10px] md:text-xs mt-2 opacity-60">
                    {message.timestamp.toLocaleTimeString('ar-IQ', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-none p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-600">جاري الكتابة...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions - Above Input */}
          {messages.length > 0 && !isTyping && (
            <div className="px-3 md:px-4 py-2 bg-white border-t border-gray-100">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickMessage(suggestion.text)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs md:text-sm font-medium text-gray-700 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    <suggestion.icon className="w-3.5 h-3.5" />
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area - Fixed Bottom */}
          <div className="p-3 md:p-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 px-4 py-2.5 md:py-3 bg-gray-100 rounded-full text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isTyping}
                className={cn(
                  "p-2.5 md:p-3 rounded-full transition-all duration-200 active:scale-95",
                  currentMessage.trim() && !isTyping
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
              >
                {isTyping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clinic Selector Modal */}
      {showClinicSelector && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full md:max-w-md md:rounded-2xl rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">اختيار العيادة</h3>
              <button
                onClick={() => setShowClinicSelector(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {availableClinics.map((clinic) => (
                <button
                  key={clinic.id}
                  onClick={() => {
                    setSelectedClinic(clinic);
                    setShowClinicSelector(false);
                  }}
                  className={cn(
                    "w-full p-4 rounded-xl mb-2 text-right transition-all duration-200",
                    selectedClinic?.id === clinic.id
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5" />
                    <div className="flex-1">
                      <p className="font-medium">{clinic.name}</p>
                    </div>
                    {selectedClinic?.id === clinic.id && (
                      <Zap className="w-5 h-5 text-yellow-300" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartClinicAIAssistant;
