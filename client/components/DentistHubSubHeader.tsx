import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, User, Bell, Heart, Building, Brain, ListTodo, MessageSquare } from "lucide-react";
import { sharedClinicData } from "@/services/sharedClinicData";

interface TabItem {
  key: string;
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  match: (pathname: string) => boolean;
}

const tabs: TabItem[] = [
  {
    key: "overview",
    label: "النظرة العامة",
    path: "/dentist-hub",
    icon: Home,
    match: (p) =>
      p === "/dentist-hub" ||
      (p.startsWith("/dentist-hub/") === false && p.startsWith("/dentist-hub")),
  },
  {
    key: "smart-clinic",
    label: "العيادة الذكية",
    path: "/dentist-hub/smart-clinic/main",
    icon: Brain,
    match: (p) => p.startsWith("/dentist-hub/smart-clinic"),
  },
  {
    key: "clinics",
    label: "ادارة العيادات",
    path: "/dentist-hub/clinics",
    icon: Building,
    match: (p) => p.startsWith("/dentist-hub/clinics"),
  },
  {
    key: "tasks-reminders",
    label: "المهام والتذكيرات",
    path: "/dentist-hub/tasks-reminders",
    icon: ListTodo,
    match: (p) => p.startsWith("/dentist-hub/tasks-reminders"),
  },
  {
    key: "messages",
    label: "الرسائل والدعم",
    path: "/dentist-hub/messages",
    icon: MessageSquare,
    match: (p) => p.startsWith("/dentist-hub/messages"),
  },
  {
    key: "notifications",
    label: "الإشعارات",
    path: "/dentist-hub/notifications",
    icon: Bell,
    match: (p) =>
      (p === "/notifications" || p.startsWith("/dentist-hub/notifications")) && !location.search.includes("tab=messages"),
  },
  {
    key: "favorites",
    label: "المفضلة",
    path: "/dentist-hub/favorites",
    icon: Heart,
    match: (p) =>
      p === "/dentist-hub/favorites" || p.startsWith("/dentist-hub/favorites"),
  },
  {
    key: "profile",
    label: "الملف الشخصي",
    path: "/dentist-hub/profile",
    icon: User,
    match: (p) => p.startsWith("/dentist-hub/profile"),
  },
];

export default function DentistHubSubHeader() {
  const location = useLocation();
  const pathname = location.pathname;
  const [pendingTasksCount, setPendingTasksCount] = useState(0);

  useEffect(() => {
    const loadPendingCount = async () => {
      try {
        const tasks = await sharedClinicData.getStaffTasks();
        const reminders = await sharedClinicData.getStaffReminders();
        const pendingTasks = tasks.filter(t => t.status === "pending").length;
        const pendingReminders = reminders.filter(r => r.status === "pending").length;
        setPendingTasksCount(pendingTasks + pendingReminders);
      } catch (error) {
        console.error("Error loading pending tasks count:", error);
      }
    };
    
    loadPendingCount();

    // Listen for updates from sharedClinicData
    const handleUpdate = () => {
      loadPendingCount();
    };
    
    window.addEventListener('tasksRemindersUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('tasksRemindersUpdated', handleUpdate);
    };
  }, [pathname]);

  const isActive = (item: TabItem) => item.match(pathname);

  return (
    <div className="fixed top-16 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto h-14 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            const showBadge = item.key === "tasks-reminders" && pendingTasksCount > 0;
            
            return (
              <Link
                key={item.key}
                to={item.path}
                className={cn(
                  "relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-colors flex-shrink-0",
                  active
                    ? "bg-violet-50 text-violet-700 border border-violet-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0",
                    active ? "text-violet-600" : "text-gray-500",
                  )}
                />
                <span className="hidden sm:inline">{item.label}</span>
                {showBadge && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-violet-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium px-1">
                    {pendingTasksCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
