// NgbukaForumDashboard.tsx (Clean Version)
"use client";

import React, { useState } from "react";
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

const NgbukaForumDashboard = () => {
  const [selectedParts, setSelectedParts] = useState<string[]>([]);

  const spareParts = [
    "Brake Pads",
    "Oil Filter",
    "Air Filter",
    "Spark Plugs",
    "Battery",
    "Tires",
    "Brake Rotors",
    "Transmission",
    "Engine Parts",
    "Suspension",
    "Exhaust System",
    "Cooling System",
    "Fuel System",
    "Electrical",
  ];

  const togglePart = (part: string) => {
    setSelectedParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
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
            {selectedParts.length > 0 && (
              <button
                onClick={() => setSelectedParts([])}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear all ({selectedParts.length})
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {spareParts.map((part) => (
              <SparePartChip
                key={part}
                part={part}
                selected={selectedParts.includes(part)}
                onClick={() => togglePart(part)}
              />
            ))}
          </div>
          {selectedParts.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Filtering by:{" "}
                <span className="font-medium">{selectedParts.join(", ")}</span>
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
