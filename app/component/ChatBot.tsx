// components/ChatBot.tsx
"use client";

import React, { useState, useEffect } from "react";
import { MessageIcon, XIcon, SendIcon } from "./Icons";

export const ChatBot = () => {
  const [messages, setMessages] = useState<
    { id: number; text: string; isBot: boolean; timestamp: Date }[]
  >([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Set initial message on the client to avoid hydration mismatch
    setMessages([
      {
        id: 1,
        text: "Hi! I'm your AI car assistant. I can help you diagnose car problems, find spare parts, or connect you with experts. What can I help you with today?",
        isBot: true,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const quickReplies = [
    "My car won't start",
    "Strange engine noise",
    "Brake problems",
    "AC not working",
  ];

  const handleUserMessage = async (messageText: string) => {
    const userMessage = {
      id: Date.now(),
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (inputMessage) setInputMessage(""); // Clear input only if it was used
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: messageText,
          history: messages.slice(1), // Send history, excluding the initial greeting
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          // The API might return a JSON with an 'error' field
          errorData = await response.json();
        } catch (e) {
          // If the response is not JSON (e.g., an HTML error page from the server)
          // we create a more informative error.
          throw new Error(
            `Server returned an error: ${response.status} ${response.statusText}`
          );
        }
        throw new Error(
          errorData.error || `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      const botResponse = {
        id: Date.now() + 1,
        text: data.text,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      const errorResponse = {
        id: Date.now() + 1,
        text: `Sorry, I'm having trouble connecting. (Error: ${errorMessage})`,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    handleUserMessage(inputMessage);
  };

  const sendQuickReply = (reply: string) => {
    handleUserMessage(reply);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors"
        >
          <MessageIcon />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="w-80 sm:w-96 bg-white rounded-xl shadow-lg flex flex-col h-96">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <MessageIcon className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Car Assistant</h3>
              <p className="text-sm text-green-600">
                ● Online - Always ready to help
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isBot ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-lg ${
                  message.isBot
                    ? "bg-gray-100 text-gray-900"
                    : "bg-blue-600 text-white"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.isBot ? "text-gray-500" : "text-blue-200"
                  }`}
                >
                  {isClient &&
                    message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Replies */}
        <div className="px-4 py-3 bg-white border-t">
          <p className="text-xs text-gray-500 mb-2 font-medium">
            Quick replies:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => sendQuickReply(reply)}
                className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors font-medium"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="flex items-center space-x-2 p-4 bg-white rounded-b-2xl border-t">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Describe your car problem..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
