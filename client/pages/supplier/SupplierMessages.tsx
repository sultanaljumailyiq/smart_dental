import React, { useState } from "react";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  User,
  Package,
  Clock,
  CheckCheck,
  Check,
  Circle,
  Image as ImageIcon,
  X,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import SupplierHeader from "@/components/supplier/SupplierHeader";

interface Message {
  id: string;
  senderId: string;
  senderType: "supplier" | "customer";
  message: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
}

interface Conversation {
  id: string;
  conversationId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  orderId?: string;
  orderNumber?: string;
  messages: Message[];
}

export default function SupplierMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      conversationId: "conv-001",
      customerId: "c1",
      customerName: "عيادة الابتسامة الذهبية",
      customerAvatar: undefined,
      lastMessage: "متى سيصل الطلب؟",
      lastMessageTime: "منذ 30 دقيقة",
      unreadCount: 2,
      orderId: "o1",
      orderNumber: "ORD-2024-0012",
      messages: [
        {
          id: "m1",
          senderId: "c1",
          senderType: "customer",
          message: "السلام عليكم، أريد الاستفسار عن الطلب",
          timestamp: "10:30 ص",
          isRead: true,
        },
        {
          id: "m2",
          senderId: "supplier",
          senderType: "supplier",
          message: "وعليكم السلام، تفضل كيف يمكنني مساعدتك؟",
          timestamp: "10:32 ص",
          isRead: true,
        },
        {
          id: "m3",
          senderId: "c1",
          senderType: "customer",
          message: "متى سيصل الطلب؟",
          timestamp: "10:35 ص",
          isRead: false,
        },
      ],
    },
    {
      id: "2",
      conversationId: "conv-002",
      customerId: "c2",
      customerName: "د. أحمد محمد",
      lastMessage: "شكراً جزيلاً",
      lastMessageTime: "منذ ساعة",
      unreadCount: 0,
      orderId: "o2",
      orderNumber: "ORD-2024-0011",
      messages: [
        {
          id: "m4",
          senderId: "c2",
          senderType: "customer",
          message: "هل يمكنني تغيير المنتج؟",
          timestamp: "أمس 2:15 م",
          isRead: true,
        },
        {
          id: "m5",
          senderId: "supplier",
          senderType: "supplier",
          message: "نعم بالتأكيد، ما هو المنتج البديل؟",
          timestamp: "أمس 2:20 م",
          isRead: true,
        },
        {
          id: "m6",
          senderId: "c2",
          senderType: "customer",
          message: "شكراً جزيلاً",
          timestamp: "أمس 2:25 م",
          isRead: true,
        },
      ],
    },
    {
      id: "3",
      conversationId: "conv-003",
      customerId: "c3",
      customerName: "مركز بغداد للأسنان",
      lastMessage: "تم استلام الطلب بنجاح",
      lastMessageTime: "منذ 3 ساعات",
      unreadCount: 1,
      messages: [
        {
          id: "m7",
          senderId: "c3",
          senderType: "customer",
          message: "تم استلام الطلب بنجاح",
          timestamp: "اليوم 9:00 ص",
          isRead: false,
        },
      ],
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(conv => 
    conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: "supplier",
      senderType: "supplier",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      <SupplierHeader />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
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
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={cn(
                      "p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                      selectedConversation?.id === conv.id && "bg-blue-50 border-r-4 border-r-blue-500"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={conv.customerAvatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {conv.customerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-sm text-gray-900 truncate">{conv.customerName}</h3>
                          <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                        </div>
                        {conv.orderNumber && (
                          <div className="flex items-center gap-1 mb-1">
                            <Package className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{conv.orderNumber}</span>
                          </div>
                        )}
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                        {conv.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white mt-1 text-xs">{conv.unreadCount} جديد</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {selectedConversation.customerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedConversation.customerName}</h3>
                        {selectedConversation.orderNumber && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Package className="w-3 h-3" />
                            <span>{selectedConversation.orderNumber}</span>
                          </div>
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
                        "flex gap-3",
                        msg.senderType === "supplier" ? "justify-start flex-row-reverse" : "justify-start"
                      )}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={cn(
                          msg.senderType === "supplier" ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-600"
                        )}>
                          {msg.senderType === "supplier" ? "أ" : selectedConversation.customerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-2",
                          msg.senderType === "supplier"
                            ? "bg-blue-500 text-white rounded-tr-none"
                            : "bg-gray-200 text-gray-900 rounded-tl-none"
                        )}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <div className={cn(
                          "flex items-center gap-1 mt-1 text-xs",
                          msg.senderType === "supplier" ? "text-blue-100" : "text-gray-500"
                        )}>
                          <span>{msg.timestamp}</span>
                          {msg.senderType === "supplier" && (
                            msg.isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                          )}
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
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">اضغط Enter للإرسال، Shift+Enter لسطر جديد</p>
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
