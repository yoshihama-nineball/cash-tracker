"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type AlertSeverity = "error" | "warning" | "success" | "info";

type MessageType = {
  text: string;
  severity: AlertSeverity;
};

interface MessageContextType {
  message: MessageType | null;
  showMessage: (text: string, severity: AlertSeverity) => void;
  clearMessage: () => void;
}
const defaultShowMessage = (text: string, severity: AlertSeverity) => {
  console.log("Default showMessage called", { text, severity });
};

const defaultClearMessage = () => {
  console.log("Default clearMessage called");
};

const MessageContext = createContext<MessageContextType>({
  message: null,
  showMessage: defaultShowMessage,
  clearMessage: defaultClearMessage,
});

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<MessageType | null>(null);

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  const showMessage = useCallback((text: string, severity: AlertSeverity) => {
    if (text) {
      setMessage({ text, severity });
    }
  }, []);

  const value = {
    message,
    showMessage,
    clearMessage,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};
export const useMessage = () => {
  const context = useContext(MessageContext);

  if (context === undefined) {
    throw new Error("useMessage must be used within a MessageProvider");
  }

  return context;
};
