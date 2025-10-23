// NgbukaForumDashboard.tsx (Clean Version)
"use client";

import React, { useState, useEffect } from "react";
import {
  MessageIcon,
  CheckCircleIcon,
  UserIcon,
  CarIcon,
  StatsCard,
  SparePartChip,
  SearchBar,
  TrendingCars,
  TrendingDiscussions,
  Leaderboard,
  SolvedIssues,
  ChatBot,
} from "../../../component/index";

interface Category {
  _id: string;
  name: string;
}

const NgbukaForumDashboard = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
        const response = await fetch(`${apiBaseUrl}/categories`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch categories.");
        }

        setCategories(result.data);
      } catch (error: unknown) {
        setCategoriesError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Active Discussions"
            value="1,234"
            change="+12%"
            icon={<MessageIcon />}
            color="blue"
          />
          <StatsCard
            title="Solved Today"
            value="89"
            change="+5%"
            icon={<CheckCircleIcon />}
            color="green"
          />
          <StatsCard
            title="Expert Members"
            value="456"
            change="+8%"
            icon={<UserIcon />}
            color="yellow"
          />
          <StatsCard
            title="Car Models"
            value="2,567"
            change="+15%"
            icon={<CarIcon />}
            color="red"
          />
        </div>

        {/* Search Bar */}

        {/* Spare Parts Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Popular Spare Parts & Categories
            </h3>
            {selectedCategories.length > 0 && (
              <button
                onClick={() => setSelectedCategories([])}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear all ({selectedCategories.length})
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {categoriesLoading ? (
              <p className="text-sm text-gray-500">Loading categories...</p>
            ) : categoriesError ? (
              <p className="text-sm text-red-500">{categoriesError}</p>
            ) : (
              categories.map((category) => (
                <SparePartChip
                  key={category._id}
                  part={category.name}
                  selected={selectedCategories.includes(category.name)}
                  onClick={() => toggleCategory(category.name)}
                />
              ))
            )}
          </div>
          {selectedCategories.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Filtering by:{" "}
                <span className="font-medium">
                  {selectedCategories.join(", ")}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <TrendingDiscussions />
            <SolvedIssues />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <TrendingCars />
            <Leaderboard />
            <ChatBot />
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Need More Help?
            </h3>
            <p className="text-gray-600 mb-6">
              Connect with our community of car experts or browse our extensive
              knowledge base.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Browse Knowledge Base
              </button>
              <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors">
                Contact Expert
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NgbukaForumDashboard;
