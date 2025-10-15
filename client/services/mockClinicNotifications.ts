// بيانات وهمية لإشعارات وتذكيرات العيادة
import { notificationsService } from './notificationsService';

export function initializeClinicNotifications() {
  // تحقق إذا كانت البيانات الوهمية موجودة بالفعل
  if (typeof window === 'undefined' || !window.localStorage) return;
  
  const existingData = localStorage.getItem('unified_notifications');
  if (existingData && JSON.parse(existingData).notifications?.length > 0) {
    return; // البيانات موجودة بالفعل
  }

  // إضافة إشعارات خاصة بالعيادة
  notificationsService.addNotification({
    type: "urgent",
    category: "appointment",
    title: "موعد عاجل خلال 15 دقيقة!",
    message: "المريض أحمد محمد - فحص دوري",
    priority: "urgent",
    actionUrl: "/clinic/reservations",
    actionText: "عرض الموعد",
    tags: ["عاجل", "موعد"],
    sourceSection: "clinic"
  });

  notificationsService.addNotification({
    type: "warning",
    category: "inventory",
    title: "نفاد المخزون قريباً",
    message: "مادة التخدير الموضعي - تبقى 5 وحدات فقط",
    priority: "high",
    actionUrl: "/clinic/stocks",
    actionText: "طلب مواد",
    tags: ["مخزون", "تحذير"],
    sourceSection: "clinic"
  });

  notificationsService.addNotification({
    type: "success",
    category: "financial",
    title: "تم استلام دفعة جديدة",
    message: "تم استلام 2,500,000 د.ع من المريضة فاطمة علي",
    priority: "medium",
    actionUrl: "/clinic/accounts",
    actionText: "عرض التفاصيل",
    tags: ["دفعة", "مالية"],
    sourceSection: "clinic"
  });

  notificationsService.addNotification({
    type: "info",
    category: "patient",
    title: "مريض جديد",
    message: "تم إضافة المريض علي حسن إلى النظام",
    priority: "low",
    actionUrl: "/clinic/patients",
    actionText: "عرض الملف",
    tags: ["مريض جديد"],
    sourceSection: "clinic"
  });

  // إضافة رسائل خاصة بالعيادة
  notificationsService.addMessage({
    type: "staff",
    senderName: "د. سارة أحمد",
    senderRole: "طبيبة أسنان",
    subject: "استشارة حالة طارئة",
    message: "أحتاج استشارتك في حالة المريض محمد علي - حالة طارئة",
    priority: "high",
    sourceSection: "clinic"
  });

  notificationsService.addMessage({
    type: "suppliers",
    senderName: "شركة الأدوية العراقية",
    senderRole: "مورد معتمد",
    subject: "عرض خاص - خصم 20%",
    message: "عرض خاص على مواد التخدير والحشوات - صالح لمدة 3 أيام",
    priority: "medium",
    attachments: ["عرض-خاص.pdf"],
    sourceSection: "clinic"
  });

  // إضافة تذكيرات خاصة بالعيادة
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  notificationsService.addReminder({
    title: "متابعة المريض أحمد علي",
    description: "فحص الحشوة بعد أسبوع من العلاج",
    assigneeId: "doctor_1",
    assigneeName: "د. محمد حسن",
    priority: "high",
    dueAt: tomorrow.toISOString(),
    sourceSection: "clinic"
  });

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(14, 30, 0, 0);

  notificationsService.addReminder({
    title: "طلب مواد من المورد",
    description: "طلب مواد تخدير وحشوات من المورد الرئيسي",
    assigneeId: "admin_1",
    assigneeName: "المدير المالي",
    priority: "medium",
    dueAt: nextWeek.toISOString(),
    sourceSection: "clinic"
  });

  const today = new Date();
  today.setHours(16, 0, 0, 0);

  notificationsService.addReminder({
    title: "مراجعة التقارير اليومية",
    description: "مراجعة تقارير الإيرادات والمصروفات اليومية",
    assigneeId: "doctor_1",
    assigneeName: "د. محمد حسن",
    priority: "low",
    dueAt: today.toISOString(),
    sourceSection: "clinic"
  });

  console.log('✅ تم تهيئة بيانات الإشعارات والتذكيرات الخاصة بالعيادة');
}
