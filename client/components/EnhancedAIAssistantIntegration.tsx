import React from "react";
import EnhancedAIAssistant from "./EnhancedAIAssistant";

interface EnhancedAIAssistantIntegrationProps {
  systemType: "new" | "old";
  currentPage?: string;
}

const EnhancedAIAssistantIntegration: React.FC<
  EnhancedAIAssistantIntegrationProps
> = ({ systemType, currentPage = "" }) => {
  // Customize AI assistant based on system type and current page
  const getTheme = () => {
    switch (systemType) {
      case "new":
        return "clinic";
      case "old":
        return "light";
      default:
        return "light";
    }
  };

  const getPosition = () => {
    // Position the assistant based on the system type
    return systemType === "new" ? "bottom-right" : "bottom-left";
  };

  return (
    <EnhancedAIAssistant
      isFloating={true}
      position={getPosition()}
      theme={getTheme()}
    />
  );
};

export default EnhancedAIAssistantIntegration;
