import { useStaffAuth } from '../contexts/StaffAuthContext';

// Define available sections in the platform
export type PlatformSection = 
  | 'dentist-hub'           // مركز الأطباء
  | 'clinic_old'            // إدارة العيادة
  | 'marketplace'           // المتجر
  | 'community'             // المجتمع
  | 'jobs'                  // التوظيف
  | 'education'             // التعليم
  | 'ai-assistant'          // المساعد الذكي
  | 'patients'              // المرضى
  | 'appointments'          // المواعيد
  | 'lab'                   // المختبر
  | 'reports'               // التقارير
  | 'staff-management';     // إدارة الطاقم

export function useStaffPermissions() {
  const { staff, hasPermission: contextHasPermission, isOwner } = useStaffAuth();

  // Check if user can access a specific section
  const canAccessSection = (section: PlatformSection): boolean => {
    // If no staff logged in, assume full access (regular user mode)
    if (!staff) return true;
    
    // Owners have access to everything
    if (isOwner()) return true;
    
    // Check if section is in canAccessSections array
    return contextHasPermission(section);
  };

  // Get all accessible sections for current staff
  const getAccessibleSections = (): PlatformSection[] => {
    if (!staff) return [
      'dentist-hub',
      'clinic_old',
      'marketplace',
      'community',
      'jobs',
      'education',
      'ai-assistant',
      'patients',
      'appointments',
      'lab',
      'reports',
      'staff-management'
    ];
    
    if (isOwner()) return [
      'dentist-hub',
      'clinic_old',
      'marketplace',
      'community',
      'jobs',
      'education',
      'ai-assistant',
      'patients',
      'appointments',
      'lab',
      'reports',
      'staff-management'
    ];

    return (staff.canAccessSections || []) as PlatformSection[];
  };

  // Check if user should see main navigation items
  const shouldShowNavItem = (section: PlatformSection): boolean => {
    return canAccessSection(section);
  };

  return {
    staff,
    isOwner,
    canAccessSection,
    getAccessibleSections,
    shouldShowNavItem,
    isStaffMode: !!staff,
  };
}
