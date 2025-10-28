// UnreadRepliesPage.tsx
"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
  MessageIcon,
  CheckCircleIcon,
  UserIcon,
  FireIcon,
  XIcon,
  FilterIcon,
  SearchIcon,
  HeartIcon,
  CarIcon,
} from "../../../component/index";

const UnreadRepliesPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReplies, setSelectedReplies] = useState<number[]>([]);

  // Sample unread replies data
  const unreadReplies = [
    {
      id: 1,
      originalPost: {
        title: "Toyota Camry engine overheating - urgent help needed!",
        id: 101,
        category: "Engine Issues",
      },
      replies: [
        {
          id: 201,
          author: "MechExpert_Pro",
          avatar: "ME",
          content:
            "Have you checked the coolant level? This sounds like a classic coolant leak. Check around the radiator and hoses for any visible leaks.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          isExpert: true,
          likes: 5,
        },
        {
          id: 202,
          author: "CamryOwner2020",
          avatar: "CO",
          content:
            "I had the exact same issue last month! Turned out to be a faulty thermostat. Cost me about $150 to fix.",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          isExpert: false,
          likes: 3,
        },
      ],
    },
    {
      id: 2,
      originalPost: {
        title: "Best brake pads for Honda Civic 2023?",
        id: 102,
        category: "Brakes",
      },
      replies: [
        {
          id: 203,
          author: "BrakeMaster",
          avatar: "BM",
          content:
            "I'd recommend ceramic brake pads for daily driving. They're quieter and produce less dust. Brands like Akebono or Bosch are great options.",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          isExpert: true,
          likes: 8,
        },
      ],
    },
    {
      id: 3,
      originalPost: {
        title: "Strange noise from BMW X5 transmission",
        id: 103,
        category: "Transmission",
      },
      replies: [
        {
          id: 204,
          author: "BMWSpecialist",
          avatar: "BS",
          content:
            "This could be a sign of low transmission fluid or worn transmission mounts. When did you last service the transmission?",
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          isExpert: true,
          likes: 2,
        },
        {
          id: 205,
          author: "X5Driver",
          avatar: "XD",
          content:
            "I'm having the same issue! Following this thread for updates.",
          timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          isExpert: false,
          likes: 1,
        },
        {
          id: 206,
          author: "AutoTechGuru",
          avatar: "AT",
          content:
            "Could also be related to the transfer case if it's an AWD model. Have you noticed any issues during turns?",
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          isExpert: true,
          likes: 0,
        },
      ],
    },
    {
      id: 4,
      originalPost: {
        title: "DIY oil change tips for beginners",
        id: 104,
        category: "Maintenance",
      },
      replies: [
        {
          id: 207,
          author: "DIYMechanic",
          avatar: "DM",
          content:
            "Great guide! I'd add that it's important to let the engine cool down for at least 30 minutes before starting.",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          isExpert: false,
          likes: 12,
        },
      ],
    },
  ];

  const filters = [
    { value: "all", label: "All Replies", count: 7 },
    { value: "experts", label: "Expert Replies", count: 4 },
    { value: "today", label: "Today", count: 5 },
    { value: "urgent", label: "Urgent Posts", count: 2 },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "most_liked", label: "Most Liked" },
    { value: "post_title", label: "By Post Title" },
  ];

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const toggleSelectReply = (replyId: number) => {
    setSelectedReplies((prev) =>
      prev.includes(replyId)
        ? prev.filter((id) => id !== replyId)
        : [...prev, replyId]
    );
  };

  const markAsRead = (replyIds: number[]) => {
    // Implementation for marking replies as read
    console.log("Marking as read:", replyIds);
    setSelectedReplies([]);
  };

  const markAllAsRead = () => {
    const allReplyIds = unreadReplies.flatMap((post) =>
      post.replies.map((reply) => reply.id)
    );
    markAsRead(allReplyIds);
  };

  const getTotalUnreadCount = () => {
    return unreadReplies.reduce(
      (total, post) => total + post.replies.length,
      0
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <MessageIcon className="mr-3 text-blue-500" />
                Unread Replies
                <span className="ml-3 bg-red-500 text-white text-lg px-3 py-1 rounded-full">
                  {getTotalUnreadCount()}
                </span>
              </h1>
              <p className="text-gray-600">
                Catch up on all the replies to your discussions and posts
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={markAllAsRead}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Mark All Read
              </button>
              {selectedReplies.length > 0 && (
                <button
                  onClick={() => markAsRead(selectedReplies)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Mark Selected Read ({selectedReplies.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Filter Tabs */}
            <div className="flex items-center space-x-1">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center ${
                    selectedFilter === filter.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      selectedFilter === filter.value
                        ? "bg-white/20 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search replies..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>

              {/* Sort */}
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Unread Replies List */}
        <div className="space-y-6">
          {unreadReplies.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Original Post Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CarIcon className="text-blue-600 w-5 h-5" />
                    </div>
                    <div>
                      <Link href={`/forum/post/${post.originalPost.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                          {post.originalPost.title}
                        </h3>
                      </Link>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs mr-2">
                          {post.originalPost.category}
                        </span>
                        <span>{post.replies.length} new replies</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/forum/post/${post.originalPost.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Post →
                  </Link>
                </div>
              </div>

              {/* Replies */}
              <div className="divide-y divide-gray-100">
                {post.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      selectedReplies.includes(reply.id)
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Selection Checkbox */}
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={selectedReplies.includes(reply.id)}
                          onChange={() => toggleSelectReply(reply.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>

                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white ${
                          reply.isExpert
                            ? "bg-gradient-to-r from-purple-500 to-blue-500"
                            : "bg-gradient-to-r from-gray-400 to-gray-600"
                        }`}
                      >
                        {reply.avatar}
                      </div>

                      {/* Reply Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">
                              {reply.author}
                            </span>
                            {reply.isExpert && (
                              <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">
                                Expert
                              </span>
                            )}
                            <span className="text-sm text-gray-500">
                              {formatTimeAgo(reply.timestamp)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center text-gray-500">
                              <HeartIcon className="w-4 h-4 mr-1" />
                              <span className="text-sm">{reply.likes}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-800 leading-relaxed mb-3">
                          {reply.content}
                        </p>
                        <div className="flex items-center space-x-4">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Reply
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 text-sm">
                            Like
                          </button>
                          <button
                            onClick={() => markAsRead([reply.id])}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            Mark as Read
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {unreadReplies.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              All caught up!
            </h3>
            <p className="text-gray-600 mb-6">
              You've read all your replies. Great job staying on top of your
              discussions!
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Browse Forum
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default UnreadRepliesPage;
