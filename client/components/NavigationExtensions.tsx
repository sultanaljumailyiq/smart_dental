import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Star,
  Clock,
  Filter,
  X,
  Command,
} from "lucide-react";

// مكون البحث المحسن
interface NavigationSearchProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
}

export const NavigationSearch: React.FC<NavigationSearchProps> = ({
  isOpen,
  onClose,
  placeholder = "البحث في جميع الأقسام...",
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // التركيز على حقل البحث عند الفتح
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // نتائج البحث الوهمية
  const searchResults = [
    {
      id: "1",
      title: "متجر المستلزمات الطبية",
      description: "مستلزمات طب الأسنان والمعدات",
      path: "/dental-supply",
      category: "خدمات",
      icon: "🏪",
    },
    {
      id: "2",
      title: "مركز الأطباء",
      description: "المركز المتكامل للأطباء",
      path: "/dentist-hub",
      category: "أدوات",
      icon: "👨‍⚕️",
    },
    {
      id: "3",
      title: "دليل العيادات",
      description: "العيادات المعتمدة والمتخصصة",
      path: "/dentist-hub/clinics",
      category: "خدمات",
      icon: "🏥",
    },
    {
      id: "4",
      title: "الوظائف المتاحة",
      description: "فرص العمل في مجال طب الأسنان",
      path: "/jobs",
      category: "وظائف",
      icon: "💼",
    },
  ];

  // البحث في النتائج
  useEffect(() => {
    if (query.trim()) {
      setLoading(true);
      // محاكاة API call
      setTimeout(() => {
        const filtered = searchResults.filter(
          (item) =>
            item.title.includes(query) ||
            item.description.includes(query) ||
            item.category.includes(query),
        );
        setResults(filtered);
        setLoading(false);
      }, 300);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* حقل البحث */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 text-lg outline-none"
            />
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 text-xs bg-gray-100 rounded border">
                <Command className="w-3 h-3 inline mr-1" />K
              </kbd>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* النتائج */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-gray-600">جاري البحث...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    to={result.path}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-2xl">{result.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {result.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {result.description}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {result.category}
                    </span>
                  </Link>
                ))}
              </div>
            ) : query ? (
              <div className="p-8 text-center text-gray-600">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>لا توجد نتائج لـ "{query}"</p>
                <p className="text-sm mt-1">جرب كلمات مختلفة أو أكثر عمومية</p>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-600">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>ابدأ الكتابة للبحث في جميع الأقسام</p>
                <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                  <span>اختصارات سريعة:</span>
                  <span className="text-blue-600">مستلزمات</span>
                  <span className="text-blue-600">عيادات</span>
                  <span className="text-blue-600">وظائف</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// مكون الإشعارات المحسن
interface NavigationNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: any[];
}

export const NavigationNotifications: React.FC<
  NavigationNotificationsProps
> = ({ isOpen, onClose, notifications = [] }) => {
  const [filter, setFilter] = useState<"all" | "unread" | "important">("all");

  // إشعارات وهمية
  const mockNotifications = [
    {
      id: "1",
      title: "موعد جديد تم حجزه",
      message: "تم حجز موعد جديد مع د. أحمد محمد",
      time: "منذ 5 دقائق",
      read: false,
      important: true,
      avatar:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=40&h=40&fit=crop",
    },
    {
      id: "2",
      title: "تحديث في المخزون",
      message: "انتهت كمية ��ادة التخدير من المخزون",
      time: "منذ 15 دقيقة",
      read: false,
      important: true,
      type: "warning",
    },
    {
      id: "3",
      title: "رسالة جديدة",
      message: "د. سارة أحمد أرسلت رسالة جديدة",
      time: "منذ ساعة",
      read: true,
      important: false,
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop",
    },
  ];

  const filteredNotifications = mockNotifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.read;
      case "important":
        return notification.important;
      default:
        return true;
    }
  });

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
      {/* الرأس */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">الإشعارات</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* فلاتر */}
        <div className="flex gap-2">
          {[
            { id: "all", label: "الكل", count: mockNotifications.length },
            {
              id: "unread",
              label: "غير مقروءة",
              count: mockNotifications.filter((n) => !n.read).length,
            },
            {
              id: "important",
              label: "مهمة",
              count: mockNotifications.filter((n) => n.important).length,
            },
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id as any)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                filter === filterOption.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              {filterOption.label}
              <span
                className={cn(
                  "ml-1 px-1.5 py-0.5 text-xs rounded-full",
                  filter === filterOption.id ? "bg-white/20" : "bg-gray-300",
                )}
              >
                {filterOption.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* قائمة الإشعارات */}
      <div className="max-h-80 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>لا توجد إشعارات</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 hover:bg-gray-50 transition-colors cursor-pointer",
                  !notification.read && "bg-blue-50/50",
                )}
              >
                <div className="flex items-start gap-3">
                  {notification.avatar ? (
                    <img
                      src={notification.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        notification.type === "warning"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-blue-100 text-blue-600",
                      )}
                    >
                      <Bell className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {notification.title}
                      </h4>
                      {notification.important && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notification.time}
                      </span>

                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* تذييل */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <Link
          to="/dentist-hub/notifications"
          onClick={onClose}
          className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          عرض جميع الإشعارات
        </Link>
      </div>
    </div>
  );
};

// مكون قائمة المستخدم
interface NavigationUserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    name: string;
    email: string;
    avatar: string;
    role: string;
  };
}

export const NavigationUserMenu: React.FC<NavigationUserMenuProps> = ({
  isOpen,
  onClose,
  user = {
    name: "د. أحمد محمد",
    email: "dr.ahmed@example.com",
    avatar:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
    role: "طبيب أسنان",
  },
}) => {
  const menuItems = [
    { id: "profile", label: "الملف الشخصي", path: "/profile", icon: User },
    { id: "settings", label: "الإعدادات", path: "/settings", icon: Settings },
    { id: "help", label: "المساعدة والدعم", path: "/help", icon: Bell },
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
      {/* معلومات المستخدم */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {user.name}
            </h3>
            <p className="text-sm text-gray-600 truncate">{user.email}</p>
            <span className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full mt-1">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* عناصر القائمة */}
      <div className="py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* تسجيل الخروج */}
      <div className="border-t border-gray-200 p-2">
        <button
          onClick={() => {
            // منطق تسجيل الخروج
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};

export default {
  NavigationSearch,
  NavigationNotifications,
  NavigationUserMenu,
};
