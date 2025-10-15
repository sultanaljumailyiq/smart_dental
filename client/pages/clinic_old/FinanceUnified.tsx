import React, { useState, useEffect } from "react";
import Accounts from "@/pages/Accounts";
import Sales from "@/pages/Sales";
import Purchases from "@/pages/Purchases";
import { Wallet, TrendingUp, ShoppingCart, Users, DollarSign, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { sharedClinicData } from "@/services/sharedClinicData";
import { adaptStaffListToLegacy } from "@/services/clinicDataAdapter";
import type { ClinicStats, Staff } from "@/services/sharedClinicData";

function EmployeesFinance({ staff, loading }: { staff: Staff[]; loading: boolean }) {
  const mapRoleToArabic = (role: string): string => {
    const roleMap: Record<string, string> = {
      'doctor': 'طبيب',
      'nurse': 'ممرض',
      'assistant': 'مساعد',
      'receptionist': 'موظف استقبال',
      'manager': 'مدير'
    };
    return roleMap[role.toLowerCase()] || role;
  };

  const getBaseSalary = (role: string): number => {
    const salaries: Record<string, number> = {
      'doctor': 2500000,
      'nurse': 1200000,
      'assistant': 600000,
      'receptionist': 450000,
      'manager': 1800000
    };
    return salaries[role.toLowerCase()] || 500000;
  };

  const getBonus = (role: string): number => {
    const bonuses: Record<string, number> = {
      'doctor': 300000,
      'nurse': 100000,
      'assistant': 50000,
      'receptionist': 25000,
      'manager': 200000
    };
    return bonuses[role.toLowerCase()] || 0;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <span className="mr-2 text-gray-600">جاري تحميل بيانات الموظفين...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">أجور الموظفين</h3>
      </div>
      <div className="grid grid-cols-12 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-600 rounded-lg">
        <div className="col-span-3">الاسم</div>
        <div className="col-span-3">الوظيفة</div>
        <div className="col-span-2">الراتب الأساسي</div>
        <div className="col-span-2">المكافآت</div>
        <div className="col-span-2 text-left">الحالة</div>
      </div>
      <div className="divide-y">
        {staff.map((employee) => {
          const baseSalary = getBaseSalary(employee.role);
          const bonus = getBonus(employee.role);
          return (
            <div
              key={employee.id}
              className="grid grid-cols-12 px-4 py-3 items-center text-sm"
            >
              <div className="col-span-3 font-medium text-gray-900">{employee.name}</div>
              <div className="col-span-3 text-gray-700">{mapRoleToArabic(employee.role)}</div>
              <div className="col-span-2">
                {baseSalary.toLocaleString("ar-IQ")} IQD
              </div>
              <div className="col-span-2">
                {bonus.toLocaleString("ar-IQ")} IQD
              </div>
              <div className="col-span-2 text-left">
                <span className={cn(
                  "inline-block px-2 py-1 rounded-full text-xs",
                  employee.status === 'active' ? "bg-green-100 text-green-700" : 
                  employee.status === 'on_leave' ? "bg-yellow-100 text-yellow-700" :
                  "bg-gray-100 text-gray-700"
                )}>
                  {employee.status === 'active' ? 'نشط' : 
                   employee.status === 'on_leave' ? 'في إجازة' : 'غير نشط'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FinanceUnified() {
  const [tab, setTab] = useState<
    "accounts" | "sales" | "purchases" | "employees"
  >("accounts");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ClinicStats | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [clinicStats, staffData] = await Promise.all([
          sharedClinicData.getClinicStats(),
          sharedClinicData.getStaff()
        ]);
        setStats(clinicStats);
        setStaff(staffData);
      } catch (error) {
        console.error("Error loading financial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const tabs = [
    { id: "accounts" as const, label: "الحسابات", icon: Wallet },
    { id: "sales" as const, label: "المبيعات", icon: TrendingUp },
    { id: "purchases" as const, label: "المشتريات", icon: ShoppingCart },
    { id: "employees" as const, label: "الموظفون (الأجور)", icon: Users },
  ];

  return (
    <div className="space-y-4" dir="rtl">
      <div className="bg-white border rounded-xl p-2">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap",
                  active
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700 border",
                )}
              >
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {tab === "accounts" && <Accounts />}
        {tab === "sales" && <Sales />}
        {tab === "purchases" && <Purchases />}
        {tab === "employees" && <EmployeesFinance staff={staff} loading={loading} />}
      </div>
    </div>
  );
}
