import { useState } from "react";
import ModernUnifiedHeader from "@/components/ModernUnifiedHeader";
import type { SectionType } from "@/components/ModernUnifiedHeader";

export const useModernHeader = () => {
  const [useModernDesign, setUseModernDesign] = useState(true);

  const Header = useModernDesign ? ModernUnifiedHeader : () => null;

  return {
    Header,
    useModernDesign,
    setUseModernDesign,
  };
};

export default useModernHeader;
