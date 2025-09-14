"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Define a common type for Icon props
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

const FilterIcon = ({ className }: IconProps) => (
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
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

const ChevronDownIcon = ({ className }: IconProps) => (
  <svg
    className={`w-4 h-4 ${className || ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const EyeIcon = ({ className }: IconProps) => (
  <svg
    className={`w-4 h-4 ${className || ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const ClockIcon = ({ className }: IconProps) => (
  <svg
    className={`w-4 h-4 ${className || ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const UserIcon = ({ className }: IconProps) => (
  <svg
    className={`w-4 h-4 ${className || ""}`}
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

// Discussion data
const discussionsData: Discussion[] = [
  {
    id: 1,
    title: "Engine stalling when idle - Toyota Corolla 2018",
    content:
      "My car has been stalling at red lights and when idling. It started about a week ago. Already checked the air filter and it's clean. Any ideas?",
    author: "CarEnthusiast23",
    authorAvatar: "CE",
    replies: 8,
    likes: 5,
    views: 120,
    timeAgo: "1 hour ago",
    status: "Open" as const,
    category: "Engine Issues",
    tags: ["Toyota", "Engine", "Idle", "Stalling"],
    isUrgent: false,
    lastReplyTime: "30 minutes ago",
    isMyPost: true,
  },
  {
    id: 2,
    title: "Brake squeaking after rain - Honda Civic",
    content:
      "Every time it rains, my brakes start squeaking for the first few stops. Is this normal or should I be worried?",
    author: "MechMike",
    authorAvatar: "MM",
    replies: 12,
    likes: 10,
    views: 200,
    timeAgo: "3 hours ago",
    status: "Solved",
    category: "Brakes",
    tags: ["Honda", "Brakes", "Rain", "Squeaking"],
    isUrgent: false,
    lastReplyTime: "1 hour ago",
    isMyPost: false,
  },
  {
    id: 3,
    title: "Battery draining too fast - BMW 320i",
    content:
      "My BMW's battery is draining overnight. Car is only 2 years old. Could it be the alternator or something else?",
    author: "BMWDriver",
    authorAvatar: "BD",
    replies: 4,
    likes: 2,
    views: 80,
    timeAgo: "1 day ago",
    status: "In Progress",
    category: "Electrical",
    tags: ["BMW", "Battery", "Alternator", "Electrical"],
    isUrgent: true,
    lastReplyTime: "4 hours ago",
    isMyPost: true,
  },
  {
    id: 4,
    title: "AC compressor making loud noise - Ford Focus",
    content:
      "The AC compressor is making a grinding noise when I turn on the AC. Should I stop using it immediately?",
    author: "FordFan88",
    authorAvatar: "FF",
    replies: 6,
    likes: 3,
    views: 95,
    timeAgo: "2 days ago",
    status: "Open",
    category: "Air Conditioning",
    tags: ["Ford", "AC", "Compressor", "Noise"],
    isUrgent: true,
    lastReplyTime: "1 day ago",
    isMyPost: false,
  },
  {
    id: 5,
    title: "Transmission fluid change interval - Nissan Altima",
    content:
      "What's the recommended interval for changing transmission fluid in a 2020 Nissan Altima? Manual says 60k miles but I've heard different opinions.",
    author: "NissanOwner",
    authorAvatar: "NO",
    replies: 15,
    likes: 8,
    views: 340,
    timeAgo: "3 days ago",
    status: "Solved",
    category: "Maintenance",
    tags: ["Nissan", "Transmission", "Maintenance", "Fluid"],
    isUrgent: false,
    lastReplyTime: "2 days ago",
    isMyPost: false,
  },
  {
    id: 6,
    title: "Strange vibration at highway speeds - Mazda CX-5",
    content:
      "Getting vibration through the steering wheel at 65+ mph. Tires were recently balanced. Could it be wheel alignment?",
    author: "MazdaDriver",
    authorAvatar: "MD",
    replies: 9,
    likes: 6,
    views: 150,
    timeAgo: "4 days ago",
    status: "In Progress",
    category: "Suspension",
    tags: ["Mazda", "Vibration", "Steering", "Alignment"],
    isUrgent: false,
    lastReplyTime: "3 days ago",
    isMyPost: false,
  },
  {
    id: 7,
    title: "Check engine light after gas fill-up - Subaru Outback",
    content:
      "Check engine light came on right after filling up with gas. Code P0442. Is this related to the gas cap?",
    author: "SubaruLover",
    authorAvatar: "SL",
    replies: 7,
    likes: 4,
    views: 110,
    timeAgo: "5 days ago",
    status: "Solved",
    category: "Engine Issues",
    tags: ["Subaru", "Check Engine", "Gas Cap", "P0442"],
    isUrgent: false,
    lastReplyTime: "4 days ago",
    isMyPost: false,
  },
  {
    id: 8,
    title: "Power steering fluid leak - Chevrolet Malibu",
    content:
      "Found red fluid under my car this morning. Looks like power steering fluid. How serious is this and can I drive to the shop?",
    author: "ChevyOwner",
    authorAvatar: "CO",
    replies: 11,
    likes: 7,
    views: 180,
    timeAgo: "1 week ago",
    status: "Open",
    category: "Steering",
    tags: ["Chevrolet", "Power Steering", "Leak", "Fluid"],
    isUrgent: true,
    lastReplyTime: "6 days ago",
    isMyPost: false,
  },
];

// Chat Bot Component (same as before)
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

// Discussion Card Component
interface Discussion {
  id: number;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  replies: number;
  likes: number;
  views: number;
  timeAgo: string;
  status: 'Open' | 'Solved' | 'In Progress';
  category: string;
  tags: string[];
  isUrgent: boolean;
  lastReplyTime: string;
  isMyPost: boolean;
}

const DiscussionCard = ({ discussion }: { discussion: Discussion }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
            {discussion.authorAvatar}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">
                {discussion.author}
              </span>
              {discussion.isMyPost && (
                <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                  My Post
                </span>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500 space-x-2">
              <ClockIcon className="w-3 h-3" />
              <span>{discussion.timeAgo}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
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
          {discussion.isUrgent && (
            <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
              Urgent
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors cursor-pointer">
          {discussion.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {discussion.content}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {discussion.tags.map((tag: string, index: number) => (
          <span
            key={index}
            className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full hover:bg-blue-100 cursor-pointer transition-colors"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MessageIcon className="w-4 h-4" />
            <span>{discussion.replies} replies</span>
          </div>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="flex items-center space-x-1 hover:text-red-500 transition-colors"
          >
            <HeartIcon
              filled={isLiked}
              className={isLiked ? "text-red-500" : ""}
            />
            <span>{discussion.likes + (isLiked ? 1 : 0)}</span>
          </button>
          <div className="flex items-center space-x-1">
            <EyeIcon className="w-4 h-4" />
            <span>{discussion.views} views</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-500">
            Last reply {discussion.lastReplyTime}
          </span>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View Discussion →
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Discussions Page
const NgbukaDiscussionsPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [sortBy, setSortBy] = useState("Recent");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "All Categories",
    "Engine Issues",
    "Brakes",
    "Electrical",
    "Air Conditioning",
    "Maintenance",
    "Suspension",
    "Steering",
  ];
  const statuses = ["All Status", "Open", "In Progress", "Solved"];
  const sortOptions = ["Recent", "Most Replies", "Most Liked", "Most Viewed"];

  // Filter and sort discussions
  const filteredDiscussions = discussionsData
    .filter((discussion) => {
      const matchesSearch =
        discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "All Categories" ||
        discussion.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "All Status" || discussion.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Most Replies":
          return b.replies - a.replies;
        case "Most Liked":
          return b.likes - a.likes;
        case "Most Viewed":
          return b.views - a.views;
        default: // Recent
          return new Date(b.timeAgo).getTime() - new Date(a.timeAgo).getTime();
      }
    });

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
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Forum Discussions
              </h1>
              <p className="text-gray-600">
                Browse and participate in car-related discussions with the
                community
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors">
                <PlusIcon className="w-5 h-5" />
                <span>Start New Discussion</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            {/* Search Bar */}
            <div className="relative mb-4">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search discussions, tags, or keywords..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle Button */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FilterIcon />
                <span>Filters</span>
                <ChevronDownIcon
                  className={`transform transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{filteredDiscussions.length} discussions found</span>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {sortOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quick Filters */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quick Filters
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full hover:bg-red-100 transition-colors">
                        Urgent
                      </button>
                      <button className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors">
                        My Posts
                      </button>
                      <button className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full hover:bg-green-100 transition-colors">
                        Unsolved
                      </button>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All Categories");
                      setSelectedStatus("All Status");
                      setSortBy("Recent");
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Discussions List */}
          <div className="space-y-6">
            {filteredDiscussions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No discussions found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters, or start a new
                  discussion.
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto transition-colors">
                  <PlusIcon className="w-5 h-5" />
                  <span>Start New Discussion</span>
                </button>
              </div>
            ) : (
              filteredDiscussions.map((discussion) => (
                <DiscussionCard key={discussion.id} discussion={discussion} />
              ))
            )}
          </div>

          {/* Load More Button */}
          {filteredDiscussions.length > 0 && (
            <div className="text-center mt-8">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Load More Discussions
              </button>
            </div>
          )}

          {/* Popular Tags Section */}
          <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Toyota",
                "Honda",
                "BMW",
                "Engine",
                "Brakes",
                "Maintenance",
                "Electrical",
                "AC",
                "Transmission",
                "Battery",
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Community Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">247</div>
              <div className="text-sm text-gray-600">Total Discussions</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">189</div>
              <div className="text-sm text-gray-600">Solved Problems</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                1,432
              </div>
              <div className="text-sm text-gray-600">Community Members</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                3,847
              </div>
              <div className="text-sm text-gray-600">Helpful Replies</div>
            </div>
          </div>
        </div>
      </main>

      {/* ChatBot Sidebar */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Sidebar Toggle Button */}
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

export default NgbukaDiscussionsPage;
