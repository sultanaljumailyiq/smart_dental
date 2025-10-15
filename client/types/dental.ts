export type ToothCondition =
  | "present"
  | "absent"
  | "calculus"
  | "decayed"
  | "colored"
  | "abnormal_shape"
  | "abnormal_position"
  | "healthy"
  | "cavity"
  | "fractured"
  | "mobile"
  | "missing";

export type ToothTreatmentState =
  | "filling"
  | "crown"
  | "root_canal"
  | "extraction"
  | "implant"
  | "bridge";

export type TreatmentType =
  | "scaling"
  | "polishing"
  | "simple_restoration"
  | "complex_restoration"
  | "inlay"
  | "onlay"
  | "crown"
  | "extraction"
  | "orthodontic"
  | "implant"
  | "endodontic";

export type TreatmentStatus =
  | "consultation"
  | "planning"
  | "in_progress"
  | "follow_up"
  | "completed"
  | "cancelled";

export type CrownMaterial = "porcelain" | "zirconia" | "metal" | "pfm";

export interface CanalDetails {
  canalNumber: number;
  workingLength: string;
  filesUsed: string[];
}

export interface EndodonticDetails {
  numberOfRoots: number;
  numberOfCanals: number;
  canals: CanalDetails[];
  estimatedVisits: number;
  visits: {
    visitNumber: number;
    date: string;
    notes: string;
    completed: boolean;
  }[];
}

export interface CrownDetails {
  material: CrownMaterial;
  requiresPostAndCore: boolean;
  postType?: string;
  coreType?: string;
  shade?: string;
}

export interface OrthodonticDetails {
  durationMonths: number;
  problemDescription: string;
  startDate: string;
  estimatedEndDate: string;
  progress: number;
}

export interface RestorationDetails {
  surface: string[];
  material: string;
  shade?: string;
}

export interface ToothTreatment {
  id: string;
  type: TreatmentType;
  status: TreatmentStatus;
  progress: number;
  startDate: string;
  completionDate?: string;
  cost: number;
  paid: number;
  notes: string;
  endodonticDetails?: EndodonticDetails;
  crownDetails?: CrownDetails;
  orthodonticDetails?: OrthodonticDetails;
  restorationDetails?: RestorationDetails;
  needsLab: boolean;
  labOrderId?: string;
  catalogTreatmentId?: string;
  estimatedVisits: number;
  pricePerVisit?: number;
}

export interface ToothData {
  number: number;
  condition: ToothCondition;
  treatmentState?: ToothTreatmentState;
  treatments: ToothTreatment[];
  notes: string;
  lastUpdated: string;
}

export interface TreatmentSuggestion {
  id: string;
  toothNumber: number;
  suggestedTreatment: TreatmentType;
  reason: string;
  priority: "low" | "medium" | "high" | "urgent";
  estimatedCost: number;
  aiGenerated: boolean;
}

export interface PaymentInvoice {
  id: string;
  patientId: string;
  date: string;
  items: {
    description: string;
    toothNumber?: number;
    amount: number;
  }[];
  totalAmount: number;
  paidAmount: number;
  status: "pending" | "partial" | "paid" | "overdue";
  dueDate: string;
}

export interface TreatmentPrognosis {
  toothNumber: number;
  treatmentId: string;
  currentStep: TreatmentStatus;
  stepsCompleted: number;
  totalSteps: number;
  progressPercentage: number;
  nextAppointment?: string;
  estimatedCompletion?: string;
}
