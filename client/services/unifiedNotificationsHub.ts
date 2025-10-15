// خدمة مركزية موحدة لجميع الإشعارات والرسائل والمهام والتذكيرات
// تدمج البيانات من جميع المصادر وتوفر واجهة موحدة للوصول

import { notificationsService, type Notification, type Message } from './notificationsService';
import { sharedClinicData, type StaffTask, type StaffReminder } from './sharedClinicData';

// نوع موحد لجميع العناصر في المركز
export type UnifiedNotificationItem = {
  id: string;
  type: 'notification' | 'message' | 'task' | 'reminder';
  category: string;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  starred?: boolean;
  
  // معلومات إضافية حسب النوع
  senderName?: string;
  senderRole?: string;
  senderAvatar?: string;
  isOnline?: boolean;
  
  // معلومات المهام
  fromStaffId?: string;
  fromStaffName?: string;
  toStaffId?: string;
  toStaffName?: string;
  taskStatus?: 'pending' | 'accepted' | 'rejected' | 'completed';
  taskType?: string;
  
  // معلومات التذكيرات
  reminderTime?: string;
  reminderStatus?: 'pending' | 'acknowledged' | 'snoozed' | 'dismissed';
  reminderType?: string;
  snoozedUntil?: string;
  
  // روابط وإجراءات
  actionUrl?: string;
  actionText?: string;
  attachments?: string[];
  
  // البيانات الأصلية
  originalData: Notification | Message | StaffTask | StaffReminder;
};

// إحصائيات شاملة
export interface UnifiedStats {
  total: number;
  unread: number;
  notifications: {
    total: number;
    unread: number;
  };
  messages: {
    total: number;
    unread: number;
  };
  tasks: {
    total: number;
    pending: number;
    byType: Record<string, number>;
  };
  reminders: {
    total: number;
    pending: number;
    byType: Record<string, number>;
  };
}

class UnifiedNotificationsHubService {
  private static instance: UnifiedNotificationsHubService;
  private listeners: Set<() => void> = new Set();

  private constructor() {
    // الاشتراك في تغييرات notificationsService
    notificationsService.subscribe(() => {
      this.notifyListeners();
    });
  }

  static getInstance(): UnifiedNotificationsHubService {
    if (!UnifiedNotificationsHubService.instance) {
      UnifiedNotificationsHubService.instance = new UnifiedNotificationsHubService();
    }
    return UnifiedNotificationsHubService.instance;
  }

  // الاشتراك في التحديثات
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // تحويل الإشعار إلى عنصر موحد
  private notificationToUnified(notification: Notification): UnifiedNotificationItem {
    return {
      id: notification.id,
      type: 'notification',
      category: notification.category,
      title: notification.title,
      description: notification.message,
      timestamp: notification.timestamp,
      read: notification.read,
      priority: notification.priority,
      starred: notification.starred,
      actionUrl: notification.actionUrl,
      actionText: notification.actionText,
      attachments: notification.attachments,
      originalData: notification,
    };
  }

  // تحويل الرسالة إلى عنصر موحد
  private messageToUnified(message: Message): UnifiedNotificationItem {
    return {
      id: message.id,
      type: 'message',
      category: message.type,
      title: message.subject,
      description: message.lastMessage || message.message,
      timestamp: message.timestamp,
      read: message.read,
      priority: message.priority,
      starred: message.starred,
      senderName: message.senderName,
      senderRole: message.senderRole,
      senderAvatar: message.senderAvatar,
      isOnline: message.isOnline,
      attachments: message.attachments,
      originalData: message,
    };
  }

  // تحويل المهمة إلى عنصر موحد
  private taskToUnified(task: StaffTask): UnifiedNotificationItem {
    return {
      id: task.id,
      type: 'task',
      category: task.taskType || 'general',
      title: task.title,
      description: task.description || '',
      timestamp: new Date(task.createdAt),
      read: task.status !== 'pending',
      priority: task.priority,
      fromStaffId: task.fromStaffId,
      fromStaffName: task.fromStaffName,
      toStaffId: task.toStaffId,
      toStaffName: task.toStaffName,
      taskStatus: task.status,
      taskType: task.taskType,
      actionUrl: `/dentist-hub/tasks-reminders`,
      originalData: task,
    };
  }

  // تحويل التذكير إلى عنصر موحد
  private reminderToUnified(reminder: StaffReminder): UnifiedNotificationItem {
    return {
      id: reminder.id,
      type: 'reminder',
      category: reminder.reminderType || 'general',
      title: reminder.title,
      description: reminder.description || '',
      timestamp: new Date(reminder.createdAt),
      read: reminder.status !== 'pending',
      priority: 'medium', // التذكيرات عادة متوسطة الأهمية
      fromStaffId: reminder.fromStaffId,
      fromStaffName: reminder.fromStaffName,
      toStaffId: reminder.toStaffId,
      toStaffName: reminder.toStaffName,
      reminderTime: reminder.reminderTime,
      reminderStatus: reminder.status,
      reminderType: reminder.reminderType,
      snoozedUntil: reminder.snoozedUntil,
      actionUrl: `/dentist-hub/tasks-reminders`,
      originalData: reminder,
    };
  }

  // جلب جميع العناصر
  async getAllItems(filters?: {
    type?: 'notification' | 'message' | 'task' | 'reminder';
    category?: string;
    unreadOnly?: boolean;
    clinicId?: string;
    userId?: string;
  }): Promise<UnifiedNotificationItem[]> {
    const items: UnifiedNotificationItem[] = [];

    try {
      // جلب الإشعارات
      if (!filters?.type || filters.type === 'notification') {
        const notifications = notificationsService.getNotifications();
        items.push(...notifications.map(n => this.notificationToUnified(n)));
      }

      // جلب الرسائل
      if (!filters?.type || filters.type === 'message') {
        const messages = notificationsService.getMessages();
        items.push(...messages.map(m => this.messageToUnified(m)));
      }

      // جلب المهام
      if (!filters?.type || filters.type === 'task') {
        const tasks = await sharedClinicData.getStaffTasks(filters?.clinicId);
        // تصفية المهام حسب المستخدم إذا كان محدداً
        const filteredTasks = filters?.userId 
          ? tasks.filter(t => t.toStaffId === filters.userId || t.fromStaffId === filters.userId)
          : tasks;
        items.push(...filteredTasks.map(t => this.taskToUnified(t)));
      }

      // جلب التذكيرات
      if (!filters?.type || filters.type === 'reminder') {
        const reminders = await sharedClinicData.getStaffReminders(filters?.clinicId);
        // تصفية التذكيرات حسب المستخدم إذا كان محدداً
        const filteredReminders = filters?.userId
          ? reminders.filter(r => r.toStaffId === filters.userId || r.fromStaffId === filters.userId)
          : reminders;
        items.push(...filteredReminders.map(r => this.reminderToUnified(r)));
      }

      // تطبيق فلاتر إضافية
      let filtered = items;

      if (filters?.category) {
        filtered = filtered.filter(item => item.category === filters.category);
      }

      if (filters?.unreadOnly) {
        filtered = filtered.filter(item => !item.read);
      }

      // ترتيب حسب التاريخ (الأحدث أولاً)
      filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      return filtered;
    } catch (error) {
      console.error('Error fetching unified items:', error);
      return [];
    }
  }

  // جلب الإحصائيات الشاملة
  async getStats(clinicId?: string, userId?: string): Promise<UnifiedStats> {
    try {
      const notifStats = notificationsService.getStats();
      const tasks = await sharedClinicData.getStaffTasks(clinicId);
      const reminders = await sharedClinicData.getStaffReminders(clinicId);

      // تصفية حسب المستخدم
      const userTasks = userId 
        ? tasks.filter(t => t.toStaffId === userId || t.fromStaffId === userId)
        : tasks;
      const userReminders = userId
        ? reminders.filter(r => r.toStaffId === userId || r.fromStaffId === userId)
        : reminders;

      // إحصائيات المهام حسب النوع
      const tasksByType: Record<string, number> = {};
      userTasks.forEach(task => {
        const type = task.taskType || 'general';
        tasksByType[type] = (tasksByType[type] || 0) + 1;
      });

      // إحصائيات التذكيرات حسب النوع
      const remindersByType: Record<string, number> = {};
      userReminders.forEach(reminder => {
        const type = reminder.reminderType || 'general';
        remindersByType[type] = (remindersByType[type] || 0) + 1;
      });

      const pendingTasks = userTasks.filter(t => t.status === 'pending').length;
      const pendingReminders = userReminders.filter(r => r.status === 'pending').length;

      return {
        total: notifStats.totalNotifications + notifStats.totalMessages + userTasks.length + userReminders.length,
        unread: notifStats.unreadNotifications + notifStats.unreadMessages + pendingTasks + pendingReminders,
        notifications: {
          total: notifStats.totalNotifications,
          unread: notifStats.unreadNotifications,
        },
        messages: {
          total: notifStats.totalMessages,
          unread: notifStats.unreadMessages,
        },
        tasks: {
          total: userTasks.length,
          pending: pendingTasks,
          byType: tasksByType,
        },
        reminders: {
          total: userReminders.length,
          pending: pendingReminders,
          byType: remindersByType,
        },
      };
    } catch (error) {
      console.error('Error fetching unified stats:', error);
      return {
        total: 0,
        unread: 0,
        notifications: { total: 0, unread: 0 },
        messages: { total: 0, unread: 0 },
        tasks: { total: 0, pending: 0, byType: {} },
        reminders: { total: 0, pending: 0, byType: {} },
      };
    }
  }

  // تحديد العنصر كمقروء
  async markAsRead(itemId: string, itemType: 'notification' | 'message' | 'task' | 'reminder'): Promise<void> {
    try {
      if (itemType === 'notification') {
        notificationsService.markNotificationAsRead(itemId);
      } else if (itemType === 'message') {
        notificationsService.markMessageAsRead(itemId);
      } else if (itemType === 'task') {
        // المهام تُعتبر مقروءة عند قبولها أو رفضها
        // لا نغير حالتها هنا مباشرة
      } else if (itemType === 'reminder') {
        // التذكيرات تُعتبر مقروءة عند الإقرار بها
        await sharedClinicData.updateStaffReminder(itemId, { 
          status: 'acknowledged',
          acknowledgedAt: new Date().toISOString()
        });
      }
      this.notifyListeners();
    } catch (error) {
      console.error('Error marking item as read:', error);
    }
  }

  // تحديد جميع العناصر كمقروءة
  async markAllAsRead(itemType?: 'notification' | 'message' | 'task' | 'reminder'): Promise<void> {
    try {
      if (!itemType || itemType === 'notification') {
        notificationsService.markAllNotificationsAsRead();
      }
      if (!itemType || itemType === 'message') {
        notificationsService.markAllMessagesAsRead();
      }
      // المهام والتذكيرات تتطلب إجراءات محددة لكل منها
      this.notifyListeners();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }

  // حذف عنصر
  async deleteItem(itemId: string, itemType: 'notification' | 'message' | 'task' | 'reminder'): Promise<void> {
    try {
      if (itemType === 'notification') {
        notificationsService.deleteNotification(itemId);
      } else if (itemType === 'message') {
        notificationsService.deleteMessage(itemId);
      } else if (itemType === 'task') {
        await sharedClinicData.deleteStaffTask(itemId);
      } else if (itemType === 'reminder') {
        await sharedClinicData.deleteStaffReminder(itemId);
      }
      this.notifyListeners();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  // تبديل النجمة (للإشعارات والرسائل فقط)
  toggleStar(itemId: string, itemType: 'notification' | 'message'): void {
    if (itemType === 'notification') {
      notificationsService.toggleNotificationStar(itemId);
    } else if (itemType === 'message') {
      notificationsService.toggleMessageStar(itemId);
    }
    this.notifyListeners();
  }
}

// إنشاء نسخة واحدة من الخدمة
export const unifiedNotificationsHub = UnifiedNotificationsHubService.getInstance();
