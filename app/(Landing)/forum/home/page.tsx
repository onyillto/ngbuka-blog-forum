// NgbukaForumDashboard.tsx (Clean Version)
"use client";

import React, { useState, useEffect } from "react";
import { SparePartChip, TrendingDiscussions } from "../../../component/index";

interface Category {
  _id: string;
  name: string;
  slug: string;
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

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsLoading ? (
            <>
              {renderStatsSkeleton()}
              {renderStatsSkeleton()}
              {renderStatsSkeleton()}
              {renderStatsSkeleton()}
            </>
          ) : (
            <>
              <StatsCard
                title="Active Discussions"
                value={stats.activeDiscussions?.toLocaleString() || "0"}
                icon={<MessageIcon />}
                color="blue"
              />
              <StatsCard
                title="Solved Today"
                value={stats.solvedToday?.toLocaleString() || "0"}
                icon={<CheckCircleIcon />}
                color="green"
              />
              <StatsCard
                title="Expert Members"
                value={stats.expertMembers?.toLocaleString() || "0"}
                icon={<UserIcon />}
                color="yellow"
              />
              <StatsCard
                title="Car Models"
                value={stats.carModels?.toLocaleString() || "0"}
                icon={<CarIcon />}
                color="red"
              />
            </>
          )}
        </div> */}

        {/* Search Bar */}

        {/* Spare Parts Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Popular Spare Parts & Categories
            </h3>
            {selectedCategories.length > 0 && !categoriesLoading && (
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
                  selected={selectedCategories.includes(category._id)}
                  onClick={() => toggleCategory(category._id)}
                />
              ))
            )}
          </div>
          {selectedCategories.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Filtering by:{" "}
                <span className="font-medium">
                  {selectedCategories
                    .map(
                      (id) => categories.find((c) => c._id === id)?.name || id
                    )
                    .join(", ")}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Dashboard Grid */}
        <div className="space-y-8">
          {/* Main Content */}
          <TrendingDiscussions filterCategories={selectedCategories} />
          {/* <SolvedIssues /> */}
        </div>

        {/* Footer Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              In Need of Spare Parts?
            </h3>
            <p className="text-gray-600 mb-6">
              Visit our marketplace to buy genuine and quality spare parts for
              your vehicle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://app.ngbuka.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Buy Spare Parts Now
              </a>
              <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors">
                Contact Supplier
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NgbukaForumDashboard;
