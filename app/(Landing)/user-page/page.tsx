"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Define a common type for Icon props to allow className overrides
type IconProps = {
  className?: string;
};

// Icons
const SearchIcon = ({ className }: IconProps) => (
  <svg
    className={`w-5 h-5 ${className || ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const CarIcon = ({ className }: IconProps) => (
  <svg
    className={`w-6 h-6 ${className || ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 14c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9c0-3.3 2.7-6 6-6h2c3.3 0 6 2.7 6 6v5z"
    />
    <circle cx="9" cy="17" r="2" />
    <circle cx="15" cy="17" r="2" />
  </svg>
);

const MessageIcon = ({ className }: IconProps) => (
  <svg
    className={`w-5 h-5 ${className || ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const CheckCircleIcon = ({ className }: IconProps) => (
  <svg
    className={`w-5 h-5 ${className || ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const SendIcon = ({ className }: IconProps) => (
  <svg
    className={`w-5 h-5 ${className || ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

const UserIcon = ({ className }: IconProps) => (
  <svg
    className={`w-5 h-5 ${className || ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const HeartIcon = ({
  filled = false,
  className,
}: {
  filled?: boolean;
  className?: string;
}) => (
  <svg
    className={`w-5 h-5 ${className || ""}`}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const MenuIcon = ({ className }: IconProps) => (
  <svg
    className={`w-6 h-6 ${className || ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const XIcon = ({ className }: IconProps) => (
  <svg
    className={`w-6 h-6 ${className || ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const PlusIcon = ({ className }: IconProps) => (
  <svg
    className={`w-5 h-5 ${className || ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

// Search Bar Component
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Find Answers</h2>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
          placeholder="Ask about car problems, spare parts, or solutions..."
          className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
};

// My Discussions Component
const MyDiscussions = () => {
  const discussions = [
    {
      id: 1,
      title: "Engine stalling when idle - Toyota Corolla",
      replies: 8,
      likes: 5,
      views: 120,
      timeAgo: "1 hour ago",
      status: "Open",
      category: "Engine Issues",
    },
    {
      id: 2,
      title: "Brake squeaking after rain",
      replies: 12,
      likes: 10,
      views: 200,
      timeAgo: "3 hours ago",
      status: "Solved",
      category: "Brakes",
    },
    {
      id: 3,
      title: "Battery draining too fast",
      replies: 4,
      likes: 2,
      views: 80,
      timeAgo: "1 day ago",
      status: "In Progress",
      category: "Electrical",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <MessageIcon className="mr-2 text-blue-600" />
          My Discussions
        </h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center">
          <PlusIcon className="w-4 h-4 mr-1" />
          New Post
        </button>
      </div>

      <div className="space-y-4">
        {discussions.map((discussion) => (
          <div
            key={discussion.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full mr-2">
                    {discussion.category}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      discussion.status === "Solved"
                        ? "bg-green-100 text-green-600"
                        : discussion.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {discussion.status}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                  {discussion.title}
                </h3>
                <div className="flex items-center text-sm text-gray-600">
                  <span>{discussion.timeAgo}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MessageIcon className="w-4 h-4 mr-1" />
                  <span>{discussion.replies} replies</span>
                </div>
                <div className="flex items-center">
                  <HeartIcon className="w-4 h-4 mr-1" />
                  <span>{discussion.likes} likes</span>
                </div>
                <div className="flex items-center">
                  <span>{discussion.views} views</span>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View Discussion →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Chat Bot Component
const ChatBot = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [messages, setMessages] = useState<
    { id: number; text: string; isBot: boolean; timestamp: Date }[]
  >([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set initial message on the client to avoid hydration mismatch
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your AI car assistant. Ask me about car problems, spare parts, or get advice on maintenance. What's on your mind?",
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

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: "Thanks for sharing! Can you provide more details? For example, what car make and model do you have, and when did the issue start?",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const sendQuickReply = (reply: string) => {
    const userMessage = {
      id: Date.now(),
      text: reply,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: `Got it! You're experiencing "${reply}". What's your car make and model so I can provide specific advice?`,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 bg-white w-80 md:w-96 shadow-2xl flex flex-col z-40">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <MessageIcon className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Car Assistant</h3>
            <p className="text-sm text-green-600">● Online</p>
          </div>
        </div>
        <button
          onClick={onClose}
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
              className={`max-w-[80%] px-4 py-3 rounded-lg ${
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
                {message.timestamp.toLocaleTimeString([], {
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

      <div className="px-4 py-2 border-t bg-gray-50">
        <p className="text-xs text-gray-600 mb-2">Quick replies:</p>
        <div className="flex flex-wrap gap-1">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => sendQuickReply(reply)}
              className="text-xs bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2 p-4 border-t">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about your car problem..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !inputMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

// Main User Dashboard
const NgbukaUserDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     
      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isChatOpen ? "pr-80 md:pr-96" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Message */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Welcome to Ngbuka Forum!
            </h2>
            <p className="text-gray-600">
              Ask questions, share solutions, and connect with other car
              enthusiasts. Start by searching for answers or posting your
              question.
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* My Discussions */}
          <MyDiscussions />

          {/* Footer Section */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Need More Help?
              </h3>
              <p className="text-gray-600 mb-6">
                Browse our knowledge base or ask our AI assistant for quick
                answers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Browse Knowledge Base
                </button>
                <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ChatBot Sidebar */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Sidebar Toggle Button (visible when sidebar is closed) */}
      {!isChatOpen && (
        <div className="fixed right-6 bottom-6 z-50">
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center justify-center"
            title="Open AI Assistant"
          >
            <MessageIcon className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default NgbukaUserDashboard;
