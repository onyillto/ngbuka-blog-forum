// components/SolvedIssues.tsx
import React from "react";
import { CheckCircleIcon, HeartIcon } from "./Icons";

export const SolvedIssues = () => {
  const solvedIssues = [
    {
      id: 1,
      title: "Car won't start after sitting overnight",
      car: "Honda Accord 2020",
      solution:
        "Replace faulty starter relay in the engine bay fuse box. The relay was clicking but not engaging properly.",
      solvedBy: "MechExpert",
      timeAgo: "3 hours ago",
      helpful: 12,
      category: "Electrical",
    },
    {
      id: 2,
      title: "Strange noise from brakes",
      car: "Toyota Prius 2022",
      solution:
        "Clean brake dust buildup and lubricate caliper pins. Also check brake pad thickness - they may need replacement soon.",
      solvedBy: "BrakePro",
      timeAgo: "5 hours ago",
      helpful: 8,
      category: "Brakes",
    },
    {
      id: 3,
      title: "AC not cooling properly",
      car: "BMW 3 Series 2021",
      solution:
        "Recharge AC refrigerant and check for leaks at the condenser. Found small leak that needed professional repair.",
      solvedBy: "CoolAirTech",
      timeAgo: "8 hours ago",
      helpful: 15,
      category: "AC/Heating",
    },
    {
      id: 4,
      title: "Engine light stays on after oil change",
      car: "Ford F-150 2022",
      solution:
        "Reset the oil change reminder system using the dashboard menu. The light was just a maintenance reminder, not an error.",
      solvedBy: "DiagnosticKing",
      timeAgo: "1 day ago",
      helpful: 23,
      category: "Engine",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <CheckCircleIcon className="mr-2 text-green-600" />
          Recently Solved
        </h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {solvedIssues.map((issue) => (
          <div
            key={issue.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full mr-2">
                    {issue.category}
                  </span>
                  <div className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
                    <CheckCircleIcon className="w-3 h-3 mr-1" />
                    SOLVED
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-1">
                  {issue.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{issue.car}</p>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-lg mb-3">
              <p className="text-sm text-green-800 font-medium mb-1">
                💡 Solution:
              </p>
              <p className="text-sm text-green-700">{issue.solution}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <span>
                  Solved by{" "}
                  <span className="font-medium text-gray-900">
                    {issue.solvedBy}
                  </span>
                </span>
                <span className="mx-2">•</span>
                <span>{issue.timeAgo}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center text-blue-600">
                  <HeartIcon className="w-4 h-4 mr-1" />
                  <span>{issue.helpful} helpful</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
