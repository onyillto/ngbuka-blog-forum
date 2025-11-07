// components/SearchBar.tsx
"use client";

import React, { useState } from "react";
import { SearchIcon, FilterIcon } from "./Icons";

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const handleSearch = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Search Forum</h2>
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <FilterIcon className="mr-1" />
          Filters
        </button>
      </div>

      <div className="relative">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
            placeholder="Search for car models, issues, or solutions..."
            className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {filterOpen && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                <option>All Categories</option>
                <option>Engine Issues</option>
                <option>Brake Problems</option>
                <option>Electrical</option>
                <option>Transmission</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Car Make
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                <option>All Makes</option>
                <option>Toyota</option>
                <option>Honda</option>
                <option>BMW</option>
                <option>Mercedes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                <option>All Posts</option>
                <option>Solved</option>
                <option>Unsolved</option>
                <option>In Progress</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
