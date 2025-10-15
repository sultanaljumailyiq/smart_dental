// خدمة مشتركة للإشعارات والتذكيرات والرسائل
// تربط بين صفحة الإشعارات الموحدة وصفحات إدارة العيادة

export interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "error" | "urgent" | "celebration";
  category: "appointment" | "inventory" | "patient" | "financial" | "system" | "message" | "community" | "marketplace" | "achievement" | "reminder";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  actionUrl?: string;
  actionText?: string;
  avatar?: string;
  reactions?: number;
  attachments?: string[];
  tags?: string[];
  sourceSection?: string;
}

export interface Message {
  id: string;
  type: "suppliers" | "support" | "staff" | "community" | "jobs";
  senderName: string;
  senderRole?: string;
  senderAvatar?: string;
  subject: string;
  message: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  attachments?: string[];
  isOnline?: boolean;
  unreadCount?: number;
  lastMessage?: string;
  sourceSection?: string;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  priority: "low" | "medium" | "high" | "urgent";
  dueAt: string;
  createdAt: Date;
  completed: boolean;
  sourceSection?: string;
}

class NotificationsService {
  private notifications: Notification[] = [];
  private messages: Message[] = [];
  private reminders: Reminder[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromLocalStorage();
  }

  // تحميل البيانات من localStorage
  private loadFromLocalStorage() {
    if (typeof window === 'undefined' || !window.localStorage) return;
    
    try {
      const stored = localStorage.getItem('unified_notifications');
      if (stored) {
        const data = JSON.parse(stored);
        this.notifications = data.notifications?.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        })) || [];
        this.messages = data.messages?.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })) || [];
        this.reminders = data.reminders?.map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt),
        })) || [];
      }
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error);
    }
  }

  // حفظ البيانات في localStorage
  private saveToLocalStorage() {
    if (typeof window === 'undefined' || !window.localStorage) {
      this.notifyListeners();
      return;
    }
    
    try {
      const data = {
        notifications: this.notifications,
        messages: this.messages,
        reminders: this.reminders,
      };
      localStorage.setItem('unified_notifications', JSON.stringify(data));
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
    }
  }

  // إضافة مستمع للتغييرات
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // إشعار جميع المستمعين بالتغييرات
  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // === إدارة الإشعارات ===
  
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'starred'>) {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
      starred: false,
    };
    this.notifications.unshift(newNotification);
    this.saveToLocalStorage();
    return newNotification;
  }

  getNotifications(sourceSection?: string): Notification[] {
    if (sourceSection) {
      return this.notifications.filter(n => n.sourceSection === sourceSection);
    }
    return this.notifications;
  }

  getUnreadNotificationsCount(sourceSection?: string): number {
    const notifications = this.getNotifications(sourceSection);
    return notifications.filter(n => !n.read).length;
  }

  markNotificationAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveToLocalStorage();
    }
  }

  markAllNotificationsAsRead(sourceSection?: string) {
    const notifications = this.getNotifications(sourceSection);
    notifications.forEach(n => n.read = true);
    this.saveToLocalStorage();
  }

  deleteNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveToLocalStorage();
  }

  toggleNotificationStar(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.starred = !notification.starred;
      this.saveToLocalStorage();
    }
  }

  // === إدارة الرسائل ===
  
  addMessage(message: Omit<Message, 'id' | 'timestamp' | 'read' | 'starred'>) {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
      starred: false,
    };
    this.messages.unshift(newMessage);
    this.saveToLocalStorage();
    return newMessage;
  }

  getMessages(sourceSection?: string): Message[] {
    if (sourceSection) {
      return this.messages.filter(m => m.sourceSection === sourceSection);
    }
    return this.messages;
  }

  getUnreadMessagesCount(sourceSection?: string): number {
    const messages = this.getMessages(sourceSection);
    return messages.filter(m => !m.read).length;
  }

  markMessageAsRead(id: string) {
    const message = this.messages.find(m => m.id === id);
    if (message) {
      message.read = true;
      this.saveToLocalStorage();
    }
  }

  markAllMessagesAsRead(sourceSection?: string) {
    const messages = this.getMessages(sourceSection);
    messages.forEach(m => m.read = true);
    this.saveToLocalStorage();
  }

  deleteMessage(id: string) {
    this.messages = this.messages.filter(m => m.id !== id);
    this.saveToLocalStorage();
  }

  toggleMessageStar(id: string) {
    const message = this.messages.find(m => m.id === id);
    if (message) {
      message.starred = !message.starred;
      this.saveToLocalStorage();
    }
  }

  // === إدارة التذكيرات ===
  
  addReminder(reminder: Omit<Reminder, 'id' | 'createdAt' | 'completed'>) {
    const newReminder: Reminder = {
      ...reminder,
      id: `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      completed: false,
    };
    this.reminders.unshift(newReminder);
    this.saveToLocalStorage();
    return newReminder;
  }

  getReminders(sourceSection?: string): Reminder[] {
    if (sourceSection) {
      return this.reminders.filter(r => r.sourceSection === sourceSection);
    }
    return this.reminders;
  }

  getUpcomingRemindersCount(sourceSection?: string): number {
    const reminders = this.getReminders(sourceSection);
    const now = new Date();
    return reminders.filter(r => !r.completed && new Date(r.dueAt) >= now).length;
  }

  toggleReminderCompletion(id: string) {
    const reminder = this.reminders.find(r => r.id === id);
    if (reminder) {
      reminder.completed = !reminder.completed;
      this.saveToLocalStorage();
    }
  }

  deleteReminder(id: string) {
    this.reminders = this.reminders.filter(r => r.id !== id);
    this.saveToLocalStorage();
  }

  updateReminder(id: string, updates: Partial<Reminder>) {
    const reminder = this.reminders.find(r => r.id === id);
    if (reminder) {
      Object.assign(reminder, updates);
      this.saveToLocalStorage();
    }
  }

  // === إحصائيات شاملة ===
  
  getStats(sourceSection?: string) {
    return {
      unreadNotifications: this.getUnreadNotificationsCount(sourceSection),
      unreadMessages: this.getUnreadMessagesCount(sourceSection),
      upcomingReminders: this.getUpcomingRemindersCount(sourceSection),
      totalNotifications: this.getNotifications(sourceSection).length,
      totalMessages: this.getMessages(sourceSection).length,
      totalReminders: this.getReminders(sourceSection).length,
    };
  }
}

// إنشاء نسخة واحدة من الخدمة
export const notificationsService = new NotificationsService();
