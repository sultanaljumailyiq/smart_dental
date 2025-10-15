import { useState, useEffect } from 'react';
import { ChevronDown, User, Users, Shield, LogOut } from 'lucide-react';
import { useStaffAuth } from '../contexts/StaffAuthContext';
import { cn } from '@/lib/utils';

interface StaffMember {
  id: number;
  name: string;
  arabicName: string;
  role: string;
  arabicRole: string;
  username: string;
  clinicId: number;
  isOwner: boolean;
}

export default function StaffRoleSwitcher() {
  const { staff, isOwner, logout } = useStaffAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [availableStaff, setAvailableStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);

  // Only show if user is owner or admin
  if (!staff || !isOwner) {
    return null;
  }

  useEffect(() => {
    loadStaffMembers();
  }, [staff]);

  const loadStaffMembers = async () => {
    if (!staff?.clinicId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/clinics/${staff.clinicId}/staff`);
      if (response.ok) {
        const data = await response.json();
        setAvailableStaff(data);
      }
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchToStaff = async (targetStaff: StaffMember) => {
    try {
      // Simulate login as this staff member
      const response = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: targetStaff.username, 
          // In real implementation, this would use a special admin override token
          adminOverride: true,
          adminId: staff.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('staff_auth', JSON.stringify(data.staff));
        window.location.reload();
      }
    } catch (error) {
      console.error('Error switching staff:', error);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" dir="rtl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isOwner() ? (
            <Shield className="w-5 h-5 text-blue-600" />
          ) : (
            <User className="w-5 h-5 text-gray-600" />
          )}
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {staff.arabicName || staff.name}
            </div>
            <div className="text-xs text-gray-500">
              {isOwner() ? 'مالك العيادة' : staff.arabicRole || staff.role}
            </div>
          </div>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-gray-400 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
            {/* Current User Header */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">
                    {staff.arabicName || staff.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isOwner() ? 'مالك العيادة - صلاحيات كاملة' : 'مدير النظام'}
                  </div>
                </div>
              </div>
            </div>

            {/* Staff List */}
            <div className="max-h-80 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-500 px-3 py-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  التبديل بين أدوار الطاقم
                </div>
                
                {loading ? (
                  <div className="py-8 text-center text-gray-500">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    جاري التحميل...
                  </div>
                ) : availableStaff.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    لا يوجد طاقم آخر
                  </div>
                ) : (
                  availableStaff
                    .filter(s => s.id !== staff.id) // Exclude current user
                    .map((staffMember) => (
                      <button
                        key={staffMember.id}
                        onClick={() => switchToStaff(staffMember)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-right"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {staffMember.arabicName || staffMember.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {staffMember.arabicRole || staffMember.role}
                            {staffMember.isOwner && ' • مالك'}
                          </div>
                        </div>
                      </button>
                    ))
                )}
              </div>
            </div>

            {/* Logout Button */}
            <div className="border-t border-gray-200 p-2">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
