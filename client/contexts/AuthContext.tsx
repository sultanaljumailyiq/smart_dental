import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, UserRole, Permission, UserStatus } from "@/types/system";
import { supabase, supabaseEnabled } from "@/config/supabase";

// ============= Authentication Context =============

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Permission[];
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  canAccess: (requiredRole: UserRole) => boolean;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  arabicName: string;
  phone: string;
  province?: string; // Iraqi province (required for dentists and suppliers)
  role: UserRole;
  companyName?: string; // For suppliers
  businessLicense?: string; // For suppliers
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============= Permission System =============

// Default permissions for each role
const DEFAULT_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.PLATFORM_ADMIN]: [{ resource: "*", actions: ["*"] }],

  [UserRole.DENTIST]: [
    { resource: "clinic", actions: ["create", "read", "update", "delete"] },
    { resource: "patients", actions: ["create", "read", "update", "delete"] },
    { resource: "appointments", actions: ["create", "read", "update", "delete"] },
    { resource: "treatments", actions: ["create", "read", "update", "delete"] },
    { resource: "products", actions: ["read"] },
    { resource: "orders", actions: ["create", "read"] },
    { resource: "ai_assistant", actions: ["read", "create"] },
    { resource: "community", actions: ["read", "create", "update"] },
    { resource: "jobs", actions: ["read", "create"] },
    { resource: "education", actions: ["read"] },
    { resource: "profile", actions: ["read", "update"] },
  ],

  [UserRole.SUPPLIER]: [
    { resource: "products", actions: ["create", "read", "update", "delete"] },
    {
      resource: "own_products",
      actions: ["create", "read", "update", "delete"],
    },
    { resource: "orders", actions: ["read", "update"] },
    { resource: "own_orders", actions: ["read", "update"] },
    { resource: "analytics", actions: ["read"] },
    { resource: "own_analytics", actions: ["read"] },
    { resource: "profile", actions: ["read", "update"] },
    { resource: "offers", actions: ["create", "read", "update", "delete"] },
    { resource: "own_offers", actions: ["create", "read", "update", "delete"] },
    { resource: "inventory", actions: ["read", "update"] },
    { resource: "own_inventory", actions: ["read", "update"] },
  ],

  [UserRole.CUSTOMER]: [
    { resource: "products", actions: ["read"] },
    { resource: "categories", actions: ["read"] },
    { resource: "brands", actions: ["read"] },
    { resource: "suppliers", actions: ["read"] },
    { resource: "orders", actions: ["create", "read"] },
    { resource: "own_orders", actions: ["create", "read"] },
    { resource: "cart", actions: ["create", "read", "update", "delete"] },
    { resource: "wishlist", actions: ["create", "read", "update", "delete"] },
    { resource: "profile", actions: ["read", "update"] },
    { resource: "reviews", actions: ["create", "read", "update", "delete"] },
    {
      resource: "own_reviews",
      actions: ["create", "read", "update", "delete"],
    },
  ],

  [UserRole.MODERATOR]: [
    { resource: "products", actions: ["read", "update"] },
    { resource: "reviews", actions: ["read", "update", "delete"] },
    { resource: "users", actions: ["read", "update"] },
    { resource: "orders", actions: ["read", "update"] },
    { resource: "analytics", actions: ["read"] },
    { resource: "profile", actions: ["read", "update"] },
  ],

  [UserRole.VISITOR]: [
    { resource: "products", actions: ["read"] },
    { resource: "categories", actions: ["read"] },
    { resource: "brands", actions: ["read"] },
    { resource: "medical_services", actions: ["read"] },
  ],
};

// ============= Role Hierarchy =============

const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.PLATFORM_ADMIN]: 5,
  [UserRole.DENTIST]: 4,
  [UserRole.MODERATOR]: 3,
  [UserRole.SUPPLIER]: 2,
  [UserRole.CUSTOMER]: 1,
  [UserRole.VISITOR]: 0,
};

function mapSupabaseUserToAppUser(
  sbUser: NonNullable<ReturnType<typeof Object> & any>,
): User {
  const metadata = sbUser.user_metadata || {};
  const role: UserRole =
    metadata.role && Object.values(UserRole).includes(metadata.role)
      ? metadata.role
      : UserRole.CUSTOMER;

  const nameFromMeta =
    metadata.name || metadata.full_name || metadata.username || "";
  const arabicName = metadata.arabicName || nameFromMeta || "";
  const phone = metadata.phone || "";
  const province = metadata.province || undefined;

  return {
    id: sbUser.id,
    email: sbUser.email || "",
    phone,
    name: nameFromMeta || sbUser.email || "",
    arabicName: arabicName || nameFromMeta || sbUser.email || "",
    province,
    role,
    status: UserStatus.ACTIVE,
    avatar: metadata.avatar_url || metadata.avatar || undefined,
    profile: {
      companyName: metadata.companyName,
      businessLicense: metadata.businessLicense,
    },
    permissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
  };
}

// ============= Auth Provider Component =============

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    permissions: [],
  });

  // Initialize auth state from Supabase or localStorage fallback
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (supabaseEnabled && supabase) {
          const { data: sessionData } = await supabase.auth.getSession();
          const session = sessionData?.session || null;
          if (session?.user) {
            const mapped = mapSupabaseUserToAppUser(session.user);
            const permissions = DEFAULT_PERMISSIONS[mapped.role] || [];
            setAuthState({
              user: mapped,
              isAuthenticated: true,
              isLoading: false,
              permissions,
            });
          } else {
            setAuthState((prev) => ({ ...prev, isLoading: false }));
          }

          supabase.auth.onAuthStateChange((_event, newSession) => {
            if (newSession?.user) {
              const mapped = mapSupabaseUserToAppUser(newSession.user);
              const permissions = DEFAULT_PERMISSIONS[mapped.role] || [];
              setAuthState({
                user: mapped,
                isAuthenticated: true,
                isLoading: false,
                permissions,
              });
              localStorage.setItem("user_data", JSON.stringify(mapped));
              localStorage.setItem("auth_token", newSession.access_token || "");
            } else {
              localStorage.removeItem("auth_token");
              localStorage.removeItem("user_data");
              setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                permissions: [],
              });
            }
          });
          return;
        }

        const token = localStorage.getItem("auth_token");
        const userData = localStorage.getItem("user_data");

        if (token && userData) {
          const user = JSON.parse(userData) as User;
          const permissions = DEFAULT_PERMISSIONS[user.role] || [];

          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            permissions,
          });
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      if (supabaseEnabled && supabase) {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        const sbUser = data.user;
        if (!sbUser) throw new Error("Unable to retrieve user after login");
        const mapped = mapSupabaseUserToAppUser(sbUser);
        const permissions = DEFAULT_PERMISSIONS[mapped.role] || [];
        localStorage.setItem("auth_token", data.session?.access_token || "");
        localStorage.setItem("user_data", JSON.stringify(mapped));
        setAuthState({
          user: mapped,
          isAuthenticated: true,
          isLoading: false,
          permissions,
        });
        return;
      }

      const mockUser: User = {
        id: "user_1",
        email,
        phone: "+964750123456",
        name: "John Smith",
        arabicName: "جون سميث",
        role: email.includes("admin")
          ? UserRole.PLATFORM_ADMIN
          : email.includes("supplier")
            ? UserRole.SUPPLIER
            : UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        profile: {
          address: {
            governorate: "بغداد",
            city: "الكرخ",
            district: "الجادرية",
            street: "شارع الجامعة",
            buildingNumber: "123",
          },
        },
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      };

      const permissions = DEFAULT_PERMISSIONS[mockUser.role] || [];

      localStorage.setItem("auth_token", "mock_token_" + Date.now());
      localStorage.setItem("user_data", JSON.stringify(mockUser));

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        permissions,
      });
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    if (supabaseEnabled && supabase) {
      supabase.auth.signOut();
    }
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      permissions: [],
    });
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      if (supabaseEnabled && supabase) {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error, data } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              name: userData.name,
              arabicName: userData.arabicName,
              phone: userData.phone,
              province: userData.province,
              role: userData.role,
              companyName: userData.companyName,
              businessLicense: userData.businessLicense,
            },
          },
        });
        if (error) throw error;
        const sbUser = data.user;
        if (!sbUser) {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          return;
        }
        const mapped = mapSupabaseUserToAppUser(sbUser);
        const permissions = DEFAULT_PERMISSIONS[mapped.role] || [];
        localStorage.setItem("auth_token", data.session?.access_token || "");
        localStorage.setItem("user_data", JSON.stringify(mapped));
        setAuthState({
          user: mapped,
          isAuthenticated: true,
          isLoading: false,
          permissions,
        });
        return;
      }

      const newUser: User = {
        id: "user_" + Date.now(),
        email: userData.email,
        phone: userData.phone,
        name: userData.name,
        arabicName: userData.arabicName,
        province: userData.province,
        role: userData.role,
        status:
          userData.role === UserRole.SUPPLIER
            ? UserStatus.PENDING_VERIFICATION
            : UserStatus.ACTIVE,
        profile: {
          companyName: userData.companyName,
          businessLicense: userData.businessLicense,
        },
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const permissions = DEFAULT_PERMISSIONS[newUser.role] || [];

      localStorage.setItem("auth_token", "mock_token_" + Date.now());
      localStorage.setItem("user_data", JSON.stringify(newUser));

      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        permissions,
      });
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!authState.user) return;

    try {
      const updatedUser = {
        ...authState.user,
        ...updates,
        updatedAt: new Date(),
      };

      localStorage.setItem("user_data", JSON.stringify(updatedUser));

      setAuthState((prev) => ({
        ...prev,
        user: updatedUser,
      }));

      if (supabaseEnabled && supabase) {
        const user = (await supabase.auth.getUser()).data.user;
        if (user) {
          await supabase.auth.updateUser({
            data: {
              name: updatedUser.name,
              arabicName: updatedUser.arabicName,
              phone: updatedUser.phone,
              companyName: updatedUser.profile.companyName,
              businessLicense: updatedUser.profile.businessLicense,
            },
          });
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (!authState.user) return;

    try {
      if (supabaseEnabled && supabase) {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          const mapped = mapSupabaseUserToAppUser(data.user);
          const permissions = DEFAULT_PERMISSIONS[mapped.role] || [];
          setAuthState((prev) => ({ ...prev, user: mapped, permissions }));
          localStorage.setItem("user_data", JSON.stringify(mapped));
          return;
        }
      }

      const userData = localStorage.getItem("user_data");
      if (userData) {
        const user = JSON.parse(userData) as User;
        const permissions = DEFAULT_PERMISSIONS[user.role] || [];

        setAuthState((prev) => ({
          ...prev,
          user,
          permissions,
        }));
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!authState.isAuthenticated || !authState.user) return false;

    if (authState.user.role === UserRole.PLATFORM_ADMIN) return true;

    return authState.permissions.some((permission) => {
      const hasResource =
        permission.resource === "*" || permission.resource === resource;
      const hasAction =
        permission.actions.includes("*") || permission.actions.includes(action);
      return hasResource && hasAction;
    });
  };

  const hasRole = (role: UserRole): boolean => {
    return authState.user?.role === role;
  };

  const canAccess = (requiredRole: UserRole): boolean => {
    if (!authState.user) return false;

    const userRoleLevel = ROLE_HIERARCHY[authState.user.role] || 0;
    const requiredRoleLevel = ROLE_HIERARCHY[requiredRole] || 0;

    return userRoleLevel >= requiredRoleLevel;
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    register,
    updateProfile,
    hasPermission,
    hasRole,
    canAccess,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// ============= Custom Hook =============

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// ============= Higher-Order Component for Route Protection =============

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: {
    resource: string;
    action: string;
  };
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, canAccess, hasPermission, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              غير مصرح لك بالوصول
            </h2>
            <p className="text-gray-600 mb-6">يرجى تسجيل الدخول للمتابعة</p>
            <button
              onClick={() => (window.location.href = "/auth")}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      )
    );
  }

  if (requiredRole && !canAccess(requiredRole)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ليس لديك صلاحية للوصول
            </h2>
            <p className="text-gray-600">هذه الصفحة تتطلب صلاحيات أعلى</p>
          </div>
        </div>
      )
    );
  }

  if (
    requiredPermission &&
    !hasPermission(requiredPermission.resource, requiredPermission.action)
  ) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ليس لديك صلاحية للوصول
            </h2>
            <p className="text-gray-600">
              ليس لديك الصلاحية المطلوبة لهذا الإجراء
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

// ============= Permission Hook =============

export function usePermissions() {
  const { hasPermission, hasRole, canAccess, user } = useAuth();

  const checkProductAccess = (productSupplierId?: string) => {
    if (!user) return false;

    if (user.role === UserRole.PLATFORM_ADMIN) return true;

    if (user.role === UserRole.SUPPLIER) {
      return productSupplierId === user.id;
    }

    if (user.role === UserRole.CUSTOMER) {
      return hasPermission("products", "read");
    }

    return false;
  };

  const checkOrderAccess = (
    orderCustomerId?: string,
    orderSupplierId?: string,
  ) => {
    if (!user) return false;

    if (user.role === UserRole.PLATFORM_ADMIN) return true;

    if (user.role === UserRole.CUSTOMER) {
      return orderCustomerId === user.id;
    }

    if (user.role === UserRole.SUPPLIER) {
      return orderSupplierId === user.id;
    }

    return false;
  };

  return {
    hasPermission,
    hasRole,
    canAccess,
    checkProductAccess,
    checkOrderAccess,
  };
}
