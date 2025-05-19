// context/MessageContext.tsx
"use client";
import { createContext, ReactNode, useContext, useState } from "react";

// Alert コンポーネントの型と合わせる
type AlertSeverity = "error" | "warning" | "success" | "info";

type MessageType = {
  text: string;
  severity: AlertSeverity;
};

type MessageContextType = {
  message: MessageType | null;
  setMessage: (message: MessageType | null) => void;
  clearMessage: () => void;
};

const MessageContext = createContext<MessageContextType>({
  message: null,
  setMessage: () => {},
  clearMessage: () => {},
});

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<MessageType | null>(null);

  const clearMessage = () => setMessage(null);

  return (
    <MessageContext.Provider value={{ message, setMessage, clearMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
