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
  Stethoscope,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  senderId: string;
  senderType: "dentist" | "patient" | "staff" | "supplier" | "community";
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
  contactType: "patient" | "staff" | "supplier" | "community";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  relatedInfo?: string; // رقم الموعد، رقم الطلب، إلخ
  messages: Message[];
}

export default function ClinicMessages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      conversationId: "conv-001",
      contactId: "p1",
      contactName: "أحمد محمود",
      contactType: "patient",
      lastMessage: "متى الموعد القادم؟",
      lastMessageTime: "منذ 15 دقيقة",
      unreadCount: 2,
      relatedInfo: "موعد: 2024-01-15",
      messages: [
        {
          id: "m1",
          senderId: "p1",
          senderType: "patient",
          message: "السلام عليكم دكتور، كيف حال الأسنان؟",
          timestamp: "10:30 ص",
          isRead: true,
        },
        {
          id: "m2",
          senderId: "dentist",
          senderType: "dentist",
          message: "وعليكم السلام، الحمد لله الحالة ممتازة",
          timestamp: "10:32 ص",
          isRead: true,
        },
        {
          id: "m3",
          senderId: "p1",
          senderType: "patient",
          message: "متى الموعد القادم؟",
          timestamp: "10:35 ص",
          isRead: false,
        },
      ],
    },
    {
      id: "2",
      conversationId: "conv-002",
      contactId: "s1",
      contactName: "د. سارة أحمد",
      contactType: "staff",
      lastMessage: "انتهيت من حالات اليوم",
      lastMessageTime: "منذ ساعة",
      unreadCount: 0,
      relatedInfo: "فريق العمل",
      messages: [
        {
          id: "m4",
          senderId: "s1",
          senderType: "staff",
          message: "دكتور، لدينا 3 مرضى ينتظرون",
          timestamp: "أمس 2:15 م",
          isRead: true,
        },
        {
          id: "m5",
          senderId: "dentist",
          senderType: "dentist",
          message: "حسناً، سأبدأ مع المريض الأول",
          timestamp: "أمس 2:20 م",
          isRead: true,
        },
        {
          id: "m6",
          senderId: "s1",
          senderType: "staff",
          message: "انتهيت من حالات اليوم",
          timestamp: "أمس 5:25 م",
          isRead: true,
        },
      ],
    },
    {
      id: "3",
      conversationId: "conv-003",
      contactId: "sup1",
      contactName: "شركة المعدات الطبية",
      contactType: "supplier",
      lastMessage: "عرض خاص على أجهزة التعقيم",
      lastMessageTime: "منذ 3 ساعات",
      unreadCount: 1,
      relatedInfo: "طلب: ORD-2024-0012",
      messages: [
        {
          id: "m7",
          senderId: "sup1",
          senderType: "supplier",
          message: "عرض خاص على أجهزة التعقيم بخصم 25%",
          timestamp: "اليوم 9:00 ص",
          isRead: false,
        },
      ],
    },
    {
      id: "4",
      conversationId: "conv-004",
      contactId: "doc1",
      contactName: "د. محمد العراقي",
      contactType: "community",
      lastMessage: "شكراً على المشاركة القيمة",
      lastMessageTime: "منذ يوم",
      unreadCount: 0,
      relatedInfo: "المجتمع المهني",
      messages: [
        {
          id: "m8",
          senderId: "doc1",
          senderType: "community",
          message: "أحتاج استشارتك في حالة معقدة",
          timestamp: "أمس 11:00 ص",
          isRead: true,
        },
        {
          id: "m9",
          senderId: "dentist",
          senderType: "dentist",
          message: "بالتأكيد، أرسل لي التفاصيل",
          timestamp: "أمس 11:15 ص",
          isRead: true,
        },
        {
          id: "m10",
          senderId: "doc1",
          senderType: "community",
          message: "شكراً على المشاركة القيمة",
          timestamp: "أمس 2:30 م",
          isRead: true,
        },
      ],
    },
    {
      id: "5",
      conversationId: "conv-005",
      contactId: "p2",
      contactName: "فاطمة علي",
      contactType: "patient",
      lastMessage: "هل يمكن تغيير موعدي؟",
      lastMessageTime: "منذ يومين",
      unreadCount: 3,
      relatedInfo: "موعد: 2024-01-20",
      messages: [
        {
          id: "m11",
          senderId: "p2",
          senderType: "patient",
          message: "هل يمكن تغيير موعدي؟",
          timestamp: "منذ يومين",
          isRead: false,
        },
      ],
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations[0]
  );
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.relatedInfo?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || conv.contactType === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: "dentist",
      senderType: "dentist",
      message: messageInput,
      timestamp: new Date().toLocaleTimeString("ar-IQ", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isRead: false,
    };

    setConversations(
      conversations.map((conv) => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: messageInput,
            lastMessageTime: "الآن",
          };
        }
        return conv;
      })
    );

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
      case "patient":
        return <User className="w-3 h-3 text-gray-400" />;
      case "staff":
        return <Users className="w-3 h-3 text-gray-400" />;
      case "supplier":
        return <Package className="w-3 h-3 text-gray-400" />;
      case "community":
        return <Stethoscope className="w-3 h-3 text-gray-400" />;
      default:
        return <User className="w-3 h-3 text-gray-400" />;
    }
  };

  const getContactTypeLabel = (type: string) => {
    switch (type) {
      case "patient":
        return "مريض";
      case "staff":
        return "فريق العمل";
      case "supplier":
        return "مورد";
      case "community":
        return "مجتمع مهني";
      default:
        return "";
    }
  };

  const getContactTypeBadgeColor = (type: string) => {
    switch (type) {
      case "patient":
        return "bg-purple-100 text-purple-700";
      case "staff":
        return "bg-blue-100 text-blue-700";
      case "supplier":
        return "bg-green-100 text-green-700";
      case "community":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900">الرسائل</h1>
              </div>
              {totalUnread > 0 && (
                <Badge className="bg-red-500 text-white">{totalUnread} جديد</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {[
            { value: "all", label: "الكل", count: conversations.length },
            {
              value: "patient",
              label: "المرضى",
              count: conversations.filter((c) => c.contactType === "patient").length,
            },
            {
              value: "staff",
              label: "الفريق",
              count: conversations.filter((c) => c.contactType === "staff").length,
            },
            {
              value: "supplier",
              label: "الموردين",
              count: conversations.filter((c) => c.contactType === "supplier").length,
            },
            {
              value: "community",
              label: "المجتمع",
              count: conversations.filter((c) => c.contactType === "community").length,
            },
          ].map((filter) => (
            <Button
              key={filter.value}
              variant={filterType === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(filter.value)}
              className={cn(
                "whitespace-nowrap",
                filterType === filter.value
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "hover:bg-gray-100"
              )}
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
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
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>لا توجد محادثات</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={cn(
                        "p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                        selectedConversation?.id === conv.id &&
                          "bg-purple-50 border-r-4 border-r-purple-500"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={conv.contactAvatar} />
                          <AvatarFallback
                            className={cn(
                              "text-white",
                              conv.contactType === "patient" && "bg-purple-500",
                              conv.contactType === "staff" && "bg-blue-500",
                              conv.contactType === "supplier" && "bg-green-500",
                              conv.contactType === "community" && "bg-orange-500"
                            )}
                          >
                            {conv.contactName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm text-gray-900 truncate">
                              {conv.contactName}
                            </h3>
                            <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              className={cn(
                                "text-xs px-2 py-0",
                                getContactTypeBadgeColor(conv.contactType)
                              )}
                            >
                              {getContactTypeLabel(conv.contactType)}
                            </Badge>
                            {conv.relatedInfo && (
                              <div className="flex items-center gap-1">
                                {getContactIcon(conv.contactType)}
                                <span className="text-xs text-gray-500">{conv.relatedInfo}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                          {conv.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white mt-1 text-xs">
                              {conv.unreadCount} جديد
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2 shadow-lg overflow-hidden flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback
                          className={cn(
                            "text-white",
                            selectedConversation.contactType === "patient" && "bg-purple-500",
                            selectedConversation.contactType === "staff" && "bg-blue-500",
                            selectedConversation.contactType === "supplier" && "bg-green-500",
                            selectedConversation.contactType === "community" && "bg-orange-500"
                          )}
                        >
                          {selectedConversation.contactName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedConversation.contactName}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={cn(
                              "text-xs",
                              getContactTypeBadgeColor(selectedConversation.contactType)
                            )}
                          >
                            {getContactTypeLabel(selectedConversation.contactType)}
                          </Badge>
                          {selectedConversation.relatedInfo && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              {getContactIcon(selectedConversation.contactType)}
                              <span>{selectedConversation.relatedInfo}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {selectedConversation.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-3",
                        msg.senderType === "dentist"
                          ? "justify-start flex-row-reverse"
                          : "justify-start"
                      )}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback
                          className={cn(
                            msg.senderType === "dentist"
                              ? "bg-purple-100 text-purple-600"
                              : msg.senderType === "patient"
                              ? "bg-blue-100 text-blue-600"
                              : msg.senderType === "staff"
                              ? "bg-green-100 text-green-600"
                              : msg.senderType === "supplier"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-gray-200 text-gray-600"
                          )}
                        >
                          {msg.senderType === "dentist"
                            ? "د"
                            : selectedConversation.contactName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-2",
                          msg.senderType === "dentist"
                            ? "bg-purple-600 text-white rounded-tr-none"
                            : "bg-white text-gray-900 rounded-tl-none shadow-sm"
                        )}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <div
                          className={cn(
                            "flex items-center gap-1 mt-1 text-xs",
                            msg.senderType === "dentist" ? "text-purple-100" : "text-gray-500"
                          )}
                        >
                          <span>{msg.timestamp}</span>
                          {msg.senderType === "dentist" &&
                            (msg.isRead ? (
                              <CheckCheck className="w-3 h-3" />
                            ) : (
                              <Check className="w-3 h-3" />
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>

                {/* Message Input */}
                <div className="border-t border-gray-200 bg-white p-4">
                  <div className="flex items-end gap-3">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Textarea
                      placeholder="اكتب رسالتك هنا..."
                      className="min-h-[60px] max-h-[120px] resize-none"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!messageInput.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    اضغط Enter للإرسال، Shift+Enter لسطر جديد
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">اختر محادثة للبدء</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
