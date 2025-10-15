import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Users, Stethoscope, UserCheck, CreditCard, TrendingUp, ShoppingCart, Package, BarChart3, HelpCircle, Search, Plus, User, ChevronDown, ChevronRight, Building, MapPin, Menu, X, Settings, Globe, Crown, Pill } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import UnifiedAIAssistant from "./UnifiedAIAssistant";
import NotificationSystem from "./NotificationSystem";
import "@/styles/legacy-compact.css";
interface NavItem {
  name: string;
  href: string;
  icon: any;
}
interface NavSection {
  name: string;
  items: NavItem[];
  isExpandable: boolean;
  defaultExpanded?: boolean;
}
interface LayoutProps {
  children: React.ReactNode;
}
export function Layout({
  children
}: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["العيادة", "أخرى"]);
  const {
    language,
    isRTL,
    t
  } = useI18n();
  const basePrefix = location.pathname.startsWith("/clinic_old") ? "/clinic_old" : "/admin";
  const hideSidebar = location.pathname === "/admin/dashboard";
  const isActive = (href: string) => {
    const root = basePrefix;
    if (href === root) {
      return location.pathname === root;
    }
    return location.pathname.startsWith(href);
  };
  const toggleSection = (sectionName: string) => {
    if (sectionName === "العيادة") return; // العيادة تبقى مفتوحة دائماً

    setExpandedSections(prev => prev.includes(sectionName) ? prev.filter(s => s !== sectionName) : [...prev, sectionName]);
  };

  // Navigation sections
  const navigationSections: NavSection[] = (() => {
    if (basePrefix === "/clinic_old") {
      return [{
        name: "الرئيسية",
        items: [{
          name: "لوحة التحكم",
          href: basePrefix,
          icon: Home
        }],
        isExpandable: false
      }, {
        name: "العيادة",
        items: [{
          name: "ال��جوزات",
          href: `${basePrefix}/reservations`,
          icon: Calendar
        }, {
          name: "المرضى",
          href: `${basePrefix}/patients`,
          icon: Users
        }, {
          name: "العلاجات",
          href: `${basePrefix}/treatments`,
          icon: Stethoscope
        }, {
          name: "المختبر",
          href: `${basePrefix}/lab`,
          icon: Pill
        }, {
          name: "الطاقم",
          href: `${basePrefix}/staff`,
          icon: UserCheck
        }],
        isExpandable: false,
        defaultExpanded: true
      }, {
        name: "المالية",
        items: [{
          name: "المالية",
          href: `${basePrefix}/finance`,
          icon: CreditCard
        }],
        isExpandable: true
      }, {
        name: "��لأصول المادية",
        items: [{
          name: "الأصول المادية",
          href: `${basePrefix}/assets`,
          icon: Package
        }],
        isExpandable: true
      }, {
        name: "أخرى",
        items: [{
          name: "التقارير",
          href: `${basePrefix}/reports`,
          icon: BarChart3
        }],
        isExpandable: true
      }];
    }
    return [{
      name: "الرئيسية",
      items: [{
        name: "لوحة التحكم",
        href: basePrefix,
        icon: Home
      }],
      isExpandable: false
    }, {
      name: "العيادة",
      items: [{
        name: "ال��جوزات",
        href: `${basePrefix}/reservations`,
        icon: Calendar
      }, {
        name: "المرضى",
        href: `${basePrefix}/patients`,
        icon: Users
      }, {
        name: "العلاجات",
        href: `${basePrefix}/treatments`,
        icon: Stethoscope
      }, {
        name: "الطاقم",
        href: `${basePrefix}/staff`,
        icon: UserCheck
      }],
      isExpandable: false,
      defaultExpanded: true
    }, {
      name: "ا��مالية",
      items: [{
        name: "الحسابات",
        href: `${basePrefix}/accounts`,
        icon: CreditCard
      }, {
        name: "المبيعات",
        href: `${basePrefix}/sales`,
        icon: TrendingUp
      }, {
        name: "المشتريات",
        href: `${basePrefix}/purchases`,
        icon: ShoppingCart
      }],
      isExpandable: true
    }, {
      name: "الأصول المادية",
      items: [{
        name: "المخزون",
        href: `${basePrefix}/stocks`,
        icon: Package
      }, {
        name: "الأجهزة",
        href: `${basePrefix}/peripherals`,
        icon: Package
      }],
      isExpandable: true
    }, {
      name: "أخرى",
      items: [{
        name: "التقارير",
        href: `${basePrefix}/reports`,
        icon: BarChart3
      }],
      isExpandable: true
    }];
  })();
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin") return "لوحة التحكم";
    if (path.includes("reservations")) return "الحجوزات";
    if (path.includes("patients")) return "المرضى";
    if (path.includes("treatments")) return "العلاجات";
    if (path.includes("lab")) return "المختبر";
    if (path.includes("staff")) return "الطاقم";
    if (path.includes("finance")) return "المالية";
    if (path.includes("accounts")) return "الحسابات";
    if (path.includes("sales")) return "المبيعات";
    if (path.includes("purchases")) return "مشتريات متجر الأسنان";
    if (path.includes("assets")) return "الأصول ا��مادية";
    if (path.includes("stocks")) return "المخزون";
    if (path.includes("peripherals")) return "الأجهزة";
    if (path.includes("reports")) return "التقارير";
    return "لوحة التحكم";
  };
  return <div className={cn("min-h-screen bg-gradient-to-br from-gray-50 to-gray-100", isRTL ? "font-arabic" : "", basePrefix === "/clinic_old" && "legacy-compact")}>
      {/* Mobile sidebar overlay */}
      {!hideSidebar && basePrefix !== "/clinic_old" && sidebarOpen && <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      {!hideSidebar && basePrefix !== "/clinic_old"}

      {/* Improved Top Nav for clinic_old */}
      {basePrefix === "/clinic_old" && <div className="bg-white border-b sticky top-16 left-0 right-0 z-40 shadow-sm">
          <div className="px-4 py-3 overflow-x-auto">
            <div className="flex items-center gap-3 min-w-max">
              {navigationSections.flatMap(s => s.items).map(item => <Link key={item.name} to={item.href} className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200", isActive(item.href) ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm" : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200")}>
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>)}
            </div>
          </div>
        </div>}

      {/* Main Content */}
      <div className={cn("transition-all duration-300", hideSidebar || basePrefix === "/clinic_old" ? "lg:pl-0 lg:pr-0" : sidebarCollapsed ? isRTL ? "lg:pr-16" : "lg:pl-16" : isRTL ? "lg:pr-64" : "lg:pl-64")}>
        {/* Page Content */}
        <main className={cn("p-4 lg:p-6", basePrefix === "/clinic_old" && "w-full pt-4")}>
          {children}
        </main>
      </div>

      {/* AI Assistant */}
      <UnifiedAIAssistant />
    </div>;
}