// components/Leaderboard.tsx
import React from "react";
import { TrophyIcon } from "./Icons";

export const Leaderboard = () => {
  const topUsers = [
    {
      id: 1,
      name: "AutoExpert_99",
      points: 2450,
      badge: "Expert",
      solutions: 89,
      avatar: "AE",
    },
    {
      id: 2,
      name: "CarGuru_Pro",
      points: 2180,
      badge: "Pro",
      solutions: 76,
      avatar: "CG",
    },
    {
      id: 3,
      name: "MechWizard",
      points: 1920,
      badge: "Advanced",
      solutions: 65,
      avatar: "MW",
    },
    {
      id: 4,
      name: "SpeedDemon",
      points: 1750,
      badge: "Advanced",
      solutions: 58,
      avatar: "SD",
    },
    {
      id: 5,
      name: "EngineWhisperer",
      points: 1580,
      badge: "Intermediate",
      solutions: 45,
      avatar: "EW",
    },
  ];

  const getBadgeColor = (badge: string) => {
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

      <div className="space-y-3">
        {topUsers.map((user, index) => (
          <div
            key={user.id}
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
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 mr-3">
              {user.avatar}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <span>{user.points.toLocaleString()} points</span>
                <span className="mx-2">•</span>
                <span>{user.solutions} solutions</span>
              </div>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(
                user.badge
              )}`}
            >
              {user.badge}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium">
          View Full Leaderboard →
        </button>
      </div>
    </div>
  );
};
