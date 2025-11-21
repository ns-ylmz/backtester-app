"use client";

import { useEffect, useRef, useState } from "react";

// TypeScript interface for Message type
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    // Sadece AI mesajı geldiğinde ve loading değilken scroll et
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant' && !isLoading) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, isLoading]);

  // Clear error when user starts typing
  useEffect(() => {
    if (input && error) {
      setError(null);
    }
  }, [input, error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const userMessage = input.trim();
    if (!userMessage || isLoading) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Create assistant message placeholder
    const assistantMsgId = (Date.now() + 1).toString();
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          strategy: userMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Response body is not readable");
      }

      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        
        // Update the assistant message in real-time
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, content: accumulatedText }
              : msg
          )
        );
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Chat error:", err);
      setIsLoading(false);
      
      // Remove the assistant message placeholder on error
      setMessages((prev) => prev.filter((msg) => msg.id !== assistantMsgId));

      const errorMessage = err instanceof Error ? err.message : "Bir hata oluştu";
      
      if (errorMessage.includes("429")) {
        setError("Çok fazla istek gönderdiniz. Lütfen bir dakika sonra tekrar deneyin.");
      } else if (errorMessage.includes("500")) {
        setError("Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.");
      } else {
        setError(errorMessage);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex h-[600px] flex-col rounded-xl border border-purple-500/20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 shadow-2xl sm:h-[700px]">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-gradient-to-r from-blue-900/50 to-purple-900/50 px-4 py-3 sm:px-6">
        <h2 className="text-lg font-semibold text-white sm:text-xl">
          AI Trading Strateji Asistanı
        </h2>
        <p className="text-xs text-blue-200 sm:text-sm">
          Stratejinizi analiz edin ve optimize edin
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-6xl">🤖</div>
              <p className="text-lg text-blue-200">
                Trading stratejiniz hakkında soru sorun
              </p>
              <p className="mt-2 text-sm text-blue-300">
                Örnek: "RSI ve MACD kullanan bir scalping stratejisi nasıl optimize edilir?"
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-lg shadow-lg sm:h-10 sm:w-10">
                  🤖
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-lg sm:max-w-[75%] ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                    : "bg-slate-800/90 text-gray-100 border border-purple-500/20"
                }`}
              >
                <div className="whitespace-pre-wrap break-words text-sm leading-relaxed sm:text-base">
                  {message.content || (
                    <span className="text-gray-400">Yanıt bekleniyor...</span>
                  )}
                </div>
              </div>

              {message.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-lg shadow-lg sm:h-10 sm:w-10">
                  👤
                </div>
              )}
            </div>
          ))}

          {isLoading && messages.length > 0 && (
            <div className="flex gap-3 justify-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-lg shadow-lg sm:h-10 sm:w-10">
                🤖
              </div>
              <div className="rounded-2xl bg-slate-800/90 px-4 py-3 border border-purple-500/20">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400"></span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-900/30 border border-red-500/50 px-4 py-3 text-sm text-red-200">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-purple-500/20 bg-slate-900/50 p-4 sm:p-6"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Trading stratejinizi sorun..."
            disabled={isLoading}
            className="flex-1 rounded-lg border border-purple-500/30 bg-slate-800/90 px-4 py-3 text-white placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:py-3.5"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-blue-500 hover:to-purple-500 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-8"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="hidden sm:inline">Gönderiliyor...</span>
              </div>
            ) : (
              <span>Gönder</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
