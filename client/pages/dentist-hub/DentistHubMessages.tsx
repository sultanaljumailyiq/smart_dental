import React, { useState } from "react";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  User,
  Clock,
  CheckCheck,
  Check,
  Package,
  Users,
  HeadphonesIcon,
  Stethoscope,
  Building2,
  X,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  senderId: string;
  senderType: "dentist" | "staff" | "supplier" | "support";
  message: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
}

interface Conversation {
  id: string;
  conversationId: string;
  contactId: string;
  contactName: string;
  contactAvatar?: string;
  contactType: "staff" | "supplier" | "support";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  relatedInfo?: string;
  clinicId?: string;
  clinicName?: string;
  orderId?: string;
  messages: Message[];
}

export default function DentistHubMessages() {
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState<Conversation[]>([
    // Staff Conversations
    {
      id: "1",
      conversationId: "conv-staff-001",
      contactId: "staff1",
      contactName: "د. سارة أحمد",
      contactType: "staff",
      lastMessage: "تم إنهاء حالات اليوم بنجاح",
      lastMessageTime: "منذ 15 دقيقة",
      unreadCount: 2,
      clinicId: "clinic1",
      clinicName: "عيادة النور",
      relatedInfo: "فريق العمل - عيادة النور",
      messages: [
        {
          id: "m1",
          senderId: "staff1",
          senderType: "staff",
          message: "دكتور، لدينا 3 مرضى في الانتظار",
          timestamp: "10:30 ص",
          isRead: true,
        },
        {
          id: "m2",
          senderId: "dentist",
          senderType: "dentist",
          message: "حسناً، سأبدأ مع المريض الأول",
          timestamp: "10:32 ص",
          isRead: true,
        },
        {
          id: "m3",
          senderId: "staff1",
          senderType: "staff",
          message: "تم إنهاء حالات اليوم بنجاح",
          timestamp: "5:35 م",
          isRead: false,
        },
      ],
    },
    {
      id: "2",
      conversationId: "conv-staff-002",
      contactId: "staff2",
      contactName: "أحمد محمود (سكرتير)",
      contactType: "staff",
      lastMessage: "تم تأكيد جميع مواعيد الغد",
      lastMessageTime: "منذ ساعة",
      unreadCount: 0,
      clinicId: "clinic1",
      clinicName: "عيادة النور",
      relatedInfo: "سكرتير - عيادة النور",
      messages: [
        {
          id: "m4",
          senderId: "staff2",
          senderType: "staff",
          message: "دكتور، هل تريد مراجعة مواعيد الغد؟",
          timestamp: "أمس 2:15 م",
          isRead: true,
        },
        {
          id: "m5",
          senderId: "dentist",
          senderType: "dentist",
          message: "نعم، أرسل لي القائمة",
          timestamp: "أمس 2:20 م",
          isRead: true,
        },
        {
          id: "m6",
          senderId: "staff2",
          senderType: "staff",
          message: "تم تأكيد جميع مواعيد الغد",
          timestamp: "أمس 4:25 م",
          isRead: true,
        },
      ],
    },
    
    // Supplier Conversations (based on orders)
    {
      id: "3",
      conversationId: "conv-sup-001",
      contactId: "sup1",
      contactName: "شركة المعدات الطبية",
      contactType: "supplier",
      lastMessage: "تم شحن طلبك رقم ORD-2024-0012",
      lastMessageTime: "منذ 30 دقيقة",
      unreadCount: 1,
      clinicId: "clinic1",
      clinicName: "عيادة النور",
      orderId: "ORD-2024-0012",
      relatedInfo: "طلب: ORD-2024-0012 - عيادة النور",
      messages: [
        {
          id: "m7",
          senderId: "sup1",
          senderType: "supplier",
          message: "تم شحن طلبك رقم ORD-2024-0012",
          timestamp: "اليوم 11:00 ص",
          isRead: false,
        },
      ],
    },
    {
      id: "4",
      conversationId: "conv-sup-002",
      contactId: "sup2",
      contactName: "مستلزمات الابتسامة",
      contactType: "supplier",
      lastMessage: "عرض خاص على أدوات التنظيف",
      lastMessageTime: "منذ 3 ساعات",
      unreadCount: 0,
      clinicId: "clinic2",
      clinicName: "عيادة الأمل",
      orderId: "ORD-2024-0008",
      relatedInfo: "طلب: ORD-2024-0008 - عيادة الأمل",
      messages: [
        {
          id: "m8",
          senderId: "sup2",
          senderType: "supplier",
          message: "عرض خاص على أدوات التنظيف بخصم 20%",
          timestamp: "اليوم 9:00 ص",
          isRead: true,
        },
        {
          id: "m9",
          senderId: "dentist",
          senderType: "dentist",
          message: "أرسل لي تفاصيل العرض",
          timestamp: "اليوم 9:15 ص",
          isRead: true,
        },
      ],
    },
    
    // Technical Support Conversations
    {
      id: "5",
      conversationId: "conv-support-001",
      contactId: "support1",
      contactName: "فريق الدعم الفني",
      contactType: "support",
      lastMessage: "تم حل المشكلة بنجاح",
      lastMessageTime: "منذ يوم",
      unreadCount: 0,
      relatedInfo: "الدعم الفني - المنصة",
      messages: [
        {
          id: "m10",
          senderId: "dentist",
          senderType: "dentist",
          message: "أواجه مشكلة في نظام الحجز",
          timestamp: "أمس 10:00 ص",
          isRead: true,
        },
        {
          id: "m11",
          senderId: "support1",
          senderType: "support",
          message: "سنساعدك في حل المشكلة فوراً",
          timestamp: "أمس 10:05 ص",
          isRead: true,
        },
        {
          id: "m12",
          senderId: "support1",
          senderType: "support",
          message: "تم حل المشكلة بنجاح",
          timestamp: "أمس 11:00 ص",
          isRead: true,
        },
      ],
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "staff" | "suppliers" | "support">("all");

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.relatedInfo?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Map tab values to contactType values
    const tabToContactType: Record<string, string> = {
      "all": "all",
      "staff": "staff",
      "suppliers": "supplier",
      "support": "support",
    };
    
    const matchesTab = activeTab === "all" || conv.contactType === tabToContactType[activeTab];
    
    return matchesSearch && matchesTab;
  });

  const getTabCount = (type: "staff" | "supplier" | "support") => {
    return conversations.filter(conv => conv.contactType === type).length;
  };

  const getUnreadCount = (type?: "staff" | "supplier" | "support") => {
    if (type) {
      return conversations
        .filter(conv => conv.contactType === type)
        .reduce((sum, conv) => sum + conv.unreadCount, 0);
    }
    return conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: "dentist",
      senderType: "dentist",
      message: messageInput,
      timestamp: new Date().toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" }),
      isRead: false,
    };

    setConversations(conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: messageInput,
          lastMessageTime: "الآن",
        };
      }
      return conv;
    }));

    if (selectedConversation) {
      setSelectedConversation({
        ...selectedConversation,
        messages: [...selectedConversation.messages, newMessage],
      });
    }

    setMessageInput("");
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case "staff": return <Users className="w-4 h-4" />;
      case "supplier": return <Package className="w-4 h-4" />;
      case "support": return <HeadphonesIcon className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getContactBadgeColor = (type: string) => {
    switch (type) {
      case "staff": return "bg-blue-100 text-blue-700";
      case "supplier": return "bg-green-100 text-green-700";
      case "support": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-purple-600" />
                الرسائل
              </h1>
              <p className="text-gray-600 mt-1">
                تواصل مع فريقك، الموردين، والدعم الفني
              </p>
            </div>
            {getUnreadCount() > 0 && (
              <Badge className="bg-red-500 text-white text-lg px-4 py-2">
                {getUnreadCount()} رسالة جديدة
              </Badge>
            )}
          </div>
        </div>

        {/* Smart Category Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                الكل ({conversations.length})
                {getUnreadCount() > 0 && (
                  <Badge className="bg-red-500 text-white ml-2">{getUnreadCount()}</Badge>
                )}
              </span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                الكادر ({getTabCount("staff")})
                {getUnreadCount("staff") > 0 && (
                  <Badge className="bg-red-500 text-white ml-2">{getUnreadCount("staff")}</Badge>
                )}
              </span>
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                الموردين ({getTabCount("supplier")})
                {getUnreadCount("supplier") > 0 && (
                  <Badge className="bg-red-500 text-white ml-2">{getUnreadCount("supplier")}</Badge>
                )}
              </span>
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <span className="flex items-center gap-2">
                <HeadphonesIcon className="w-4 h-4" />
                الدعم الفني ({getTabCount("support")})
                {getUnreadCount("support") > 0 && (
                  <Badge className="bg-red-500 text-white ml-2">{getUnreadCount("support")}</Badge>
                )}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="border-b border-gray-200 bg-gray-50 pb-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="بحث في المحادثات..."
                  className="pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
              <div className="divide-y divide-gray-200">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>لا توجد محادثات</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={cn(
                        "p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                        selectedConversation?.id === conv.id && "bg-purple-50 border-r-4 border-r-purple-500"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={conv.contactAvatar} />
                          <AvatarFallback className={cn("text-white", getContactBadgeColor(conv.contactType))}>
                            {getContactIcon(conv.contactType)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{conv.contactName}</h3>
                            <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={cn("text-xs", getContactBadgeColor(conv.contactType))}>
                              {conv.contactType === "staff" ? "كادر" : 
                               conv.contactType === "supplier" ? "مورد" : "دعم فني"}
                            </Badge>
                            {conv.clinicName && (
                              <Badge variant="outline" className="text-xs">
                                <Building2 className="w-3 h-3 ml-1" />
                                {conv.clinicName}
                              </Badge>
                            )}
                          </div>
                          {conv.relatedInfo && (
                            <p className="text-xs text-gray-500 mb-1">{conv.relatedInfo}</p>
                          )}
                          <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                          {conv.unreadCount > 0 && (
                            <Badge className="mt-2 bg-red-500 text-white">{conv.unreadCount} جديد</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 shadow-lg flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b border-gray-200 bg-gray-50 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={selectedConversation.contactAvatar} />
                        <AvatarFallback className={cn("text-white", getContactBadgeColor(selectedConversation.contactType))}>
                          {getContactIcon(selectedConversation.contactType)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-bold text-gray-900">{selectedConversation.contactName}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={cn("text-xs", getContactBadgeColor(selectedConversation.contactType))}>
                            {selectedConversation.contactType === "staff" ? "كادر" : 
                             selectedConversation.contactType === "supplier" ? "مورد" : "دعم فني"}
                          </Badge>
                          {selectedConversation.clinicName && (
                            <span className="text-sm text-gray-600">• {selectedConversation.clinicName}</span>
                          )}
                        </div>
                        {selectedConversation.relatedInfo && (
                          <p className="text-xs text-gray-500 mt-1">{selectedConversation.relatedInfo}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.senderType === "dentist" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-2",
                          msg.senderType === "dentist"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-900"
                        )}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className={cn(
                            "text-xs",
                            msg.senderType === "dentist" ? "text-purple-200" : "text-gray-500"
                          )}>
                            {msg.timestamp}
                          </span>
                          {msg.senderType === "dentist" && (
                            msg.isRead ? (
                              <CheckCheck className="w-3 h-3 text-purple-200" />
                            ) : (
                              <Check className="w-3 h-3 text-purple-200" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="flex items-end gap-2">
                    <Button variant="outline" size="icon" className="flex-shrink-0">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="اكتب رسالتك هنا..."
                      className="resize-none"
                      rows={2}
                    />
                    <Button
                      onClick={sendMessage}
                      className="bg-purple-600 hover:bg-purple-700 text-white flex-shrink-0"
                      disabled={!messageInput.trim()}
                    >
                      <Send className="w-4 h-4 ml-2" />
                      إرسال
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4" />
                  <p>اختر محادثة للبدء</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
