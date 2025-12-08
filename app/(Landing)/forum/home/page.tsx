// NgbukaForumDashboard.tsx (Clean Version)
"use client";

import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import {
  SparePartChip,
  TrendingDiscussions,
  StatsCard,
} from "../../../component/index";
import {
  MessageIcon,
  CheckCircleIcon,
  UserIcon,
  CarIcon,
  FilterIcon,
  ShareIcon,
} from "../../../component/Icons";
=======
import { SparePartChip, TrendingDiscussions } from "../../../component/index";
import { FilterIcon } from "../../../component/Icons";
>>>>>>> main

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
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  // --- Fetch Categories ---
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

<<<<<<< HEAD
  // --- Fetch Forum Stats ---
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
        // Assuming an endpoint like this exists. You may need to create it.
        const response = await fetch(`${apiBaseUrl}/stats/forum-overview`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch stats.");
        }

        setStats(result.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        // You could set a statsError state here if you want to show an error message
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // --- Category Filter Logic ---
=======
>>>>>>> main
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prevSelected) => {
      // If the clicked category is already selected, deselect it.
      if (prevSelected.includes(categoryId)) {
        return [];
      }
      // Otherwise, select only the new category.
      return [categoryId];
    });
  };

  // --- Share Page Logic ---
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Ngbuka Forum - Car Discussions and Spare Parts",
        text: "Check out the Ngbuka Forum for discussions on car maintenance, repairs, and finding spare parts!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-0 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            className="sm:hidden flex items-center justify-between w-full mb-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Filter by Category
            </h3>
            <FilterIcon className="w-5 h-5 text-gray-600" />
          </button>

          {/* Desktop Title & Share Button */}
          <div className="hidden sm:flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Popular Spare Parts & Categories
            </h3>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-800 transition-colors"
            >
              <ShareIcon className="w-4 h-4" /> Share Page
            </button>
          </div>

          {/* Categories List (conditionally rendered on mobile) */}
          <div
            className={`${showCategoryFilter ? "block" : "hidden"} sm:block`}
          >
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
              <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
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
                <button
                  onClick={() => setSelectedCategories([])}
                  className="text-sm text-blue-700 hover:text-blue-900 font-medium"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* Main Content */}
          <TrendingDiscussions
            key={selectedCategories.join("-")}
            filterCategories={selectedCategories}
          />
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
