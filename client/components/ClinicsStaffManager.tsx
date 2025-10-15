import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Shield,
  User,
  Mail,
  Phone,
  KeyRound,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export interface ClinicLite {
  id: string;
  name?: string;
}

interface Staff {
  id: string;
  name: string;
  role: "doctor" | "assistant" | "reception" | "manager";
  email?: string;
  phone?: string;
  passwordHash?: string; // SHA-256
  status: "active" | "inactive";
  createdAt: string;
}

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

async function hashPassword(plain: string) {
  const enc = new TextEncoder().encode(plain);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function loadStaff(clinicId: string): Staff[] {
  try {
    const raw = localStorage.getItem(`clinic_staff:${clinicId}`);
    return raw ? (JSON.parse(raw) as Staff[]) : [];
  } catch {
    return [];
  }
}

function saveStaff(clinicId: string, list: Staff[]) {
  localStorage.setItem(`clinic_staff:${clinicId}`, JSON.stringify(list));
}

export default function ClinicsStaffManager({
  clinics,
}: {
  clinics: ClinicLite[];
}) {
  const [openClinicId, setOpenClinicId] = useState<string | null>(null);
  const [staffMap, setStaffMap] = useState<Record<string, Staff[]>>({});
  const [creatingFor, setCreatingFor] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    role: "assistant" as Staff["role"],
    email: "",
    phone: "",
  });
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const map: Record<string, Staff[]> = {};
    clinics.forEach((c) => (map[c.id] = loadStaff(c.id)));
    setStaffMap(map);
  }, [clinics]);

  const addStaff = async (clinicId: string) => {
    if (!form.name.trim()) return;
    const list = staffMap[clinicId] || [];
    const id = generateId();
    const tempPassword = Math.random().toString(36).slice(2, 10);
    const passwordHash = await hashPassword(tempPassword);
    const entry: Staff = {
      id,
      name: form.name.trim(),
      role: form.role,
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      passwordHash,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    const updated = [entry, ...list];
    saveStaff(clinicId, updated);
    setStaffMap((prev) => ({ ...prev, [clinicId]: updated }));
    setForm({ name: "", role: "assistant", email: "", phone: "" });
    setCreatingFor(null);
    try {
      await navigator.clipboard.writeText(tempPassword);
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
      toast({ description: "تم إنشاء الموظف ونسخ كلمة المرور المؤقتة" });
    } catch {
      toast({
        description: `تم إنشاء الموظف. كلمة المرور المؤقتة: ${tempPassword}`,
      });
    }
  };

  const resetPassword = async (clinicId: string, staffId: string) => {
    const list = staffMap[clinicId] || [];
    const idx = list.findIndex((s) => s.id === staffId);
    if (idx === -1) return;
    const newPass = Math.random().toString(36).slice(2, 10);
    const hash = await hashPassword(newPass);
    const updated = [...list];
    updated[idx] = { ...updated[idx], passwordHash: hash };
    saveStaff(clinicId, updated);
    setStaffMap((prev) => ({ ...prev, [clinicId]: updated }));
    try {
      await navigator.clipboard.writeText(newPass);
      setCopied(staffId);
      setTimeout(() => setCopied(null), 1500);
      toast({ description: "تم إعادة تعيين كلمة المرور ونسخها" });
    } catch {
      toast({ description: `تمت إعادة التعيين. كلمة المرور: ${newPass}` });
    }
  };

  const deactivate = (clinicId: string, staffId: string, active: boolean) => {
    const list = staffMap[clinicId] || [];
    const idx = list.findIndex((s) => s.id === staffId);
    if (idx === -1) return;
    const updated = [...list];
    updated[idx] = { ...updated[idx], status: active ? "active" : "inactive" };
    saveStaff(clinicId, updated);
    setStaffMap((prev) => ({ ...prev, [clinicId]: updated }));
  };

  return (
    <div className="space-y-3">
      {clinics.map((c) => {
        const open = openClinicId === c.id;
        const staff = staffMap[c.id] || [];
        return (
          <div key={c.id} className="rounded-2xl border bg-white">
            <button
              onClick={() => setOpenClinicId(open ? null : c.id)}
              className="w-full flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-2">
                {open ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <span className="font-semibold text-gray-900">
                  {c.name || "عيادة"}
                </span>
                <span className="text-xs text-gray-500">
                  ({staff.length} موظف)
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCreatingFor(creatingFor === c.id ? null : c.id);
                }}
                className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> إضافة موظف
              </button>
            </button>

            {creatingFor === c.id && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="ا��م الموظف"
                    className="border rounded-xl px-3 py-2 md:col-span-2"
                  />
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, role: e.target.value as any }))
                    }
                    className="border rounded-xl px-3 py-2"
                  >
                    <option value="doctor">طبيب</option>
                    <option value="assistant">مساعد</option>
                    <option value="reception">استعلامات</option>
                    <option value="manager">مدير</option>
                  </select>
                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="البريد الإلكتروني (اختياري)"
                    className="border rounded-xl px-3 py-2"
                  />
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="الهاتف (اختياري)"
                    className="border rounded-xl px-3 py-2"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => addStaff(c.id)}
                    disabled={!form.name.trim()}
                    className={cn(
                      "px-4 py-2 rounded-xl text-white",
                      form.name.trim()
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-gray-400",
                    )}
                  >
                    إنشاء وحفظ كلمة مرور مؤقتة
                  </button>
                </div>
              </div>
            )}

            {open && (
              <div className="px-4 pb-4">
                {staff.length === 0 ? (
                  <div className="p-4 text-sm text-gray-600">
                    لا يوجد طاقم بعد
                  </div>
                ) : (
                  <div className="divide-y">
                    {staff.map((s) => (
                      <div
                        key={s.id}
                        className="py-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {s.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {s.role}
                            </div>
                            {(s.email || s.phone) && (
                              <div className="text-xs text-gray-500 flex items-center gap-3 mt-0.5">
                                {s.email && (
                                  <span className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {s.email}
                                  </span>
                                )}
                                {s.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {s.phone}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              s.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700",
                            )}
                          >
                            {s.status === "active" ? "نشط" : "موقوف"}
                          </span>
                          <button
                            onClick={() =>
                              deactivate(c.id, s.id, s.status !== "active")
                            }
                            className="px-2 py-1 rounded-lg border text-xs"
                          >
                            {s.status === "active" ? "إيقاف" : "تفعيل"}
                          </button>
                          <button
                            onClick={() => resetPassword(c.id, s.id)}
                            className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs inline-flex items-center gap-1"
                          >
                            <KeyRound className="w-3 h-3" /> إعادة تعيين كلمة
                            المرور
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
