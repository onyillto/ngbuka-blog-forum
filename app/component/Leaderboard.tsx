"use client";

import React, { useState, useEffect } from "react";
import { TrophyIcon } from "./Icons";
import Image from "next/image";

interface TopUser {
  _id: string;
  fullName: string;
  reputation: number;
  level: string;
  postCount: number;
  avatar: string | null;
}

export const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        setLoading(true);
        const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
        const response = await fetch(`${apiBaseUrl}/user/top-posters?limit=5`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch top users.");
        }
        setTopUsers(result.data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  const getBadgeColor = (badge: string | undefined) => {
    switch (badge) {
      case "Expert":
        return "bg-purple-100 text-purple-800";
      case "Pro":
        return "bg-blue-100 text-blue-800";
      case "Advanced":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <TrophyIcon className="mr-2 text-yellow-600" />
          Top Contributors
        </h2>
        <span className="text-sm text-gray-500">This month</span>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="space-y-3">
          {topUsers.map((user, index) => (
            <div
              key={user._id}
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white mr-3 ${
                  index === 0
                    ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                    : index === 1
                    ? "bg-gradient-to-br from-gray-400 to-gray-600"
                    : index === 2
                    ? "bg-gradient-to-br from-orange-400 to-orange-600"
                    : "bg-gradient-to-br from-blue-400 to-blue-600"
                }`}
              >
                {index + 1}
              </div>
              <div className="relative w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 mr-3">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.fullName}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span>{user.fullName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <span>{user.reputation.toLocaleString()} points</span>
                  <span className="mx-2">•</span>
                  <span>{user.postCount} posts</span>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(
                  user.level
                )}`}
              >
                {user.level}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t">
        <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium">
          View Full Leaderboard →
        </button>
      </div>
    </div>
  );
};
