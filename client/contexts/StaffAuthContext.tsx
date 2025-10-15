import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface StaffMember {
  id: number;
  username: string;
  name: string;
  arabicName: string;
  clinicId: number;
  roleId: number | null;
  role: string;
  arabicRole: string | null;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  canAccessSections: string[];
  permissions: string[];
  isOwner: boolean;
}

interface StaffAuthContextType {
  staff: StaffMember | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (section: string) => boolean;
  isOwner: () => boolean;
  isLoading: boolean;
}

const StaffAuthContext = createContext<StaffAuthContextType | undefined>(undefined);

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedStaff = localStorage.getItem('staff_auth');
    if (storedStaff) {
      try {
        setStaff(JSON.parse(storedStaff));
      } catch (error) {
        console.error('Error parsing stored staff:', error);
        localStorage.removeItem('staff_auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setStaff(data.staff);
        localStorage.setItem('staff_auth', JSON.stringify(data.staff));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setStaff(null);
    localStorage.removeItem('staff_auth');
    window.location.href = '/staff/login';
  };

  const hasPermission = (section: string): boolean => {
    if (!staff) return false;
    if (staff.isOwner) return true;
    return staff.canAccessSections?.includes(section) || false;
  };

  const isOwner = (): boolean => {
    return staff?.isOwner || false;
  };

  return (
    <StaffAuthContext.Provider value={{ staff, login, logout, hasPermission, isOwner, isLoading }}>
      {children}
    </StaffAuthContext.Provider>
  );
}

export function useStaffAuth() {
  const context = useContext(StaffAuthContext);
  if (context === undefined) {
    throw new Error('useStaffAuth must be used within a StaffAuthProvider');
  }
  return context;
}
