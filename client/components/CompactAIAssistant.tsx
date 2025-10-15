import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Sparkles,
  Loader2,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface CompactAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  position?: "bottom-right" | "bottom-left" | "center";
}

const mockResponses = [
  "Based on your symptoms, I recommend scheduling an appointment with a dentist for a proper examination.",
  "For tooth pain relief, you can try rinsing with warm salt water and taking over-the-counter pain medication.",
  "Regular dental checkups every 6 months help prevent serious dental issues.",
  "Good oral hygiene includes brushing twice daily and flossing regularly.",
  "If you're experiencing severe pain, consider visiting an emergency dental clinic.",
];

export default function CompactAIAssistant({
  isOpen,
  onClose,
  position = "bottom-right",
}: CompactAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your dental AI assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(
      () => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: mockResponses[Math.floor(Math.random() * mockResponses.length)],
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
        setIsLoading(false);
      },
      1000 + Math.random() * 2000,
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const positionClasses = {
    "bottom-right": "bottom-4 right-2 lg:right-4",
    "bottom-left": "bottom-4 left-2 lg:left-4",
    center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed z-50 transition-all duration-300 ease-out",
        positionClasses[position],
        isMinimized ? "w-72 lg:w-80 h-16" : "w-72 lg:w-80 h-80 lg:h-96",
        // Mobile adjustments
        "max-w-[calc(100vw-1rem)]",
      )}
    >
      {/* Main container */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 lg:p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-3 h-3 lg:w-4 lg:h-4" />
            </div>
            <div>
              <div className="font-semibold text-xs lg:text-sm">
                مساعد الذكاء الاصطناعي
              </div>
              <div className="text-xs opacity-75 hidden lg:block">
                الدعم الطبي
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMinimized ? (
                <Maximize2 className="w-3 h-3 lg:w-4 lg:h-4" />
              ) : (
                <Minimize2 className="w-3 h-3 lg:w-4 lg:h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-3 h-3 lg:w-4 lg:h-4" />
            </button>
          </div>
        </div>

        {/* Content - only show when not minimized */}
        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-2 lg:p-3 space-y-2 lg:space-y-3 h-48 lg:h-64">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2",
                    message.sender === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {message.sender === "ai" && (
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] p-2 rounded-xl text-sm",
                      message.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900",
                    )}
                  >
                    {message.text}
                  </div>
                  {message.sender === "user" && (
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-3 h-3 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-gray-100 p-2 rounded-xl">
                    <div className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
                      <span className="text-xs text-gray-500">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-2 lg:p-3">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اسأل عن صحة أسنانك..."
                  className="flex-1 px-2 lg:px-3 py-1.5 lg:py-2 border border-gray-200 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs lg:text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim() || isLoading}
                  className="w-7 h-7 lg:w-8 lg:h-8 bg-blue-500 text-white rounded-lg lg:rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Hook for managing AI assistant state
export function useAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  const openAssistant = () => setIsOpen(true);
  const closeAssistant = () => setIsOpen(false);
  const toggleAssistant = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    openAssistant,
    closeAssistant,
    toggleAssistant,
  };
}

// Floating AI button
interface FloatingAIButtonProps {
  onClick: () => void;
  position?: "bottom-right" | "bottom-left";
}

export function FloatingAIButton({
  onClick,
  position = "bottom-right",
}: FloatingAIButtonProps) {
  const positionClasses = {
    "bottom-right": "bottom-20 lg:bottom-24 right-2 lg:right-4",
    "bottom-left": "bottom-20 lg:bottom-24 left-2 lg:left-4",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed z-40 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110",
        positionClasses[position],
      )}
    >
      <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />

      {/* Pulse animation */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-ping opacity-20" />
    </button>
  );
}
