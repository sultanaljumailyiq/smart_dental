import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { sharedClinicData, Clinic } from "@/services/sharedClinicData";

interface ClinicContextType {
  selectedClinicId: string | null;
  setSelectedClinicId: (id: string | null) => void;
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  loading: boolean;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider = ({ children }: { children: ReactNode }) => {
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClinics = async () => {
      const data = await sharedClinicData.getClinics();
      setClinics(data);
      // Auto-select first clinic if available
      if (data.length > 0 && !selectedClinicId) {
        setSelectedClinicId(data[0].id);
      }
      setLoading(false);
    };
    loadClinics();
  }, []);

  const selectedClinic = selectedClinicId 
    ? clinics.find(c => c.id === selectedClinicId) || null 
    : null;

  return (
    <ClinicContext.Provider value={{ 
      selectedClinicId, 
      setSelectedClinicId, 
      clinics, 
      selectedClinic,
      loading 
    }}>
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (context === undefined) {
    throw new Error("useClinic must be used within a ClinicProvider");
  }
  return context;
};
