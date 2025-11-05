"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Clock,
  MessageCircle,
  Star,
  Filter,
  ChevronDown,
  Heart,
  MessageSquareReply,
  Eye,
  Share2,
  MoreHorizontal,
  Plus,
  UserCheck,
} from "lucide-react";
import Image from "next/image";

interface Post {
  id: number;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  category: string;
  title: string;
  content: string;
  tags: string[];
  stats: {
    likes: number;
    replies: number;
    views: number;
  };
  date: string;
  image: string | null;
  isAI: boolean;
}

const DiscussionFeedSection = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const tabs = [
    { id: "trending", name: "Trending", icon: Sparkles, active: true },
    { id: "recent", name: "Recent", icon: Clock },
    { id: "all", name: "All Posts", icon: MessageCircle },
    { id: "top", name: "Top Rated", icon: Star },
  ];

  const posts = [
    {
      id: 1,
      user: {
        name: "Ahmed Musa",
        username: "@ahmed_driver",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        verified: true,
      },
      category: "Troubleshooting",
      title: "Check engine light came on - P0420 code, need advice",
      content:
        "My 2019 Honda Civic has been showing P0420 for 3 days now. Car runs fine, no unusual sounds or performance issues. Local mechanic says it could be catalytic converter but wants $1200. Should I get second opinion?",
      tags: ["#check-engine", "#P0420", "#honda", "#civic", "#help"],
      stats: { likes: 12, replies: 8, views: 156 },
      date: "1 day ago",
      image: null,
      isAI: false,
    },
    {
      id: 2,
      user: {
        name: "AutoForum AI",
        username: "@autoforum_ai",
        avatar:
          "https://images.unsplash.com/photo-1620712943543-7dc7e2528db9?w=150&h=150&fit=crop&crop=face", // AI avatar
        verified: true,
      },
      category: "Electric Vehicles",
      title: "AI Analysis: Best charging stations network in Nigeria 2024",
      content:
        "I analyzed 500+ charging stations across major Nigerian cities using AI to determine coverage, reliability, and pricing. Here are the results with interactive maps and recommendations for EV owners.",
      tags: ["#EV", "#charging-stations", "#Nigeria", "#AI"],
      stats: { likes: 45, replies: 12, views: 999 },
      date: "6 hours ago",
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76e6e5f8?w=600&h=400&fit=crop", // EV charging station image
      isAI: true,
    },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const PostCard = ({ post }: { post: Post }) => {
    const [liked, setLiked] = useState(false);

    return (
      <article className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm hover:shadow-md transition-all duration-200">
        {/* User Header */}
        <div className="flex items-start space-x-3 mb-4">
          <Image
            src={post.user.avatar}
            alt={post.user.name}
            width={48}
            height={48}
            className="rounded-full flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-gray-900 text-sm truncate">
                {post.user.name}
              </span>
              {post.user.verified && (
                <UserCheck className="h-3 w-3 text-blue-500 flex-shrink-0" />
              )}
              <span className="text-xs text-gray-500">
                @{post.user.username}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span className="capitalize">{post.category}</span>
              <span>•</span>
              <span>{post.date}</span>
              {post.isAI && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  AI
                </span>
              )}
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
            {post.title}
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            {post.content}
          </p>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 4 && (
              <span className="px-2 py-1 text-gray-500 text-xs">
                +{post.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Featured Image */}
        {post.image && (
          <div className="mb-4 rounded-xl overflow-hidden bg-gray-100">
            <Image
              src={post.image}
              alt={post.title}
              width={600}
              height={400}
              className="w-full h-48 object-cover"
              priority={false}
            />
          </div>
        )}

        {/* Stats and Interactions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
                liked ? "text-red-500" : "hover:text-red-600"
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-red-500" : ""}`} />
              <span>{post.stats.likes}</span>
            </button>
            <button className="flex items-center space-x-1 p-2 rounded-lg hover:text-gray-700">
              <MessageSquareReply className="h-4 w-4" />
              <span>{post.stats.replies}</span>
            </button>
            <button className="flex items-center space-x-1 p-2 rounded-lg hover:text-gray-700">
              <Eye className="h-4 w-4" />
              <span>{post.stats.views}</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Discussion Feed & AI Insights
            </h1>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      All Categories
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Troubleshooting
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Electric Vehicles
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Buy & Sell
                    </button>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>Sort</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Latest
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Most Popular
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Top Rated
                    </button>
                  </div>
                )}
              </div>
              <button className="flex items-center space-x-2 px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>New Post</span>
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Latest automotive discussions and AI insights
          </p>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "bg-white text-orange-600 border-b-2 border-orange-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 flex-shrink-0 ${
                      activeTab === tab.id ? "text-orange-600" : "text-gray-400"
                    }`}
                  />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Posts Feed */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscussionFeedSection;
