import { patientDentalService } from "./patientDentalService";
import { notificationsService } from "./notificationsService";
import type { ToothTreatment, TreatmentPrognosis, TreatmentSuggestion } from "@/types/dental";

interface DentalHubTask {
  id: string;
  patientId: string;
  patientName: string;
  toothNumber?: number;
  treatmentId?: string;
  taskType: "treatment_followup" | "lab_order" | "appointment" | "payment_reminder";
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high" | "urgent";
  completed: boolean;
}

class DentalHubSync {
  private readonly TASKS_KEY = "dental_hub_tasks";
  private readonly SUMMARY_KEY = "dental_hub_summary";

  // Create task from treatment
  createTaskFromTreatment(
    patientId: string,
    patientName: string,
    toothNumber: number,
    treatment: ToothTreatment
  ): void {
    const tasks = this.getTasks();

    // Create follow-up task if treatment is in progress
    if (treatment.status === "in_progress" || treatment.status === "planning") {
      const task: DentalHubTask = {
        id: `task_${Date.now()}`,
        patientId,
        patientName,
        toothNumber,
        treatmentId: treatment.id,
        taskType: "treatment_followup",
        title: `متابعة علاج السن ${toothNumber}`,
        description: `متابعة ${this.getTreatmentLabel(treatment.type)} - التقدم: ${treatment.progress}%`,
        dueDate: this.calculateDueDate(treatment),
        priority: this.calculatePriority(treatment),
        completed: false,
      };
      tasks.push(task);
      this.saveTasks(tasks);
    }

    // Create lab order task if needed
    if (treatment.needsLab && !treatment.labOrderId) {
      const labTask: DentalHubTask = {
        id: `task_${Date.now()}_lab`,
        patientId,
        patientName,
        toothNumber,
        treatmentId: treatment.id,
        taskType: "lab_order",
        title: `إرسال طلب للمختبر - السن ${toothNumber}`,
        description: `إرسال طلب ${this.getTreatmentLabel(treatment.type)} للمختبر`,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        priority: "high",
        completed: false,
      };
      tasks.push(labTask);
      this.saveTasks(tasks);
    }

    // Create payment reminder if there's outstanding balance
    if (treatment.cost > treatment.paid) {
      const paymentTask: DentalHubTask = {
        id: `task_${Date.now()}_payment`,
        patientId,
        patientName,
        toothNumber,
        treatmentId: treatment.id,
        taskType: "payment_reminder",
        title: `تذكير بالدفع - ${patientName}`,
        description: `المبلغ المتبقي: ${(treatment.cost - treatment.paid).toLocaleString()} د.ع`,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        priority: "medium",
        completed: false,
      };
      tasks.push(paymentTask);
      this.saveTasks(tasks);
    }

    // Create notification/reminder
    notificationsService.addReminder({
      title: `علاج جديد - ${patientName}`,
      description: `${this.getTreatmentLabel(treatment.type)} للسن ${toothNumber}`,
      assigneeId: "current_user",
      assigneeName: "أنت",
      priority: this.calculatePriority(treatment),
      dueAt: treatment.startDate,
      sourceSection: "patient_treatment",
    });
  }

  // Create task from prognosis update
  syncPrognosisToTasks(patientId: string, patientName: string, prognosis: TreatmentPrognosis): void {
    const tasks = this.getTasks();
    const existingTaskIndex = tasks.findIndex(
      (t) => t.patientId === patientId && t.treatmentId === prognosis.treatmentId
    );

    if (existingTaskIndex >= 0) {
      // Update existing task
      tasks[existingTaskIndex].description = `${tasks[existingTaskIndex].description.split('-')[0]} - التقدم: ${prognosis.progressPercentage}%`;
      tasks[existingTaskIndex].completed = prognosis.progressPercentage === 100;

      if (prognosis.nextAppointment) {
        tasks[existingTaskIndex].dueDate = prognosis.nextAppointment;
      }
    }

    this.saveTasks(tasks);

    // Create notification for progress update
    if (prognosis.stepsCompleted > 0 && prognosis.progressPercentage < 100) {
      notificationsService.addNotification({
        title: `تحديث تقدم العلاج - ${patientName}`,
        message: `تم إكمال ${prognosis.stepsCompleted} من ${prognosis.totalSteps} خطوات للسن ${prognosis.toothNumber}`,
        type: "info",
        category: "patient",
        priority: "medium",
        actionUrl: `/clinic_old/patients/${patientId}`,
      });

      // Create reminder for next appointment
      if (prognosis.nextAppointment) {
        notificationsService.addReminder({
          title: `موعد علاج قادم - ${patientName}`,
          description: `الزيارة القادمة للسن ${prognosis.toothNumber} - الخطوة ${prognosis.stepsCompleted + 1} من ${prognosis.totalSteps}`,
          assigneeId: "current_user",
          assigneeName: "أنت",
          priority: "medium",
          dueAt: prognosis.nextAppointment,
          sourceSection: "patient_treatment",
        });
      }
    }

    // Create completion notification when treatment is done
    if (prognosis.progressPercentage === 100) {
      notificationsService.addNotification({
        title: `✅ اكتمل العلاج - ${patientName}`,
        message: `تم إكمال علاج السن ${prognosis.toothNumber} بنجاح`,
        type: "success",
        category: "patient",
        priority: "low",
        actionUrl: `/clinic_old/patients/${patientId}`,
      });
    }
  }

  // Sync treatment suggestions to dental hub
  syncSuggestionsToHub(patientId: string, patientName: string, suggestion: TreatmentSuggestion): void {
    notificationsService.addNotification({
      title: `توصية علاج جديدة - ${patientName}`,
      message: `${suggestion.reason} - السن ${suggestion.toothNumber}`,
      type: suggestion.priority === "urgent" ? "urgent" : "info",
      category: "patient",
      priority: suggestion.priority,
      actionUrl: `/clinic_old/patients/${patientId}`,
    });
  }

  // Get all tasks
  getTasks(): DentalHubTask[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(this.TASKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // Get tasks for specific patient
  getPatientTasks(patientId: string): DentalHubTask[] {
    return this.getTasks().filter((t) => t.patientId === patientId);
  }

  // Get tasks by type
  getTasksByType(taskType: DentalHubTask["taskType"]): DentalHubTask[] {
    return this.getTasks().filter((t) => t.taskType === taskType);
  }

  // Complete task
  completeTask(taskId: string): void {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex >= 0) {
      tasks[taskIndex].completed = true;
      this.saveTasks(tasks);
    }
  }

  // Delete task
  deleteTask(taskId: string): void {
    const tasks = this.getTasks().filter((t) => t.id !== taskId);
    this.saveTasks(tasks);
  }

  // Get summary statistics for dental hub
  getSummary(): {
    totalTasks: number;
    pendingTasks: number;
    urgentTasks: number;
    todayTasks: number;
    labOrders: number;
    paymentReminders: number;
  } {
    const tasks = this.getTasks();
    const today = new Date().toISOString().split("T")[0];

    return {
      totalTasks: tasks.length,
      pendingTasks: tasks.filter((t) => !t.completed).length,
      urgentTasks: tasks.filter((t) => t.priority === "urgent" && !t.completed).length,
      todayTasks: tasks.filter((t) => t.dueDate.startsWith(today) && !t.completed).length,
      labOrders: tasks.filter((t) => t.taskType === "lab_order" && !t.completed).length,
      paymentReminders: tasks.filter((t) => t.taskType === "payment_reminder" && !t.completed).length,
    };
  }

  // Save summary to localStorage for dental hub dashboard
  saveSummary(): void {
    if (typeof window === "undefined") return;
    try {
      const summary = this.getSummary();
      localStorage.setItem(this.SUMMARY_KEY, JSON.stringify(summary));
    } catch (error) {
      console.error("Failed to save summary:", error);
    }
  }

  private saveTasks(tasks: DentalHubTask[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
      this.saveSummary();
    } catch (error) {
      console.error("Failed to save tasks:", error);
    }
  }

  private getTreatmentLabel(type: string): string {
    const labels: Record<string, string> = {
      scaling: "تنظيف الجير",
      polishing: "تلميع",
      simple_restoration: "حشوة بسيطة",
      complex_restoration: "حشوة معقدة",
      inlay: "إنلاي",
      onlay: "أونلاي",
      crown: "تاج",
      extraction: "خلع",
      orthodontic: "تقويم",
      implant: "زراعة",
      endodontic: "علاج عصب",
    };
    return labels[type] || type;
  }

  private calculateDueDate(treatment: ToothTreatment): string {
    // Calculate based on treatment type and progress
    if (treatment.endodonticDetails && treatment.endodonticDetails.visits.length > 0) {
      const lastVisit = treatment.endodonticDetails.visits[treatment.endodonticDetails.visits.length - 1];
      return new Date(new Date(lastVisit.date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    }

    if (treatment.orthodonticDetails) {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    }

    // Default: 3 days from now
    return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
  }

  private calculatePriority(treatment: ToothTreatment): "low" | "medium" | "high" | "urgent" {
    if (treatment.type === "extraction" || treatment.type === "endodontic") {
      return "high";
    }
    if (treatment.needsLab) {
      return "medium";
    }
    if (treatment.cost > treatment.paid && treatment.cost - treatment.paid > 500000) {
      return "urgent";
    }
    return "low";
  }
}

export const dentalHubSync = new DentalHubSync();
