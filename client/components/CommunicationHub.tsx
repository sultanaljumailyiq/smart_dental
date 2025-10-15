import React, { useState } from "react";
import {
  MessageSquare,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Search,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Users,
  Settings,
  Star,
  Calendar,
  HeadphonesIcon,
  Mic,
  MicOff,
  VideoOff,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  type: "text" | "image" | "file" | "audio" | "video_call" | "voice_call";
  status: "sent" | "delivered" | "read";
  attachments?: Array<{
    type: "image" | "file";
    url: string;
    name: string;
    size?: string;
  }>;
}

interface Conversation {
  id: string;
  type: "direct" | "group" | "support";
  name: string;
  avatar?: string;
  participants: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
    isOnline: boolean;
  }>;
  lastMessage: Message;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  type: "appointment" | "payment" | "inventory" | "follow_up";
  dueDate: string;
  priority: "low" | "medium" | "high";
  isCompleted: boolean;
  relatedTo?: string;
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: "1",
    type: "direct",
    name: "د. أحمد محمد علي",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    participants: [
      { id: "1", name: "د. أحمد محمد علي", role: "طبيب أسنان", isOnline: true },
    ],
    lastMessage: {
      id: "1",
      senderId: "1",
      senderName: "د. أحمد محمد علي",
      content: "شكراً لكم، تم استلام الطلب بنجاح",
      timestamp: "2024-01-15T14:30:00Z",
      type: "text",
      status: "read",
    },
    unreadCount: 0,
    isPinned: true,
    isArchived: false,
  },
  {
    id: "2",
    type: "support",
    name: "الدعم الفني",
    participants: [
      { id: "support1", name: "فريق الدعم", role: "دعم فني", isOnline: true },
    ],
    lastMessage: {
      id: "2",
      senderId: "support1",
      senderName: "فريق الدعم",
      content: "سيتم حل مشكلتك خلال 24 ساعة",
      timestamp: "2024-01-15T12:15:00Z",
      type: "text",
      status: "delivered",
    },
    unreadCount: 2,
    isPinned: false,
    isArchived: false,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "1",
    senderName: "د. أحمد محمد علي",
    content: "مرحباً، أريد الاستفسار عن طلبي الأخير",
    timestamp: "2024-01-15T14:00:00Z",
    type: "text",
    status: "read",
  },
  {
    id: "2",
    senderId: "me",
    senderName: "أنت",
    content: "أهلاً د. أحمد، طلبكم قيد التحضير وسيتم شحنه غداً",
    timestamp: "2024-01-15T14:15:00Z",
    type: "text",
    status: "read",
  },
  {
    id: "3",
    senderId: "1",
    senderName: "د. أحمد محمد علي",
    content: "شكراً لكم، تم استلام الطلب بنجاح",
    timestamp: "2024-01-15T14:30:00Z",
    type: "text",
    status: "read",
  },
];

const mockReminders: Reminder[] = [
  {
    id: "1",
    title: "موعد مع د. سارة علي",
    description: "استشارة طبية - غداً الساعة 10:00 صباحاً",
    type: "appointment",
    dueDate: "2024-01-16T10:00:00Z",
    priority: "high",
    isCompleted: false,
    relatedTo: "appointment_123",
  },
  {
    id: "2",
    title: "دفع فاتورة المخزن",
    description: "استحقاق دفع إيجار المخزن",
    type: "payment",
    dueDate: "2024-01-18T17:00:00Z",
    priority: "medium",
    isCompleted: false,
  },
  {
    id: "3",
    title: "تجديد مخزون مادة التخدير",
    description: "المخزون أقل من الحد الأدنى",
    type: "inventory",
    dueDate: "2024-01-17T09:00:00Z",
    priority: "high",
    isCompleted: false,
  },
];

interface CommunicationHubProps {
  className?: string;
}

export function CommunicationHub({ className }: CommunicationHubProps) {
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [messages] = useState<Message[]>(mockMessages);
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("ar-IQ", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("ar-IQ", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const sendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      // Add message logic here
      setMessageText("");
    }
  };

  const markReminderComplete = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === reminderId
          ? { ...reminder, isCompleted: true }
          : reminder,
      ),
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="w-4 h-4" />;
      case "payment":
        return <AlertCircle className="w-4 h-4" />;
      case "inventory":
        return <Clock className="w-4 h-4" />;
      case "follow_up":
        return <Bell className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: "messages", label: "الرسائل", icon: MessageSquare },
    { id: "reminders", label: "التذكيرات", icon: Bell },
    { id: "support", label: "الدعم المباشر", icon: HeadphonesIcon },
  ];

  return (
    <div
      className={cn("h-screen flex flex-col bg-gray-50", className)}
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">مركز التواصل</h2>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100",
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {activeTab === "messages" && (
          <>
            {/* Conversations List */}
            <div className="w-1/3 bg-white border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث في المحادثات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={cn(
                      "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                      selectedConversation?.id === conversation.id &&
                        "bg-blue-50",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        {conversation.avatar ? (
                          <img
                            src={conversation.avatar}
                            alt={conversation.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            {conversation.type === "support" ? (
                              <HeadphonesIcon className="w-6 h-6 text-gray-600" />
                            ) : conversation.type === "group" ? (
                              <Users className="w-6 h-6 text-gray-600" />
                            ) : (
                              <User className="w-6 h-6 text-gray-600" />
                            )}
                          </div>
                        )}
                        {conversation.participants.some((p) => p.isOnline) && (
                          <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {conversation.name}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 truncate mb-1">
                          {conversation.lastMessage.content}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {conversation.isPinned && (
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            )}
                            {conversation.lastMessage.status === "read" && (
                              <CheckCircle className="w-3 h-3 text-blue-500" />
                            )}
                          </div>

                          {conversation.unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="bg-white border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {selectedConversation.avatar ? (
                            <img
                              src={selectedConversation.avatar}
                              alt={selectedConversation.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                          )}
                          {selectedConversation.participants.some(
                            (p) => p.isOnline,
                          ) && (
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>

                        <div>
                          <h3 className="font-medium text-gray-900">
                            {selectedConversation.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {selectedConversation.participants.some(
                              (p) => p.isOnline,
                            )
                              ? "متصل الآن"
                              : "غير متصل"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                          <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                          <Video className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3",
                          message.senderId === "me"
                            ? "flex-row-reverse"
                            : "flex-row",
                        )}
                      >
                        {message.senderId !== "me" && (
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                        )}

                        <div
                          className={cn(
                            "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
                            message.senderId === "me"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900",
                          )}
                        >
                          <p>{message.content}</p>
                          <div
                            className={cn(
                              "text-xs mt-1 flex items-center gap-1",
                              message.senderId === "me"
                                ? "text-blue-200"
                                : "text-gray-500",
                            )}
                          >
                            <span>{formatTime(message.timestamp)}</span>
                            {message.senderId === "me" &&
                              message.status === "read" && (
                                <CheckCircle className="w-3 h-3" />
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="bg-white border-t border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
                        <Paperclip className="w-5 h-5" />
                      </button>

                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                          placeholder="اكتب رسالتك..."
                          className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 hover:text-gray-800">
                          <Smile className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={sendMessage}
                        disabled={!messageText.trim()}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      اختر محادثة
                    </h3>
                    <p className="text-gray-600">
                      اختر محادثة من القائمة لبدء التواصل
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "reminders" && (
          <div className="flex-1 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  التذكيرات والمهام
                </h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  إضافة تذكير
                </button>
              </div>

              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className={cn(
                      "p-4 rounded-xl border",
                      reminder.isCompleted
                        ? "bg-gray-50 opacity-60"
                        : "bg-white",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => markReminderComplete(reminder.id)}
                          className={cn(
                            "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            reminder.isCompleted
                              ? "bg-green-500 border-green-500"
                              : "border-gray-300 hover:border-blue-500",
                          )}
                        >
                          {reminder.isCompleted && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </button>

                        <div className="flex-1">
                          <h4
                            className={cn(
                              "font-medium mb-1",
                              reminder.isCompleted
                                ? "line-through text-gray-500"
                                : "text-gray-900",
                            )}
                          >
                            {reminder.title}
                          </h4>
                          <p
                            className={cn(
                              "text-sm mb-2",
                              reminder.isCompleted
                                ? "text-gray-400"
                                : "text-gray-600",
                            )}
                          >
                            {reminder.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(reminder.dueDate)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs border flex items-center gap-1",
                            getPriorityColor(reminder.priority),
                          )}
                        >
                          {getReminderIcon(reminder.type)}
                          {reminder.priority === "high" && "عاجل"}
                          {reminder.priority === "medium" && "متوسط"}
                          {reminder.priority === "low" && "عادي"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "support" && (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md">
              <HeadphonesIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                الدعم المباشر
              </h3>
              <p className="text-gray-600 mb-6">
                تواصل مع فريق الدعم الفني للحصول على المساعدة الفورية
              </p>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                  <Phone className="w-5 h-5" />
                  اتصال صوتي
                </button>

                <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                  <Video className="w-5 h-5" />
                  مكالمة فيديو
                </button>

                <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  دردشة مباشرة
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-700">
                  ساعات العمل: من السبت إلى الخميس، 9:00 ص - 6:00 م
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommunicationHub;
