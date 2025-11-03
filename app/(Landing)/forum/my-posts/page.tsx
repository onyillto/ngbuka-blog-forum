// MyPostsPage.tsx
"use client";

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
  PlusIcon,
  EditIcon,
  TrashIcon,
} from "../../../component/index";

const MyPostsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);

  // Sample user's posts data
  const userPosts = [
    {
      id: 1,
      title: "Toyota Camry engine overheating - urgent help needed!",
      content:
        "My 2020 Toyota Camry has been overheating lately, especially during highway driving. The temperature gauge goes to the red zone after about 30 minutes of driving. I've checked the coolant level and it seems fine. Any ideas what could be causing this?",
      category: "Engine Issues",
      status: "open",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      replies: 24,
      views: 342,
      likes: 15,
      isUrgent: true,
      tags: ["Toyota", "Camry", "Engine", "Overheating"],
    },
    {
      id: 2,
      title: "Best brake pads for Honda Civic 2023?",
      content:
        "I'm looking to replace the brake pads on my 2023 Honda Civic. I do mostly city driving with some highway use. What are the best brake pads for this type of driving? I'm considering ceramic vs semi-metallic options.",
      category: "Brakes",
      status: "solved",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      replies: 18,
      views: 189,
      likes: 22,
      isUrgent: false,
      tags: ["Honda", "Civic", "Brakes", "Brake Pads"],
      solution:
        "Went with Akebono ceramic brake pads based on recommendations. Great performance and very quiet!",
    },
    {
      id: 3,
      title: "DIY oil change guide for beginners",
      content:
        "I've been taking my car to the shop for oil changes, but I want to learn how to do it myself. Can someone walk me through the process? What tools do I need and what should I watch out for?",
      category: "Maintenance",
      status: "closed",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
      replies: 45,
      views: 1234,
      likes: 67,
      isUrgent: false,
      tags: ["DIY", "Oil Change", "Maintenance", "Beginner"],
    },
    {
      id: 4,
      title: "Strange noise from BMW X5 transmission",
      content:
        "I've been hearing a grinding noise when shifting gears in my 2019 BMW X5. It's most noticeable when going from 2nd to 3rd gear. The car has 45k miles on it. Should I be worried?",
      category: "Transmission",
      status: "open",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      replies: 12,
      views: 156,
      likes: 8,
      isUrgent: true,
      tags: ["BMW", "X5", "Transmission", "Grinding Noise"],
    },
    {
      id: 5,
      title: "Winter tire recommendations for Tesla Model 3",
      content:
        "Living in Minnesota and need good winter tires for my Tesla Model 3. What are your recommendations for tires that work well with the car's weight and provide good traction in snow?",
      category: "Tires",
      status: "open",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      replies: 7,
      views: 89,
      likes: 5,
      isUrgent: false,
      tags: ["Tesla", "Model 3", "Winter Tires", "Snow"],
    },
  ];

  const drafts = [
    {
      id: 101,
      title: "Ford F-150 truck bed cover recommendations",
      content:
        "I'm looking for a good truck bed cover for my 2022 Ford F-150...",
      category: "Accessories",
      lastSaved: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: 102,
      title: "Mercedes C-Class maintenance schedule",
      content:
        "What's the recommended maintenance schedule for a 2021 Mercedes C-Class?",
      category: "Maintenance",
      lastSaved: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  ];

  const tabs = [
    { value: "all", label: "All Posts", count: userPosts.length },
    {
      value: "open",
      label: "Open",
      count: userPosts.filter((p) => p.status === "open").length,
    },
    {
      value: "solved",
      label: "Solved",
      count: userPosts.filter((p) => p.status === "solved").length,
    },
    {
      value: "closed",
      label: "Closed",
      count: userPosts.filter((p) => p.status === "closed").length,
    },
    { value: "drafts", label: "Drafts", count: drafts.length },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "most_replies", label: "Most Replies" },
    { value: "most_views", label: "Most Views" },
    { value: "most_liked", label: "Most Liked" },
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-purple-100 text-blue-900";
      case "solved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "solved":
        return <CheckCircleIcon className="w-4 h-4 mr-1" />;
      case "open":
        return <MessageIcon className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  const toggleSelectPost = (postId: number) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const getUserStats = () => {
    const totalReplies = userPosts.reduce((sum, post) => sum + post.replies, 0);
    const totalViews = userPosts.reduce((sum, post) => sum + post.views, 0);
    const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
    const solvedCount = userPosts.filter((p) => p.status === "solved").length;

    return { totalReplies, totalViews, totalLikes, solvedCount };
  };

  const stats = getUserStats();

  const filteredPosts =
    activeTab === "drafts"
      ? drafts
      : activeTab === "all"
      ? userPosts
      : userPosts.filter((post) => post.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <UserIcon className="mr-3 text-blue-500" />
                My Posts
              </h1>
              <p className="text-gray-600">
                Manage and track all your forum posts and discussions
              </p>
            </div>
            <button className="bg-blue-900 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
              <PlusIcon className="w-4 h-4 mr-2" />
              New Post
            </button>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {userPosts.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100">
                <MessageIcon className="text-blue-800" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Replies
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalReplies}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                <MessageIcon className="text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Views</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100">
                <FireIcon className="text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Solved Posts
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.solvedCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-100">
                <CheckCircleIcon className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Tabs */}
          <div className="flex items-center space-x-1 mb-6 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors flex items-center ${
                  activeTab === tab.value
                    ? "bg-blue-900 text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.value
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              {selectedPosts.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedPosts.length} selected
                  </span>
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                    Delete
                  </button>
                  <button className="text-blue-800 hover:text-blue-900 text-sm font-medium">
                    Mark as Solved
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search my posts..."
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

        {/* Posts List */}
        <div className="space-y-6">
          {activeTab === "drafts"
            ? // Drafts View
              drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full mr-3">
                          DRAFT
                        </span>
                        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                          {draft.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {draft.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {draft.content}
                      </p>
                      <p className="text-sm text-gray-500">
                        Last saved {formatTimeAgo(draft.lastSaved)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="text-blue-800 hover:text-blue-900 text-sm font-medium">
                        Continue Editing
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            : // Published Posts View
              (filteredPosts as typeof userPosts).map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Selection Checkbox */}
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={selectedPosts.includes(post.id)}
                          onChange={() => toggleSelectPost(post.id)}
                          className="w-4 h-4 text-blue-800 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>

                      {/* Post Content */}
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span
                              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                post.status
                              )}`}
                            >
                              {getStatusIcon(post.status)}
                              {post.status.toUpperCase()}
                            </span>
                            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                              {post.category}
                            </span>
                            {post.isUrgent && (
                              <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                                URGENT
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="text-gray-400 hover:text-gray-600">
                              <EditIcon className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Title and Content */}
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-800 transition-colors cursor-pointer mb-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.content}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-blue-50 text-blue-900 text-xs px-2 py-1 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Solution (if solved) */}
                        {post.status === "solved" && "solution" in post && post.solution && (
                          <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-lg mb-4">
                            <p className="text-sm text-green-800 font-medium mb-1">
                              ✅ Marked as Solved:
                            </p>
                            <p className="text-sm text-green-700">
                              {post.solution}
                            </p>
                          </div>
                        )}

                        {/* Stats and Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MessageIcon className="w-4 h-4 mr-1" />
                              <span>{post.replies} replies</span>
                            </div>
                            <div className="flex items-center">
                              <FireIcon className="w-4 h-4 mr-1" />
                              <span>{post.views} views</span>
                            </div>
                            <div className="flex items-center">
                              <HeartIcon className="w-4 h-4 mr-1" />
                              <span>{post.likes} likes</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span>
                                Posted {formatTimeAgo(post.createdAt)}
                              </span>
                              <span>•</span>
                              <span>
                                Updated {formatTimeAgo(post.updatedAt)}
                              </span>
                            </div>
                          </div>
                          <button className="text-blue-800 hover:text-blue-900 text-sm font-medium">
                            View Post →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageIcon className="text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === "drafts"
                ? "You don't have any draft posts yet."
                : `You don't have any ${
                    activeTab === "all" ? "" : activeTab
                  } posts yet.`}
            </p>
            <button className="bg-blue-900 hover:bg-blue-900 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Create Your First Post
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyPostsPage;
