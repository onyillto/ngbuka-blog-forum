// components/UIComponents.tsx
import React from "react";

// Props Types
export type SparePartChipProps = {
  part: string;
  selected?: boolean;
  onClick: () => void;
};

export type StatsCardProps = {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "red" | "yellow";
};

// Spare Part Chip Component
export const SparePartChip = ({
  part,
  selected = false,
  onClick,
}: SparePartChipProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        selected
          ? "bg-blue-900 text-white shadow-md transform scale-105"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
      }`}
    >
      {part}
    </button>
  );
};

// Stats Card Component
export const StatsCard = ({
  title,
  value,
  change,
  icon,
  color = "blue",
}: StatsCardProps) => {
  const colorClasses = {
    blue: "text-blue-900 bg-blue-100",
    green: "text-green-600 bg-green-100",
    red: "text-red-600 bg-red-100",
    yellow: "text-yellow-600 bg-yellow-100",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p
              className={`text-sm mt-2 ${
                change.startsWith("+") ? "text-green-600" : "text-red-600"
              }`}
            >
              {change} from last week
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
