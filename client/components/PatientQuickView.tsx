import React from "react";
import { User, Phone, Calendar, MapPin, CreditCard, Clock, FileText, ArrowUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export interface PatientQuickInfo {
  id: string;
  name: string;
  phone?: string;
  lastVisit?: string;
  nextVisit?: string;
  address?: string;
  totalSpent?: number;
  outstandingBalance?: number;
  recentTreatments?: Array<{ date: string; treatment: string; cost?: number }>;
}

interface PatientQuickViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: PatientQuickInfo | null;
}

export default function PatientQuickView({ open, onOpenChange, patient }: PatientQuickViewProps) {
  const navigate = useNavigate();
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[96vw] sm:w-full rounded-2xl p-4" role="dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-gray-900">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-base sm:text-lg font-bold">{patient.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {patient.phone && (
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2 border">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 ltr:truncate rtl:truncate">{patient.phone}</span>
              </div>
            )}
            {patient.address && (
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2 border">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 ltr:truncate rtl:truncate">{patient.address}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {patient.lastVisit && (
              <div className="flex items-center gap-2 bg-blue-50 rounded-xl p-2 border border-blue-200">
                <Calendar className="w-4 h-4 text-blue-600" />
                <div className="text-xs text-blue-700">آخر زيارة: {patient.lastVisit}</div>
              </div>
            )}
            {patient.nextVisit && (
              <div className="flex items-center gap-2 bg-green-50 rounded-xl p-2 border border-green-200">
                <Clock className="w-4 h-4 text-green-600" />
                <div className="text-xs text-green-700">الزيارة القادمة: {patient.nextVisit}</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {typeof patient.totalSpent === "number" && (
              <div className="bg-white rounded-xl p-2 border">
                <div className="text-[11px] text-gray-500">إجمالي الإنفاق</div>
                <div className="text-sm font-bold text-gray-900">{patient.totalSpent.toLocaleString()} د.ع</div>
              </div>
            )}
            {typeof patient.outstandingBalance === "number" && (
              <div className="bg-white rounded-xl p-2 border">
                <div className="text-[11px] text-gray-500">الرصيد المستحق</div>
                <div className={cn("text-sm font-bold", patient.outstandingBalance > 0 ? "text-amber-700" : "text-gray-900")}>{patient.outstandingBalance.toLocaleString()} د.ع</div>
              </div>
            )}
          </div>

          {patient.recentTreatments && patient.recentTreatments.length > 0 && (
            <div className="bg-white rounded-xl p-2 border">
              <div className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" /> السجل العلاجي الأخير
              </div>
              <div className="space-y-2 max-h-40 overflow-auto">
                {patient.recentTreatments.slice(0, 5).map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="text-gray-700">{t.treatment}</div>
                    <div className="text-gray-500 text-xs">{t.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>إغلاق</Button>
            <Button size="sm" onClick={() => navigate(`/admin/patients/${patient.id}`)}>
              فتح الملف الكامل
              <ArrowUpRight className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
