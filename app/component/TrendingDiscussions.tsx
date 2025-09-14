// components/TrendingDiscussions.tsx
import React from "react";
import {
  MessageIcon,
  CheckCircleIcon,
  UserIcon,
  HeartIcon,
  PlusIcon,
} from "./Icons";

export const TrendingDiscussions = () => {
  const discussions = [
    {
      id: 1,
      title: "Engine overheating in Toyota Camry - Need urgent help!",
      author: "CarEnthusiast23",
      replies: 24,
      likes: 15,
      views: 342,
      timeAgo: "2 hours ago",
      solved: false,
      category: "Engine Issues",
      urgent: true,
    },
    {
      id: 2,
      title: "Best brake pads for Honda Civic 2023?",
      author: "MechMaster",
      replies: 18,
      likes: 22,
      views: 189,
      timeAgo: "4 hours ago",
      solved: true,
      category: "Brakes",
    },
    {
      id: 3,
      title: "BMW X5 transmission problems - anyone experienced this?",
      author: "BMWLover",
      replies: 31,
      likes: 8,
      views: 456,
      timeAgo: "6 hours ago",
      solved: false,
      category: "Transmission",
    },
    {
      id: 4,
      title: "DIY oil change guide for beginners",
      author: "GaragePro",
      replies: 45,
      likes: 67,
      views: 1234,
      timeAgo: "1 day ago",
      solved: true,
      category: "Maintenance",
    },
    {
      id: 5,
      title: "Strange noise from front suspension - Toyota Prius",
      author: "EcoDriver",
      replies: 12,
      likes: 5,
      views: 156,
      timeAgo: "1 day ago",
      solved: false,
      category: "Suspension",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <MessageIcon className="mr-2 text-green-600" />
          Hot Discussions
        </h2>
        <div className="flex items-center space-x-2">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center">
            <PlusIcon className="w-4 h-4 mr-1" />
            New Post
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {discussions.map((discussion) => (
          <div
            key={discussion.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {discussion.urgent && (
                    <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full mr-2">
                      URGENT
                    </span>
                  )}
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                    {discussion.category}
                  </span>
                  {discussion.solved && (
                    <div className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium ml-2">
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      SOLVED
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                  {discussion.title}
                </h3>
                <div className="flex items-center text-sm text-gray-600">
                  <UserIcon className="w-4 h-4 mr-1" />
                  <span className="font-medium">{discussion.author}</span>
                  <span className="mx-2">•</span>
                  <span>{discussion.timeAgo}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MessageIcon className="w-4 h-4 mr-1" />
                  <span>{discussion.replies} replies</span>
                </div>
                <div className="flex items-center">
                  <HeartIcon className="w-4 h-4 mr-1" />
                  <span>{discussion.likes} likes</span>
                </div>
                <div className="flex items-center">
                  <span>{discussion.views} views</span>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Join Discussion →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
