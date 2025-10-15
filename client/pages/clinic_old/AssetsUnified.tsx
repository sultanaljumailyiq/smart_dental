import React, { useState, useEffect } from "react";
import Stocks from "@/pages/Stocks";
import Peripherals from "@/pages/Peripherals";
import { Boxes, Cpu, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { sharedClinicData } from "@/services/sharedClinicData";
import { adaptInventoryListToLegacy, LegacyInventoryItem } from "@/services/clinicDataAdapter";

export default function AssetsUnified() {
  const [tab, setTab] = useState<"stocks" | "peripherals">("stocks");
  const [inventory, setInventory] = useState<LegacyInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "stocks" as const, label: "المخزون", icon: Boxes },
    { id: "peripherals" as const, label: "الأجهزة", icon: Cpu },
  ];

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const inventoryData = await sharedClinicData.getInventory();
      const legacyInventory = adaptInventoryListToLegacy(inventoryData);
      
      setInventory(legacyInventory);
    } catch (err) {
      console.error("Error loading inventory:", err);
      setError("حدث خطأ أثناء تحميل بيانات المخزون");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
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

      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-xl border">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
            <p className="text-gray-600">جاري تحميل البيانات...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadInventoryData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : (
        <div>
          {tab === "stocks" && <Stocks stockData={inventory} />}
          {tab === "peripherals" && <Peripherals />}
        </div>
      )}
    </div>
  );
}
