import type {
  ToothData,
  ToothTreatment,
  TreatmentSuggestion,
  PaymentInvoice,
  TreatmentPrognosis,
  ToothCondition,
  TreatmentType,
  TreatmentStatus,
} from "@/types/dental";

interface PatientDentalRecord {
  patientId: string;
  teeth: ToothData[];
  treatmentSuggestions: TreatmentSuggestion[];
  invoices: PaymentInvoice[];
  prognosis: TreatmentPrognosis[];
  lastUpdated: string;
}

class PatientDentalService {
  private storageKey = "patient_dental_records";
  private listeners: Map<string, Set<() => void>> = new Map();

  private getRecords(): Map<string, PatientDentalRecord> {
    if (typeof window === "undefined") return new Map();
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return new Map();
      const obj = JSON.parse(data);
      return new Map(Object.entries(obj));
    } catch {
      return new Map();
    }
  }

  private saveRecords(records: Map<string, PatientDentalRecord>): void {
    if (typeof window === "undefined") return;
    try {
      const obj = Object.fromEntries(records);
      localStorage.setItem(this.storageKey, JSON.stringify(obj));
    } catch (error) {
      console.error("Failed to save dental records:", error);
    }
  }

  private notifyListeners(patientId: string): void {
    const listeners = this.listeners.get(patientId);
    if (listeners) {
      listeners.forEach((callback) => callback());
    }
  }

  subscribe(patientId: string, callback: () => void): () => void {
    if (!this.listeners.has(patientId)) {
      this.listeners.set(patientId, new Set());
    }
    this.listeners.get(patientId)!.add(callback);

    return () => {
      const listeners = this.listeners.get(patientId);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(patientId);
        }
      }
    };
  }

  getPatientDentalRecord(patientId: string): PatientDentalRecord | null {
    const records = this.getRecords();
    return records.get(patientId) || null;
  }

  getPatientTeeth(patientId: string): ToothData[] {
    const record = this.getPatientDentalRecord(patientId);
    return record?.teeth || [];
  }

  updateToothData(
    patientId: string,
    toothNumber: number,
    updates: Partial<ToothData>
  ): void {
    const records = this.getRecords();
    let record = records.get(patientId);

    if (!record) {
      record = {
        patientId,
        teeth: [],
        treatmentSuggestions: [],
        invoices: [],
        prognosis: [],
        lastUpdated: new Date().toISOString(),
      };
    }

    const toothIndex = record.teeth.findIndex((t) => t.number === toothNumber);
    const updatedTooth: ToothData = {
      number: toothNumber,
      condition: updates.condition || "present",
      treatments: updates.treatments || [],
      notes: updates.notes || "",
      lastUpdated: new Date().toISOString(),
      ...(toothIndex >= 0 ? record.teeth[toothIndex] : {}),
      ...updates,
    };

    if (toothIndex >= 0) {
      record.teeth[toothIndex] = updatedTooth;
    } else {
      record.teeth.push(updatedTooth);
    }

    record.lastUpdated = new Date().toISOString();
    records.set(patientId, record);
    this.saveRecords(records);
    this.notifyListeners(patientId);
  }

  addTreatment(
    patientId: string,
    toothNumber: number,
    treatment: ToothTreatment,
    patientName?: string
  ): void {
    const records = this.getRecords();
    let record = records.get(patientId);

    if (!record) {
      record = {
        patientId,
        teeth: [],
        treatmentSuggestions: [],
        invoices: [],
        prognosis: [],
        lastUpdated: new Date().toISOString(),
      };
    }

    const toothIndex = record.teeth.findIndex((t) => t.number === toothNumber);
    if (toothIndex >= 0) {
      record.teeth[toothIndex].treatments.push(treatment);
    } else {
      record.teeth.push({
        number: toothNumber,
        condition: "present",
        treatments: [treatment],
        notes: "",
        lastUpdated: new Date().toISOString(),
      });
    }

    record.lastUpdated = new Date().toISOString();
    records.set(patientId, record);
    this.saveRecords(records);
    this.notifyListeners(patientId);

    // Sync to dental hub - create tasks and reminders
    if (typeof window !== "undefined" && patientName) {
      import("./dentalHubSync").then(({ dentalHubSync }) => {
        dentalHubSync.createTaskFromTreatment(patientId, patientName, toothNumber, treatment);
      });
    }
  }

  updateTreatmentProgress(
    patientId: string,
    toothNumber: number,
    treatmentId: string,
    progress: number,
    status?: TreatmentStatus
  ): void {
    const records = this.getRecords();
    const record = records.get(patientId);
    if (!record) return;

    const tooth = record.teeth.find((t) => t.number === toothNumber);
    if (!tooth) return;

    const treatment = tooth.treatments.find((t) => t.id === treatmentId);
    if (treatment) {
      treatment.progress = progress;
      if (status) {
        treatment.status = status;
      }
      if (progress === 100) {
        treatment.completionDate = new Date().toISOString();
        treatment.status = "completed";
      }
    }

    record.lastUpdated = new Date().toISOString();
    records.set(patientId, record);
    this.saveRecords(records);
    this.notifyListeners(patientId);
  }

  addTreatmentSuggestion(
    patientId: string,
    suggestion: TreatmentSuggestion,
    patientName?: string
  ): void {
    const records = this.getRecords();
    let record = records.get(patientId);

    if (!record) {
      record = {
        patientId,
        teeth: [],
        treatmentSuggestions: [],
        invoices: [],
        prognosis: [],
        lastUpdated: new Date().toISOString(),
      };
    }

    record.treatmentSuggestions.push(suggestion);
    record.lastUpdated = new Date().toISOString();
    records.set(patientId, record);
    this.saveRecords(records);
    this.notifyListeners(patientId);

    // Sync to dental hub - create notification
    if (typeof window !== "undefined" && patientName) {
      import("./dentalHubSync").then(({ dentalHubSync }) => {
        dentalHubSync.syncSuggestionsToHub(patientId, patientName, suggestion);
      });
    }
  }

  getTreatmentSuggestions(patientId: string): TreatmentSuggestion[] {
    const record = this.getPatientDentalRecord(patientId);
    return record?.treatmentSuggestions || [];
  }

  addInvoice(patientId: string, invoice: PaymentInvoice): void {
    const records = this.getRecords();
    let record = records.get(patientId);

    if (!record) {
      record = {
        patientId,
        teeth: [],
        treatmentSuggestions: [],
        invoices: [],
        prognosis: [],
        lastUpdated: new Date().toISOString(),
      };
    }

    record.invoices.push(invoice);
    record.lastUpdated = new Date().toISOString();
    records.set(patientId, record);
    this.saveRecords(records);
    this.notifyListeners(patientId);
  }

  getInvoices(patientId: string): PaymentInvoice[] {
    const record = this.getPatientDentalRecord(patientId);
    return record?.invoices || [];
  }

  updatePrognosis(patientId: string, prognosis: TreatmentPrognosis, patientName?: string): void {
    const records = this.getRecords();
    let record = records.get(patientId);

    if (!record) {
      record = {
        patientId,
        teeth: [],
        treatmentSuggestions: [],
        invoices: [],
        prognosis: [],
        lastUpdated: new Date().toISOString(),
      };
    }

    const existingIndex = record.prognosis.findIndex(
      (p) => p.toothNumber === prognosis.toothNumber && p.treatmentId === prognosis.treatmentId
    );

    if (existingIndex >= 0) {
      record.prognosis[existingIndex] = prognosis;
    } else {
      record.prognosis.push(prognosis);
    }

    record.lastUpdated = new Date().toISOString();
    records.set(patientId, record);
    this.saveRecords(records);
    this.notifyListeners(patientId);

    // Sync to dental hub - update tasks
    if (typeof window !== "undefined" && patientName) {
      import("./dentalHubSync").then(({ dentalHubSync }) => {
        dentalHubSync.syncPrognosisToTasks(patientId, patientName, prognosis);
      });
    }
  }

  getPrognosis(patientId: string): TreatmentPrognosis[] {
    const record = this.getPatientDentalRecord(patientId);
    return record?.prognosis || [];
  }

  completeStep(
    patientId: string,
    toothNumber: number,
    treatmentId: string,
    patientName?: string
  ): void {
    const records = this.getRecords();
    const record = records.get(patientId);

    if (!record) return;

    const prognosisIndex = record.prognosis.findIndex(
      (p) => p.toothNumber === toothNumber && p.treatmentId === treatmentId
    );

    if (prognosisIndex >= 0) {
      const prognosis = record.prognosis[prognosisIndex];
      
      // Increment completed steps
      prognosis.stepsCompleted = Math.min(
        prognosis.stepsCompleted + 1,
        prognosis.totalSteps
      );
      
      // Update progress percentage
      prognosis.progressPercentage = Math.round(
        (prognosis.stepsCompleted / prognosis.totalSteps) * 100
      );
      
      // Update current step based on progress
      if (prognosis.progressPercentage === 100) {
        prognosis.currentStep = "completed";
      } else if (prognosis.progressPercentage >= 75) {
        prognosis.currentStep = "follow_up";
      } else if (prognosis.progressPercentage >= 50) {
        prognosis.currentStep = "in_progress";
      } else if (prognosis.progressPercentage >= 25) {
        prognosis.currentStep = "planning";
      } else {
        prognosis.currentStep = "consultation";
      }
      
      // Update next appointment (7 days from now)
      if (prognosis.stepsCompleted < prognosis.totalSteps) {
        prognosis.nextAppointment = new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString();
      }

      record.prognosis[prognosisIndex] = prognosis;
      record.lastUpdated = new Date().toISOString();
      records.set(patientId, record);
      this.saveRecords(records);
      this.notifyListeners(patientId);

      // Sync to dental hub and notifications
      if (typeof window !== "undefined" && patientName) {
        import("./dentalHubSync").then(({ dentalHubSync }) => {
          dentalHubSync.syncPrognosisToTasks(patientId, patientName, prognosis);
        });
      }
    }
  }

  getPaymentSummary(patientId: string): {
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
  } {
    const invoices = this.getInvoices(patientId);
    const summary = {
      totalPaid: 0,
      totalPending: 0,
      totalOverdue: 0,
    };

    invoices.forEach((invoice) => {
      if (invoice.status === "paid") {
        summary.totalPaid += invoice.totalAmount;
      } else if (invoice.status === "overdue") {
        summary.totalOverdue += invoice.totalAmount - invoice.paidAmount;
      } else {
        summary.totalPending += invoice.totalAmount - invoice.paidAmount;
      }
    });

    return summary;
  }
}

export const patientDentalService = new PatientDentalService();
