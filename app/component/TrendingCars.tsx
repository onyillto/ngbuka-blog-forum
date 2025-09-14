// components/TrendingCars.tsx
import React from "react";
import { FireIcon, CarIcon } from "./Icons";

export const TrendingCars = () => {
  const trendingCars = [
    {
      id: 1,
      name: "Toyota Camry 2024",
      discussions: 156,
      trend: "+12%",
      image: "/car1.jpg",
    },
    {
      id: 2,
      name: "Honda Civic 2023",
      discussions: 143,
      trend: "+8%",
      image: "/car2.jpg",
    },
    {
      id: 3,
      name: "BMW X5 2024",
      discussions: 98,
      trend: "+15%",
      image: "/car3.jpg",
    },
    {
      id: 4,
      name: "Mercedes C-Class",
      discussions: 87,
      trend: "+5%",
      image: "/car4.jpg",
    },
    {
      id: 5,
      name: "Ford F-150 2024",
      discussions: 76,
      trend: "+3%",
      image: "/car5.jpg",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <FireIcon className="mr-2 text-red-500" />
          Trending Cars
        </h2>
        <span className="text-sm text-gray-500">This week</span>
      </div>
      <div className="space-y-4">
        {trendingCars.map((car, index) => (
          <div
            key={car.id}
            className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <span
              className={`text-sm font-bold w-6 ${
                index === 0
                  ? "text-yellow-500"
                  : index === 1
                  ? "text-gray-400"
                  : index === 2
                  ? "text-orange-500"
                  : "text-gray-400"
              }`}
            >
              #{index + 1}
            </span>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mx-3 group-hover:scale-105 transition-transform">
              <CarIcon className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {car.name}
              </h3>
              <p className="text-sm text-gray-600">
                {car.discussions} discussions
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-green-600">
                {car.trend}
              </span>
              <div className="text-xs text-gray-500">vs last week</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t">
        <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All Cars →
        </button>
      </div>
    </div>
  );
};
