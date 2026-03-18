"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";

interface Message {
  id: string;
  content: string;
  sender: "user" | "support";
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    content: "Hi there! How can we help you today?",
    sender: "support",
    timestamp: new Date(),
  },
];

export function SupportChat() {
  const { accentColor, resolvedTheme } = useTheme();
  const colors = getColorClasses(accentColor);
  const isLight = resolvedTheme === "light";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate support response
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your message! Our team will get back to you shortly.",
        sender: "support",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, supportMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Chat icon path
  const chatIcon = "M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z";

  // Close icon path
  const closeIcon = "M6 18 18 6M6 6l12 12";

  // Send icon path
  const sendIcon = "M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5";

  return (
    <>
      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl transition-all duration-300 transform origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none",
          isLight
            ? "bg-white border border-zinc-200"
            : "bg-[#1E1E21] border border-[#2A2A2E]"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between p-4 rounded-t-2xl",
            colors.gradient,
            "bg-gradient-to-r text-white"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={chatIcon} />
              </svg>
            </div>
            <div>
              <div className="font-semibold">Support Chat</div>
              <div className="text-xs opacity-80">We typically reply in minutes</div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={closeIcon} />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div
          className={cn(
            "h-80 overflow-y-auto p-4 space-y-4",
            isLight ? "bg-zinc-50" : "bg-[#18181B]"
          )}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                  message.sender === "user"
                    ? cn(colors.gradient, "bg-gradient-to-r text-white")
                    : isLight
                    ? "bg-white border border-zinc-200 text-zinc-800"
                    : "bg-[#27272A] border border-[#3F3F46] text-zinc-100"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className={cn(
            "p-4 rounded-b-2xl",
            isLight ? "bg-white border-t border-zinc-200" : "bg-[#1E1E21] border-t border-[#2A2A2E]"
          )}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className={cn(
                "flex-1 px-4 py-2 rounded-xl text-sm outline-none transition-colors",
                isLight
                  ? "bg-zinc-100 text-zinc-800 placeholder-zinc-400 focus:ring-2"
                  : "bg-[#27272A] text-zinc-100 placeholder-zinc-500 focus:ring-2",
                `focus:ring-${accentColor}-500/50`
              )}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                colors.gradient,
                "bg-gradient-to-r text-white",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:shadow-lg hover:scale-105 active:scale-95"
              )}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={sendIcon} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300",
          colors.gradient,
          "bg-gradient-to-r text-white",
          "hover:shadow-xl hover:scale-110 active:scale-95",
          "flex items-center justify-center"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <svg
          className={cn(
            "w-6 h-6 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={isOpen ? closeIcon : chatIcon} />
        </svg>
      </button>
    </>
  );
}
