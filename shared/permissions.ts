// نظام صلاحيات المستخدمين المحدث

export type UserRole =
  | "app_owner" // مالك التطبيق
  | "clinic_owner" // مالك العيادة (طبيب أسنان)
  | "clinic_staff" // طاقم العيادة
  | "clinic_employee" // موظف العيادة
  | "supplier" // مورد
  | "patient"; // مريض (وصول محدود)

export interface UserPermissions {
  // إدارة النظام
  canManageSystem: boolean;
  canManageUsers: boolean;
  canManageArticles: boolean;
  canViewSystemAnalytics: boolean;

  // إدارة العيادة
  canManageClinic: boolean;
  canManageStaff: boolean;
  canManageAppointments: boolean;
  canViewClinicReports: boolean;

  // الوصول للأقسام
  canAccessHome: boolean;
  canAccessMedicalServices: boolean;
  canAccessCommunity: boolean;
  canAccessJobs: boolean;
  canAccessDentistHub: boolean;
  canAccessMarketplace: boolean;

  // الميزات الخاصة
  canBookAppointments: boolean;
  canReceiveNotifications: boolean;
  canViewArticles: boolean;
  canCreateContent: boolean;
  canManageSuppliers: boolean;
}

// قائمة الصلاحيات لكل دور
export const rolePermissions: Record<UserRole, UserPermissions> = {
  // مالك التطبيق - صلاحيات كاملة
  app_owner: {
    canManageSystem: true,
    canManageUsers: true,
    canManageArticles: true,
    canViewSystemAnalytics: true,
    canManageClinic: true,
    canManageStaff: true,
    canManageAppointments: true,
    canViewClinicReports: true,
    canAccessHome: true,
    canAccessMedicalServices: true,
    canAccessCommunity: true,
    canAccessJobs: true,
    canAccessDentistHub: true,
    canAccessMarketplace: true,
    canBookAppointments: true,
    canReceiveNotifications: true,
    canViewArticles: true,
    canCreateContent: true,
    canManageSuppliers: true,
  },

  // مالك العيادة (طبيب أسنان) - إدارة العيادة والطاقم
  clinic_owner: {
    canManageSystem: false,
    canManageUsers: false,
    canManageArticles: false,
    canViewSystemAnalytics: false,
    canManageClinic: true,
    canManageStaff: true,
    canManageAppointments: true,
    canViewClinicReports: true,
    canAccessHome: true,
    canAccessMedicalServices: true,
    canAccessCommunity: true,
    canAccessJobs: true,
    canAccessDentistHub: true,
    canAccessMarketplace: true,
    canBookAppointments: false,
    canReceiveNotifications: true,
    canViewArticles: true,
    canCreateContent: true,
    canManageSuppliers: false,
  },

  // طاقم العيادة - إدارة محدودة
  clinic_staff: {
    canManageSystem: false,
    canManageUsers: false,
    canManageArticles: false,
    canViewSystemAnalytics: false,
    canManageClinic: false,
    canManageStaff: false,
    canManageAppointments: true,
    canViewClinicReports: false,
    canAccessHome: true,
    canAccessMedicalServices: true,
    canAccessCommunity: true,
    canAccessJobs: false,
    canAccessDentistHub: true,
    canAccessMarketplace: false,
    canBookAppointments: false,
    canReceiveNotifications: true,
    canViewArticles: true,
    canCreateContent: false,
    canManageSuppliers: false,
  },

  // موظف العيادة - صلاحيات أساسية
  clinic_employee: {
    canManageSystem: false,
    canManageUsers: false,
    canManageArticles: false,
    canViewSystemAnalytics: false,
    canManageClinic: false,
    canManageStaff: false,
    canManageAppointments: false,
    canViewClinicReports: false,
    canAccessHome: true,
    canAccessMedicalServices: true,
    canAccessCommunity: false,
    canAccessJobs: false,
    canAccessDentistHub: false,
    canAccessMarketplace: false,
    canBookAppointments: false,
    canReceiveNotifications: true,
    canViewArticles: true,
    canCreateContent: false,
    canManageSuppliers: false,
  },

  // مورد - وصول للمتجر فقط
  supplier: {
    canManageSystem: false,
    canManageUsers: false,
    canManageArticles: false,
    canViewSystemAnalytics: false,
    canManageClinic: false,
    canManageStaff: false,
    canManageAppointments: false,
    canViewClinicReports: false,
    canAccessHome: true,
    canAccessMedicalServices: false,
    canAccessCommunity: false,
    canAccessJobs: false,
    canAccessDentistHub: false,
    canAccessMarketplace: true,
    canBookAppointments: false,
    canReceiveNotifications: true,
    canViewArticles: false,
    canCreateContent: false,
    canManageSuppliers: false,
  },

  // مريض - وصول محدود جداً
  patient: {
    canManageSystem: false,
    canManageUsers: false,
    canManageArticles: false,
    canViewSystemAnalytics: false,
    canManageClinic: false,
    canManageStaff: false,
    canManageAppointments: false,
    canViewClinicReports: false,
    canAccessHome: true, // الصفحة الرئيسية
    canAccessMedicalServices: true, // الخدمات الطبية فقط
    canAccessCommunity: false,
    canAccessJobs: false,
    canAccessDentistHub: false,
    canAccessMarketplace: false,
    canBookAppointments: true, // حجز المواعيد
    canReceiveNotifications: true, // الإشعارات
    canViewArticles: true, // المقالات (بدون معلومات الناشر)
    canCreateContent: false,
    canManageSuppliers: false,
  },
};

// دالة للحصول على صلاحيات المستخدم
export function getUserPermissions(role: UserRole): UserPermissions {
  return rolePermissions[role];
}

// دالة للتحقق من صلاحية معينة
export function hasPermission(
  role: UserRole,
  permission: keyof UserPermissions,
): boolean {
  return rolePermissions[role][permission];
}

// دالة للحصول على الأقسام المسموحة للمستخدم
export function getAllowedSections(role: UserRole): string[] {
  const permissions = getUserPermissions(role);
  const sections: string[] = [];

  if (permissions.canAccessHome) sections.push("home");
  if (permissions.canAccessMedicalServices) sections.push("medical-services");
  if (permissions.canAccessCommunity) sections.push("community");
  if (permissions.canAccessJobs) sections.push("jobs");
  if (permissions.canAccessDentistHub) sections.push("dentist-hub");
  if (permissions.canAccessMarketplace) sections.push("marketplace");

  return sections;
}

// دالة لتحديد إذا كان المستخدم مريض
export function isPatient(role: UserRole): boolean {
  return role === "patient";
}

// دالة لتحديد إذا كان المستخدم مدير أو مالك عيادة
export function isManager(role: UserRole): boolean {
  return role === "app_owner" || role === "clinic_owner";
}

// دالة للحصول على اسم الدور بالعربية
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    app_owner: "مالك التطبيق",
    clinic_owner: "مالك العيادة",
    clinic_staff: "طاقم العيادة",
    clinic_employee: "موظف العيادة",
    supplier: "مورد",
    patient: "مريض",
  };

  return roleNames[role];
}
