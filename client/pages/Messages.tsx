import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Send,
  Search,
  Plus,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Star,
  Archive,
  Trash2,
  Bell,
  BellOff,
  Users,
  User,
  Circle,
  Check,
  CheckCheck,
  ImageIcon,
  FileText,
  Download,
  Calendar,
  Clock,
  Filter,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: "text" | "image" | "file" | "appointment";
  status: "sent" | "delivered" | "read";
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
}

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    avatar: string;
    role: "dentist" | "patient" | "admin" | "supplier";
    status: "online" | "offline" | "away";
  }>;
  lastMessage: Message;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  type: "direct" | "group";
  groupName?: string;
  groupAvatar?: string;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    participants: [
      {
        id: "p1",
        name: "د. أحمد محمد",
        avatar: "/placeholder.svg",
        role: "dentist",
        status: "online",
      },
    ],
    lastMessage: {
      id: "msg1",
      senderId: "p1",
      content: "مرحباً، هل يمكنني حجز موعد للأسبوع القادم؟",
      timestamp: new Date(Date.now() - 300000),
      type: "text",
      status: "read",
    },
    unreadCount: 2,
    isPinned: true,
    isArchived: false,
    type: "direct",
  },
  {
    id: "2",
    participants: [
      {
        id: "p2",
        name: "سارة أحمد",
        avatar: "/placeholder.svg",
        role: "patient",
        status: "offline",
      },
    ],
    lastMessage: {
      id: "msg2",
      senderId: "p2",
      content: "شكراً لك على الاستشارة",
      timestamp: new Date(Date.now() - 3600000),
      type: "text",
      status: "delivered",
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    type: "direct",
  },
  {
    id: "3",
    participants: [
      {
        id: "p3",
        name: "مجموعة أطباء الأسنان",
        avatar: "/placeholder.svg",
        role: "dentist",
        status: "online",
      },
    ],
    lastMessage: {
      id: "msg3",
      senderId: "p3",
      content: "تم إضافة دورة تدريبية جديدة",
      timestamp: new Date(Date.now() - 7200000),
      type: "text",
      status: "read",
    },
    unreadCount: 5,
    isPinned: false,
    isArchived: false,
    type: "group",
    groupName: "مجموعة أطباء الأسنان",
    groupAvatar: "/placeholder.svg",
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "p1",
    content: "مرحباً دكتور، أريد استشارة بخصوص ألم في الأسنان",
    timestamp: new Date(Date.now() - 7200000),
    type: "text",
    status: "read",
  },
  {
    id: "2",
    senderId: "current",
    content: "مرحباً، يمكنني مساعدتك. ما هي طبيعة الألم؟",
    timestamp: new Date(Date.now() - 7000000),
    type: "text",
    status: "read",
  },
  {
    id: "3",
    senderId: "p1",
    content: "الألم في الجانب الأيمن العلوي، خاصة عند الأكل",
    timestamp: new Date(Date.now() - 6800000),
    type: "text",
    status: "read",
  },
  {
    id: "4",
    senderId: "current",
    content: "هل يمكنك إرسال صورة للمنطقة المصابة؟",
    timestamp: new Date(Date.now() - 6600000),
    type: "text",
    status: "read",
  },
  {
    id: "5",
    senderId: "p1",
    content: "بالطبع، هذه صورة للأسنان",
    timestamp: new Date(Date.now() - 6400000),
    type: "image",
    status: "read",
    attachments: [
      {
        id: "att1",
        name: "dental_photo.jpg",
        type: "image/jpeg",
        size: 2048000,
        url: "/placeholder.svg",
      },
    ],
  },
];

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all");

  const filteredConversations = mockConversations.filter((conv) => {
    const matchesSearch =
      conv.participants[0].name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.content
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && conv.unreadCount > 0) ||
      (filter === "archived" && conv.isArchived);

    return matchesSearch && matchesFilter && !conv.isArchived;
  });

  const selectedConv = mockConversations.find(
    (c) => c.id === selectedConversation,
  );
  const currentUser = selectedConv?.participants[0];

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return "الآن";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} د`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} س`;
    return `${Math.floor(diff / 86400000)} ي`;
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    // إضافة الرسالة الجديدة (محاكاة)
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">الرسائل</h1>
                <p className="text-gray-600">إدارة المحادثات والتواصل</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                الإعدادات
              </Button>
              <Dialog
                open={showNewConversation}
                onOpenChange={setShowNewConversation}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    محادثة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>بدء محادثة جديدة</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Input placeholder="البحث عن مستخدم..." />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        جهات الاتصال المتاحة
                      </p>
                      {/* قائمة المستخدمين */}
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {["د. محمد أحمد", "د. فاطمة علي", "د. يوسف محمود"].map(
                          (name, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                            >
                              <Avatar className="w-8 h-8">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>{name[2]}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{name}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-200px)]">
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
              {/* Search and Filter */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="البحث في المحادثات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-1">
                  {[
                    {
                      id: "all",
                      label: "الكل",
                      count: mockConversations.length,
                    },
                    {
                      id: "unread",
                      label: "غير مقروءة",
                      count: mockConversations.filter((c) => c.unreadCount > 0)
                        .length,
                    },
                    {
                      id: "archived",
                      label: "أرشيف",
                      count: mockConversations.filter((c) => c.isArchived)
                        .length,
                    },
                  ].map((tab) => (
                    <Button
                      key={tab.id}
                      variant={filter === tab.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFilter(tab.id as any)}
                      className="text-xs"
                    >
                      {tab.label}
                      {tab.count > 0 && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {tab.count}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => {
                  const participant = conversation.participants[0];
                  const isSelected = selectedConversation === conversation.id;

                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={cn(
                        "p-3 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50",
                        isSelected && "bg-blue-50 border-blue-200",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback>
                              {participant.name[2]}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={cn(
                              "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                              participant.status === "online" && "bg-green-500",
                              participant.status === "away" && "bg-yellow-500",
                              participant.status === "offline" && "bg-gray-400",
                            )}
                          />
                          {conversation.isPinned && (
                            <div className="absolute -top-1 -left-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <Star className="w-2 h-2 text-white fill-current" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3
                              className={cn(
                                "font-medium text-sm truncate",
                                conversation.unreadCount > 0
                                  ? "text-gray-900"
                                  : "text-gray-700",
                              )}
                            >
                              {conversation.type === "group"
                                ? conversation.groupName
                                : participant.name}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <p
                              className={cn(
                                "text-sm truncate",
                                conversation.unreadCount > 0
                                  ? "text-gray-900 font-medium"
                                  : "text-gray-600",
                              )}
                            >
                              {conversation.lastMessage.senderId ===
                                "current" && (
                                <span className="mr-1">
                                  {conversation.lastMessage.status ===
                                    "sent" && (
                                    <Check className="w-3 h-3 inline text-gray-400" />
                                  )}
                                  {conversation.lastMessage.status ===
                                    "delivered" && (
                                    <CheckCheck className="w-3 h-3 inline text-gray-400" />
                                  )}
                                  {conversation.lastMessage.status ===
                                    "read" && (
                                    <CheckCheck className="w-3 h-3 inline text-blue-500" />
                                  )}
                                </span>
                              )}
                              {conversation.lastMessage.type === "image" &&
                                "📷 صورة"}
                              {conversation.lastMessage.type === "file" &&
                                "📎 ملف"}
                              {conversation.lastMessage.type === "text" &&
                                conversation.lastMessage.content}
                            </p>

                            {conversation.unreadCount > 0 && (
                              <Badge className="text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>

                          {conversation.type === "group" && (
                            <div className="flex items-center gap-1 mt-1">
                              <Users className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {conversation.participants.length} أعضاء
                              </span>
                            </div>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-8 h-8 p-0"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Star className="w-4 h-4 mr-2" />
                              {conversation.isPinned
                                ? "إلغاء التثبيت"
                                : "تثبيت"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Bell className="w-4 h-4 mr-2" />
                              كتم الإشعارات
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="w-4 h-4 mr-2" />
                              أرشفة
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              حذف المحادثة
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={currentUser?.avatar} />
                          <AvatarFallback>
                            {currentUser?.name[2]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="font-medium text-gray-900">
                            {selectedConv.type === "group"
                              ? selectedConv.groupName
                              : currentUser?.name}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {currentUser?.status === "online" && "متصل الآن"}
                            {currentUser?.status === "away" && "غير متاح"}
                            {currentUser?.status === "offline" && "غير متصل"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <User className="w-4 h-4 mr-2" />
                              عرض الملف الشخصي
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="w-4 h-4 mr-2" />
                              حجز موعد
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <BellOff className="w-4 h-4 mr-2" />
                              كتم الإشعارات
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              حذف المحادثة
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {mockMessages.map((message) => {
                      const isOwn = message.senderId === "current";

                      return (
                        <div
                          key={message.id}
                          className={cn(
                            "flex",
                            isOwn ? "justify-end" : "justify-start",
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
                              isOwn
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900",
                            )}
                          >
                            {message.type === "text" && (
                              <p className="text-sm">{message.content}</p>
                            )}

                            {message.type === "image" &&
                              message.attachments && (
                                <div className="space-y-2">
                                  <p className="text-sm">{message.content}</p>
                                  <img
                                    src={message.attachments[0].url}
                                    alt="مرفق"
                                    className="rounded-lg max-w-full h-auto"
                                  />
                                </div>
                              )}

                            {message.type === "file" && message.attachments && (
                              <div className="space-y-2">
                                <p className="text-sm">{message.content}</p>
                                <div className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                                  <FileText className="w-4 h-4" />
                                  <span className="text-sm">
                                    {message.attachments[0].name}
                                  </span>
                                  <Button variant="ghost" size="sm">
                                    <Download className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            )}

                            <div
                              className={cn(
                                "flex items-center justify-between mt-1 text-xs",
                                isOwn ? "text-blue-200" : "text-gray-500",
                              )}
                            >
                              <span>{formatTime(message.timestamp)}</span>
                              {isOwn && (
                                <span>
                                  {message.status === "sent" && (
                                    <Check className="w-3 h-3 inline" />
                                  )}
                                  {message.status === "delivered" && (
                                    <CheckCheck className="w-3 h-3 inline" />
                                  )}
                                  {message.status === "read" && (
                                    <CheckCheck className="w-3 h-3 inline text-blue-200" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Textarea
                          placeholder="اكتب رسالتك..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[40px] max-h-32 resize-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ImageIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Smile className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      اختر محادثة للبدء
                    </h3>
                    <p className="text-gray-600">
                      اختر محادثة من القائمة الجانبية أو ابدأ محادثة جديدة
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
