// components/feedback/FlashMessage.tsx
"use client";
import { useEffect } from "react";
import { useMessage } from "../../../../context/MessageContext";
import Alert from "./Alert";

export default function FlashMessage() {
  const { message, clearMessage } = useMessage();

  useEffect(() => {
    if (message) {
      // 5秒後にメッセージを自動的にクリア
      const timer = setTimeout(() => {
        clearMessage();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  // メッセージがない場合は何も表示しない
  if (!message || !message.text) return null;

  return <Alert severity={message.severity}>{message.text}</Alert>;
}
