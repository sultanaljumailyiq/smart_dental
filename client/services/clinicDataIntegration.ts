/**
 * Clinic Data Integration Service
 * 
 * This service provides a centralized way to integrate and access clinic data
 * across different parts of the application (Smart Clinic, Clinic Manager, etc.)
 */

import { sharedClinicData, type Patient, type Appointment, type TreatmentPlan, type InventoryItem, type Staff, type LabOrder, type ClinicStats } from "./sharedClinicData";

export interface IntegratedClinicData {
  // Basic Stats
  totalPatients: number;
  todayAppointments: number;
  monthlyRevenue: number;
  lowStock: number;
  pendingLabOrders: number;
  
  // Advanced Stats
  avgPatientsPerDay: number;
  avgRevenuePerPatient: number;
  completionRate: number;
  patientRetentionRate: number;
  
  // Lists
  patients: Patient[];
  appointments: Appointment[];
  treatmentPlans: TreatmentPlan[];
  inventory: InventoryItem[];
  staff: Staff[];
  labOrders: LabOrder[];
  
  // Recent activities
  recentPatients: Patient[];
  upcomingAppointments: Appointment[];
  lowStockItems: InventoryItem[];
  pendingLabOrdersList: LabOrder[];
}

export interface ClinicInsight {
  type: "success" | "warning" | "info" | "danger";
  title: string;
  description: string;
  action?: {
    label: string;
    path: string;
  };
  priority: number;
}

class ClinicDataIntegrationService {
  private static instance: ClinicDataIntegrationService;

  static getInstance(): ClinicDataIntegrationService {
    if (!ClinicDataIntegrationService.instance) {
      ClinicDataIntegrationService.instance = new ClinicDataIntegrationService();
    }
    return ClinicDataIntegrationService.instance;
  }

  /**
   * Get all integrated clinic data for a specific clinic
   */
  async getIntegratedData(clinicId?: string): Promise<IntegratedClinicData> {
    // Fetch all data in parallel
    const [patients, appointments, treatmentPlans, inventory, staff, labOrders, stats] = 
      await Promise.all([
        sharedClinicData.getPatients(),
        sharedClinicData.getAppointments(),
        sharedClinicData.getTreatmentPlans(),
        sharedClinicData.getInventory(),
        sharedClinicData.getStaff(),
        sharedClinicData.getLabOrders(),
        sharedClinicData.getClinicStats(),
      ]);

    // Calculate advanced metrics
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentAppointments = appointments.filter(a => {
      const apptDate = new Date(a.date);
      return apptDate >= thirtyDaysAgo && apptDate <= today;
    });

    const avgPatientsPerDay = recentAppointments.length / 30;
    const avgRevenuePerPatient = patients.length > 0 
      ? patients.reduce((sum, p) => sum + p.totalSpent, 0) / patients.length 
      : 0;
    
    const completedAppointments = appointments.filter(a => a.status === "completed").length;
    const completionRate = appointments.length > 0 
      ? (completedAppointments / appointments.length) * 100 
      : 0;

    const activePatients = patients.filter(p => p.status === "active" || p.status === "in_treatment");
    const patientRetentionRate = patients.length > 0 
      ? (activePatients.length / patients.length) * 100 
      : 0;

    // Get recent and upcoming data
    const recentPatients = [...patients]
      .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
      .slice(0, 5);

    const upcomingAppointments = appointments
      .filter(a => {
        const apptDate = new Date(a.date);
        return apptDate >= today && (a.status === "scheduled" || a.status === "confirmed");
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);

    const lowStockItems = inventory.filter(i => i.status === "low_stock" || i.status === "out_of_stock");
    
    const pendingLabOrdersList = labOrders.filter(o => 
      o.status === "ordered" || o.status === "in_progress"
    );

    return {
      // Basic Stats
      totalPatients: stats.totalPatients,
      todayAppointments: stats.todayAppointments,
      monthlyRevenue: stats.monthlyRevenue,
      lowStock: stats.lowStock,
      pendingLabOrders: stats.pendingLabOrders,
      
      // Advanced Stats
      avgPatientsPerDay,
      avgRevenuePerPatient,
      completionRate,
      patientRetentionRate,
      
      // Lists
      patients,
      appointments,
      treatmentPlans,
      inventory,
      staff,
      labOrders,
      
      // Recent activities
      recentPatients,
      upcomingAppointments,
      lowStockItems,
      pendingLabOrdersList,
    };
  }

  /**
   * Generate AI-powered insights based on clinic data
   */
  async generateInsights(data: IntegratedClinicData): Promise<ClinicInsight[]> {
    const insights: ClinicInsight[] = [];

    // Low stock warning
    if (data.lowStock > 0) {
      insights.push({
        type: "warning",
        title: `${data.lowStock} عنصر بحاجة لإعادة طلب`,
        description: "بعض المستلزمات في المخزون أوشكت على النفاد",
        action: {
          label: "عرض المخزون",
          path: "/clinic/stocks",
        },
        priority: 1,
      });
    }

    // Pending lab orders
    if (data.pendingLabOrders > 0) {
      insights.push({
        type: "info",
        title: `${data.pendingLabOrders} طلب مختبر قيد التنفيذ`,
        description: "تابع حالة الطلبات لضمان التسليم في الموعد",
        action: {
          label: "عرض الطلبات",
          path: "/clinic/lab",
        },
        priority: 2,
      });
    }

    // Today's appointments
    if (data.todayAppointments > 0) {
      insights.push({
        type: "success",
        title: `${data.todayAppointments} موعد اليوم`,
        description: "لديك مواعيد مجدولة لهذا اليوم",
        action: {
          label: "عرض المواعيد",
          path: "/clinic/reservations",
        },
        priority: 3,
      });
    }

    // Completion rate
    if (data.completionRate < 80) {
      insights.push({
        type: "warning",
        title: `معدل الإكمال: ${data.completionRate.toFixed(0)}%`,
        description: "معدل إكمال المواعيد أقل من المتوقع",
        priority: 4,
      });
    }

    // Patient retention
    if (data.patientRetentionRate < 70) {
      insights.push({
        type: "danger",
        title: `معدل الاحتفاظ بالمرضى: ${data.patientRetentionRate.toFixed(0)}%`,
        description: "يُنصح بتحسين المتابعة مع المرضى",
        priority: 5,
      });
    }

    // Revenue insight
    if (data.monthlyRevenue > 0) {
      insights.push({
        type: "success",
        title: `الإيرادات الشهرية: ${data.monthlyRevenue.toLocaleString()} د.ع`,
        description: `متوسط ${data.avgRevenuePerPatient.toLocaleString()} د.ع لكل مريض`,
        action: {
          label: "عرض التقارير المالية",
          path: "/clinic/accounts",
        },
        priority: 6,
      });
    }

    return insights.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Format data for AI assistant context
   */
  formatForAIContext(data: IntegratedClinicData): string {
    return `
بيانات العيادة:
- عدد المرضى: ${data.totalPatients}
- المواعيد اليوم: ${data.todayAppointments}
- الإيرادات الشهرية: ${data.monthlyRevenue.toLocaleString()} د.ع
- المخزون المنخفض: ${data.lowStock} عنصر
- طلبات المختبر المعلقة: ${data.pendingLabOrders}
- متوسط المرضى يومياً: ${data.avgPatientsPerDay.toFixed(1)}
- متوسط الإيرادات للمريض: ${data.avgRevenuePerPatient.toLocaleString()} د.ع
- معدل الإكمال: ${data.completionRate.toFixed(1)}%
- معدل الاحتفاظ بالمرضى: ${data.patientRetentionRate.toFixed(1)}%
`.trim();
  }
}

export const clinicDataIntegration = ClinicDataIntegrationService.getInstance();
