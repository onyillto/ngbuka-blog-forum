// TrendingPageDashboard.tsx
"use client";

import React, { useState } from "react";
import {
  MessageIcon,
  CheckCircleIcon,
  UserIcon,
  CarIcon,
  FireIcon,
  TrophyIcon,
  SearchIcon,
  FilterIcon,
  StatsCard,
  SparePartChip,
  TrendingCars,
  TrendingDiscussions,
  ChatBot,
} from "../../../component/index";

const TrendingPageDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const timeframes = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "engine", label: "Engine Issues" },
    { value: "brakes", label: "Brake Problems" },
    { value: "electrical", label: "Electrical" },
    { value: "transmission", label: "Transmission" },
    { value: "maintenance", label: "Maintenance" },
  ];

  // Trending Topics Component
  const TrendingTopics = () => {
    const trendingTopics = [
      {
        id: 1,
        topic: "Winter tire recommendations",
        posts: 234,
        trend: "+45%",
        category: "Maintenance",
        urgent: false,
      },
      {
        id: 2,
        topic: "EV charging issues",
        posts: 189,
        trend: "+38%",
        category: "Electrical",
        urgent: true,
      },
      {
        id: 3,
        topic: "Oil change frequency",
        posts: 156,
        trend: "+25%",
        category: "Maintenance",
        urgent: false,
      },
      {
        id: 4,
        topic: "Brake noise diagnosis",
        posts: 143,
        trend: "+22%",
        category: "Brakes",
        urgent: false,
      },
      {
        id: 5,
        topic: "Check engine light",
        posts: 132,
        trend: "+18%",
        category: "Engine",
        urgent: true,
      },
    ];

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FireIcon className="mr-2 text-orange-500" />
            Trending Topics
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {selectedTimeframe === "today"
              ? "Today"
              : selectedTimeframe === "week"
              ? "This Week"
              : selectedTimeframe === "month"
              ? "This Month"
              : "This Year"}
          </span>
        </div>

        <div className="space-y-4">
          {trendingTopics.map((topic, index) => (
            <div
              key={topic.id}
              className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100 group"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white mr-4 ${
                  index === 0
                    ? "bg-gradient-to-r from-red-500 to-orange-500"
                    : index === 1
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                    : index === 2
                    ? "bg-gradient-to-r from-yellow-500 to-green-500"
                    : "bg-gradient-to-r from-blue-500 to-purple-500"
                }`}
              >
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mr-3">
                    {topic.topic}
                  </h3>
                  {topic.urgent && (
                    <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                      HOT
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs mr-3">
                    {topic.category}
                  </span>
                  <span>{topic.posts} posts</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-green-600">
                  {topic.trend}
                </span>
                <div className="text-xs text-gray-500">vs last period</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Trending Searches Component
  const TrendingSearches = () => {
    const trendingSearches = [
      "Toyota Camry engine problems",
      "BMW brake replacement cost",
      "Honda Civic oil change",
      "Tesla charging stations",
      "Ford F-150 transmission",
      "Nissan Altima recalls",
      "Chevy Silverado parts",
      "Audi maintenance schedule",
    ];

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <SearchIcon className="mr-2 text-blue-500" />
          Trending Searches
        </h3>
        <div className="space-y-2">
          {trendingSearches.map((search, index) => (
            <div
              key={index}
              className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
            >
              <span className="text-sm font-medium text-gray-600 mr-2">
                {index + 1}.
              </span>
              <span className="text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                {search}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <FireIcon className="mr-3 text-red-500" />
            Trending Now
          </h1>
          <p className="text-gray-600">
            Discover what's hot in the automotive community right now
          </p>
        </div>

        {/* Trending Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Trending Discussions"
            value="1,234"
            change="+12%"
            icon={<FireIcon />}
            color="red"
          />
          <StatsCard
            title="Hot Topics"
            value="89"
            change="+25%"
            icon={<MessageIcon />}
            color="blue"
          />
          <StatsCard
            title="Rising Contributors"
            value="456"
            change="+8%"
            icon={<TrophyIcon />}
            color="yellow"
          />
          <StatsCard
            title="Popular Cars"
            value="2,567"
            change="+15%"
            icon={<CarIcon />}
            color="green"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <FilterIcon className="text-gray-500" />
              <span className="font-semibold text-gray-900">
                Filter Trends:
              </span>

              {/* Timeframe Filter */}
              <div className="flex space-x-2">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe.value}
                    onClick={() => setSelectedTimeframe(timeframe.value)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedTimeframe === timeframe.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {timeframe.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Trending Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <TrendingTopics />
            <TrendingDiscussions />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <TrendingCars />
            <TrendingSearches />
            <ChatBot />
          </div>
        </div>

        {/* Trending Categories Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FireIcon className="mr-2 text-orange-500" />
            Trending by Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Engine Issues",
                count: 234,
                trend: "+15%",
                color: "red",
              },
              {
                name: "Brake Problems",
                count: 189,
                trend: "+12%",
                color: "orange",
              },
              { name: "Electrical", count: 156, trend: "+8%", color: "yellow" },
              {
                name: "Maintenance",
                count: 143,
                trend: "+22%",
                color: "green",
              },
            ].map((category, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
              >
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                  {category.name}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {category.count}
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    {category.trend}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">trending posts</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrendingPageDashboard;
