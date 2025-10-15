import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  MessageSquare,
  ListTodo,
  Clock,
  X,
  Check,
  Star,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Package,
  Users,
  Calendar,
  DollarSign,
  Stethoscope,
  ShoppingCart,
  UserPlus,
  CalendarClock,
  FlaskConical,
  Pill,
  UserCheck,
  ArrowRight,
  Filter,
  MoreHorizontal,
  Headphones,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { unifiedNotificationsHub, type UnifiedNotificationItem } from '@/services/unifiedNotificationsHub';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UnifiedNotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  clinicId?: string;
  userId?: string;
}

type TabType = 'all' | 'notifications' | 'messages' | 'tasks' | 'reminders';

// تكوينات التبويبات الفرعية من الصفحات الأصلية
const MESSAGE_SUB_TABS = [
  { value: 'all', label: 'الكل', icon: Filter },
  { value: 'staff', label: 'الكادر', icon: Users },
  { value: 'supplier', label: 'الموردين', icon: Package },
  { value: 'support', label: 'الدعم الفني', icon: Headphones },
];

const TASK_SUB_TABS = [
  { value: 'all', label: 'الكل', icon: ListTodo },
  { value: 'treatment_plan', label: 'خطط علاج', icon: Stethoscope },
  { value: 'purchase_suggestion', label: 'اقتراحات شراء', icon: ShoppingCart },
  { value: 'patient_recall', label: 'استدعاءات مرضى', icon: UserPlus },
  { value: 'inventory_check', label: 'جرد مخزون', icon: Package },
  { value: 'appointment_followup', label: 'متابعة مواعيد', icon: CalendarClock },
  { value: 'lab_order', label: 'طلبات معمل', icon: FlaskConical },
];

const REMINDER_SUB_TABS = [
  { value: 'all', label: 'الكل', icon: Bell },
  { value: 'appointment', label: 'مواعيد', icon: Calendar },
  { value: 'medication', label: 'أدوية', icon: Pill },
  { value: 'followup', label: 'متابعة', icon: UserCheck },
  { value: 'lab_result', label: 'نتائج معمل', icon: FlaskConical },
  { value: 'payment', label: 'دفعات', icon: DollarSign },
  { value: 'general', label: 'عام', icon: Info },
];

export function UnifiedNotificationsPopover({
  isOpen,
  onClose,
  clinicId,
  userId,
}: UnifiedNotificationsPopoverProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [activeSubTab, setActiveSubTab] = useState<string>('all');
  const [items, setItems] = useState<UnifiedNotificationItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    notifications: { total: 0, unread: 0 },
    messages: { total: 0, unread: 0 },
    tasks: { total: 0, pending: 0, byType: {} },
    reminders: { total: 0, pending: 0, byType: {} },
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // إعادة تعيين التبويب الفرعي عند تغيير التبويب الرئيسي
  useEffect(() => {
    setActiveSubTab('all');
  }, [activeTab]);

  // تحميل البيانات
  const loadData = async () => {
    setLoading(true);
    try {
      const filters: any = { clinicId, userId };
      
      if (activeTab !== 'all') {
        filters.type = activeTab === 'notifications' ? 'notification' 
          : activeTab === 'messages' ? 'message'
          : activeTab === 'tasks' ? 'task'
          : 'reminder';
      }

      if (filter === 'unread') {
        filters.unreadOnly = true;
      }

      // إضافة فلترة بحسب التبويب الفرعي
      if (activeSubTab !== 'all') {
        filters.category = activeSubTab;
      }

      const fetchedItems = await unifiedNotificationsHub.getAllItems(filters);
      const fetchedStats = await unifiedNotificationsHub.getStats(clinicId, userId);
      
      setItems(fetchedItems);
      setStats(fetchedStats);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, activeTab, activeSubTab, filter, clinicId, userId]);

  // الاشتراك في التحديثات
  useEffect(() => {
    const unsubscribe = unifiedNotificationsHub.subscribe(() => {
      if (isOpen) {
        loadData();
      }
    });
    return unsubscribe;
  }, [isOpen]);

  // أيقونات الأنواع
  const getTypeIcon = (type: UnifiedNotificationItem['type'], category?: string) => {
    if (type === 'notification') {
      switch (category) {
        case 'appointment': return Calendar;
        case 'inventory': return Package;
        case 'patient': return Users;
        case 'financial': return DollarSign;
        case 'system': return AlertCircle;
        case 'community': return MessageSquare;
        default: return Bell;
      }
    } else if (type === 'message') {
      return MessageSquare;
    } else if (type === 'task') {
      switch (category) {
        case 'treatment_plan': return Stethoscope;
        case 'purchase_suggestion': return ShoppingCart;
        case 'patient_recall': return UserPlus;
        case 'inventory_check': return Package;
        case 'appointment_followup': return CalendarClock;
        case 'lab_order': return FlaskConical;
        default: return ListTodo;
      }
    } else {
      switch (category) {
        case 'appointment': return Calendar;
        case 'medication': return Pill;
        case 'followup': return UserCheck;
        case 'lab_result': return FlaskConical;
        case 'payment': return DollarSign;
        default: return Clock;
      }
    }
  };

  // ألوان الأولوية
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // ألوان النوع
  const getTypeColor = (type: UnifiedNotificationItem['type']) => {
    switch (type) {
      case 'notification': return 'text-blue-600 bg-blue-50';
      case 'message': return 'text-purple-600 bg-purple-50';
      case 'task': return 'text-emerald-600 bg-emerald-50';
      case 'reminder': return 'text-amber-600 bg-amber-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // عرض شارة الحالة
  const getStatusBadge = (item: UnifiedNotificationItem) => {
    if (item.type === 'task' && item.taskStatus) {
      const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        accepted: 'bg-blue-100 text-blue-700',
        rejected: 'bg-red-100 text-red-700',
        completed: 'bg-green-100 text-green-700',
      };
      const statusText = {
        pending: 'قيد الانتظار',
        accepted: 'مقبولة',
        rejected: 'مرفوضة',
        completed: 'مكتملة',
      };
      return (
        <Badge className={cn('text-xs', statusColors[item.taskStatus])}>
          {statusText[item.taskStatus]}
        </Badge>
      );
    }
    if (item.type === 'reminder' && item.reminderStatus) {
      const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        acknowledged: 'bg-green-100 text-green-700',
        snoozed: 'bg-blue-100 text-blue-700',
        dismissed: 'bg-gray-100 text-gray-700',
      };
      const statusText = {
        pending: 'جديد',
        acknowledged: 'تم الإقرار',
        snoozed: 'مؤجل',
        dismissed: 'تم الإغلاق',
      };
      return (
        <Badge className={cn('text-xs', statusColors[item.reminderStatus])}>
          {statusText[item.reminderStatus]}
        </Badge>
      );
    }
    return null;
  };

  // عرض معلومات طاقم العيادة
  const getStaffInfo = (item: UnifiedNotificationItem) => {
    if (item.type === 'task' || item.type === 'reminder') {
      if (item.fromStaffName && item.toStaffName) {
        return (
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span className="font-medium text-blue-600">{item.fromStaffName}</span>
            <ArrowRight className="w-3 h-3" />
            <span className="font-medium text-green-600">{item.toStaffName}</span>
          </div>
        );
      }
    }
    return null;
  };

  // تحديد كمقروء
  const handleMarkAsRead = async (item: UnifiedNotificationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    await unifiedNotificationsHub.markAsRead(item.id, item.type);
    loadData();
  };

  // حذف العنصر
  const handleDelete = async (item: UnifiedNotificationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    await unifiedNotificationsHub.deleteItem(item.id, item.type);
    loadData();
  };

  // تبديل النجمة
  const handleToggleStar = (item: UnifiedNotificationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'notification' || item.type === 'message') {
      unifiedNotificationsHub.toggleStar(item.id, item.type);
      loadData();
    }
  };

  // فتح العنصر والتنقل إلى القسم المناسب
  const handleOpenItem = async (item: UnifiedNotificationItem) => {
    if (!item.read) {
      await unifiedNotificationsHub.markAsRead(item.id, item.type);
    }
    
    // إذا كان هناك رابط مخصص، استخدمه
    if (item.actionUrl) {
      navigate(item.actionUrl);
      onClose();
      return;
    }
    
    // وإلا، حدد الوجهة حسب نوع العنصر
    if (item.type === 'reminder' || item.type === 'task') {
      navigate('/dentist-hub/tasks-reminders');
    } else if (item.type === 'notification') {
      navigate('/dentist-hub/notifications');
    } else if (item.type === 'message') {
      navigate('/dentist-hub/messages');
    }
    
    onClose();
  };

  // تحديد الكل كمقروء
  const handleMarkAllAsRead = async () => {
    if (activeTab === 'all') {
      await unifiedNotificationsHub.markAllAsRead();
    } else {
      const type = activeTab === 'notifications' ? 'notification'
        : activeTab === 'messages' ? 'message'
        : activeTab === 'tasks' ? 'task'
        : 'reminder';
      await unifiedNotificationsHub.markAllAsRead(type as any);
    }
    loadData();
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'all', label: 'الكل', count: stats.total, unread: stats.unread },
    { id: 'notifications', label: 'إشعارات', count: stats.notifications.total, unread: stats.notifications.unread },
    { id: 'messages', label: 'رسائل', count: stats.messages.total, unread: stats.messages.unread },
    { id: 'tasks', label: 'مهام', count: stats.tasks.total, unread: stats.tasks.pending },
    { id: 'reminders', label: 'تذكيرات', count: stats.reminders.total, unread: stats.reminders.pending },
  ];

  return (
    <div className="absolute top-12 right-0 w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">مركز الإشعارات</h3>
              <p className="text-xs text-gray-600">{stats.unread} غير مقروء</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5',
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-white/50'
              )}
            >
              <span>{tab.label}</span>
              {tab.unread > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {tab.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sub Tabs - التبويبات الفرعية */}
      {(activeTab === 'messages' || activeTab === 'tasks' || activeTab === 'reminders') && (
        <div className="px-4 py-2 bg-white border-b border-gray-100">
          <div className="flex gap-1 overflow-x-auto scrollbar-thin">
            {(activeTab === 'messages' ? MESSAGE_SUB_TABS :
              activeTab === 'tasks' ? TASK_SUB_TABS :
              REMINDER_SUB_TABS).map((subTab) => {
                const Icon = subTab.icon;
                return (
                  <button
                    key={subTab.value}
                    onClick={() => setActiveSubTab(subTab.value)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1',
                      activeSubTab === subTab.value
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{subTab.label}</span>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-medium transition-all',
              filter === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:bg-white/50'
            )}
          >
            الكل
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-medium transition-all',
              filter === 'unread'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:bg-white/50'
            )}
          >
            غير مقروء
          </button>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          تحديد الكل كمقروء
        </button>
      </div>

      {/* Items List */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>جاري التحميل...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="font-medium">لا توجد عناصر</p>
            <p className="text-sm">ستظهر {activeTab === 'all' ? 'الإشعارات' : tabs.find(t => t.id === activeTab)?.label} هنا</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((item) => {
              const Icon = getTypeIcon(item.type, item.category);
              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenItem(item)}
                  className={cn(
                    'p-4 hover:bg-gray-50 transition-all cursor-pointer group',
                    !item.read && 'bg-blue-50/30'
                  )}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      getTypeColor(item.type)
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={cn(
                          'text-sm font-medium line-clamp-1',
                          !item.read ? 'text-gray-900' : 'text-gray-600'
                        )}>
                          {item.title}
                        </h4>
                        {!item.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {item.description}
                      </p>

                      {/* Staff Info */}
                      {getStaffInfo(item)}

                      {/* Meta */}
                      <div className="flex items-center justify-between gap-2 mt-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getStatusBadge(item)}
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(item.timestamp, { addSuffix: true, locale: ar })}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {(item.type === 'notification' || item.type === 'message') && (
                            <button
                              onClick={(e) => handleToggleStar(item, e)}
                              className={cn(
                                'p-1.5 rounded-lg transition-colors',
                                item.starred
                                  ? 'text-yellow-500 hover:bg-yellow-50'
                                  : 'text-gray-400 hover:bg-gray-100'
                              )}
                            >
                              <Star className={cn('w-4 h-4', item.starred && 'fill-current')} />
                            </button>
                          )}
                          {!item.read && (
                            <button
                              onClick={(e) => handleMarkAsRead(item, e)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="تحديد كمقروء"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDelete(item, e)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/dentist-hub/notifications"
            onClick={onClose}
            className="px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-center"
          >
            عرض جميع الإشعارات
          </Link>
          <Link
            to="/dentist-hub/tasks-reminders"
            onClick={onClose}
            className="px-3 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-center"
          >
            المهام والتذكيرات
          </Link>
        </div>
      </div>
    </div>
  );
}
