// components/CarChatbot.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Car, X, Loader2 } from "lucide-react";

// Define a type for a single chat message
type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

/**
 * A simple, car-focused chat interface using the Next.js API handler.
 */
export function CarChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the chat window on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Handle the user submitting a message
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() === "" || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // 1. Send the user's message to the API handler
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      const botResponse: Message = {
        id: Date.now() + 1,
        text: data.response || "Sorry, I couldn't get a response. Try again!",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: Date.now() + 2,
        text: "Error connecting to the chat service. Please check the server logs.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleButton = (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg transition-transform duration-200 transform hover:scale-105"
      aria-label={isOpen ? "Close Chat" : "Open Car Chatbot"}
    >
      {isOpen ? <X size={24} /> : <Car size={24} />}
    </button>
  );

  // The toggle button is always fixed to the bottom right
  if (!isOpen) {
    return <div className="fixed bottom-4 right-4 z-50">{toggleButton}</div>;
  }

  // When open, the chatbot is full-screen on mobile and a floating box on desktop
  return (
    <div className="fixed inset-0 z-50 flex flex-col border border-gray-200 bg-white shadow-2xl transition-all duration-300 ease-in-out sm:inset-auto sm:bottom-4 sm:right-4 sm:h-[400px] sm:w-80 sm:rounded-lg">
      {/* Header */}
      <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
        <div className="flex items-center">
          <Car size={20} className="mr-2" />
          <h3 className="text-lg font-bold">Ngbuka Car Bot</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-blue-900 rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10 text-sm">
            Ask me anything about cars! I&apos;m trained *only* on automotive
            topics.
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] p-2 rounded-lg text-sm shadow-md ${
                msg.sender === "user"
                  ? "bg-blue-800 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 p-2 rounded-lg text-sm text-gray-800 rounded-tl-none flex items-center">
              <Loader2 size={16} className="animate-spin mr-2" />
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-3 border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a car question..."
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={input.trim() === "" || isLoading}
          className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-900 disabled:bg-gray-400"
          aria-label="Send Message"
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
}
