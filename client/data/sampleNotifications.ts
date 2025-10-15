import { NotificationData } from "@/components/CardBasedNotifications";

export const sampleNotifications: NotificationData[] = [
  // رسائل
  {
    id: "msg-1",
    type: "message",
    title: "رسالة جديدة من المريض أحمد محمد",
    message: "السلام عليكم دكتور، أريد الاستفسار عن موعد المراجعة القادمة",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    priority: "high",
    metadata: {
      senderId: "patient-123",
      senderName: "أحمد محمد",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      messagePreview: "السلام عليكم دكتور، أريد الاستفسار...",
    },
  },
  {
    id: "msg-2",
    type: "message",
    title: "رسالة من طاقم العمل",
    message: "تم تحديث جدول المواعيد لهذا الأسبوع",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    priority: "medium",
    metadata: {
      senderId: "staff-456",
      senderName: "فاطمة أحمد - السكرتيرة",
      messagePreview: "تم تحديث جدول المواعيد...",
    },
  },

  // مهام
  {
    id: "task-1",
    type: "task",
    title: "مهمة جديدة: مراجعة تقرير المختبر",
    message: "يرجى مراجعة تقرير المختبر للمريضة سارة علي والموافقة على خطة العلاج",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    read: false,
    priority: "high",
    metadata: {
      taskId: "task-789",
      taskTitle: "مراجعة تقرير المختبر",
      dueDate: "اليوم - 5:00 م",
      assignedBy: "د. محمد الرحمة",
    },
  },
  {
    id: "task-2",
    type: "task",
    title: "مهمة معلقة: إكمال خطة العلاج",
    message: "لديك خطة علاج معلقة للمريض خالد أحمد تحتاج للإكمال",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    priority: "medium",
    metadata: {
      taskId: "task-456",
      taskTitle: "إكمال خطة العلاج",
      dueDate: "غداً - 10:00 ص",
    },
  },

  // تذكيرات
  {
    id: "reminder-1",
    type: "reminder",
    title: "تذكير: موعد مع المريضة ليلى أحمد",
    message: "لديك موعد مع المريضة ليلى أحمد بعد ساعة واحدة لإجراء تنظيف الأسنان",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    read: false,
    priority: "urgent",
    metadata: {
      reminderId: "reminder-123",
      reminderDate: "اليوم - 3:00 م",
      reminderType: "موعد",
      patientName: "ليلى أحمد",
    },
  },
  {
    id: "reminder-2",
    type: "reminder",
    title: "تذكير: طلب مستلزمات طبية",
    message: "تذكير بطلب المستلزمات الطبية من المورد قبل نهاية الأسبوع",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
    priority: "medium",
    metadata: {
      reminderId: "reminder-456",
      reminderDate: "الجمعة",
      reminderType: "مهمة إدارية",
    },
  },

  // مواعيد
  {
    id: "appt-1",
    type: "appointment",
    title: "موعد جديد مؤكد",
    message: "تم تأكيد موعد المريض علي حسن غداً الساعة 10:00 صباحاً لزراعة الأسنان",
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    read: false,
    priority: "high",
    metadata: {
      appointmentId: "appt-789",
      patientName: "علي حسن",
      appointmentDate: "غداً",
      appointmentTime: "10:00 ص",
    },
  },
  {
    id: "appt-2",
    type: "appointment",
    title: "تم إلغاء موعد",
    message: "قام المريض محمد خالد بإلغاء موعده المحدد ليوم الخميس",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: true,
    priority: "medium",
    metadata: {
      appointmentId: "appt-456",
      patientName: "محمد خالد",
      appointmentDate: "الخميس",
      appointmentTime: "2:00 م",
    },
  },

  // مدفوعات
  {
    id: "payment-1",
    type: "payment",
    title: "تم استلام دفعة مالية",
    message: "تم استلام دفعة بقيمة 500,000 دينار من المريضة فاطمة علي",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    read: false,
    priority: "high",
    metadata: {
      paymentId: "pay-123",
      amount: "500,000 د.ع",
      paymentType: "زين كاش",
      patientName: "فاطمة علي",
    },
  },
  {
    id: "payment-2",
    type: "payment",
    title: "دفعة معلقة",
    message: "لديك دفعة معلقة بقيمة 300,000 دينار من المريض سعد محمود",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: true,
    priority: "medium",
    metadata: {
      paymentId: "pay-456",
      amount: "300,000 د.ع",
      paymentType: "نقداً",
      patientName: "سعد محمود",
    },
  },

  // طلبات
  {
    id: "order-1",
    type: "order",
    title: "طلب جديد من المورد",
    message: "وصل طلبك من شركة الأسنان الطبية - 50 عبوة قفازات طبية",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    read: false,
    priority: "medium",
    metadata: {
      orderId: "order-789",
      orderStatus: "تم التوصيل",
      supplierName: "شركة الأسنان الطبية",
    },
  },
  {
    id: "order-2",
    type: "order",
    title: "طلب قيد التجهيز",
    message: "طلبك من شركة المستلزمات الحديثة قيد التجهيز وسيصل خلال يومين",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
    priority: "low",
    metadata: {
      orderId: "order-456",
      orderStatus: "قيد التجهيز",
      supplierName: "شركة المستلزمات الحديثة",
    },
  },

  // إنجازات
  {
    id: "achievement-1",
    type: "achievement",
    title: "🎉 إنجاز جديد: 100 مريض راضي",
    message: "مبروك! لقد وصلت إلى 100 مريض راضي هذا الشهر. تم منحك شارة 'طبيب مميز'",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: false,
    priority: "low",
    metadata: {
      relatedName: "شارة طبيب مميز",
    },
  },

  // طوارئ
  {
    id: "emergency-1",
    type: "emergency",
    title: "⚠️ حالة طوارئ",
    message: "المريضة رنا حسن تعاني من ألم شديد وتحتاج لاستشارة عاجلة",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    priority: "urgent",
    metadata: {
      patientName: "رنا حسن",
      relatedId: "patient-emergency-789",
    },
  },

  // نظام
  {
    id: "system-1",
    type: "system",
    title: "تحديث النظام",
    message: "تم تحديث نظام المنصة إلى الإصدار 2.5 مع ميزات جديدة",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    priority: "low",
  },
];
