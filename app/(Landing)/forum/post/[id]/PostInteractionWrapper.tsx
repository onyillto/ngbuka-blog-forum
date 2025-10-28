"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface PostStats {
  likeCount: number;
  hasLiked: boolean;
  commentCount: number;
  views: number;
}

interface PostInteractionWrapperProps {
  postId: string;
  initialStats: PostStats;
}

export default function PostInteractionWrapper({
  postId,
  initialStats,
}: PostInteractionWrapperProps) {
  const [stats, setStats] = useState(initialStats);
  const router = useRouter();

  const handleLike = async () => {
    // Optimistic update
    setStats((prev) => ({
      ...prev,
      hasLiked: !prev.hasLiked,
      likeCount: prev.hasLiked ? prev.likeCount - 1 : prev.likeCount + 1,
    }));

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/like`
      );
      // Optionally re-fetch or use server action to revalidate
      router.refresh();
    } catch (err) {
      console.error("Error liking post:", err);
      // Revert optimistic update on error
      setStats((prev) => ({
        ...prev,
        hasLiked: !prev.hasLiked,
        likeCount: prev.hasLiked ? prev.likeCount - 1 : prev.likeCount + 1,
      }));
    }
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            stats.hasLiked
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill={stats.hasLiked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>Like</span>
          {stats.likeCount > 0 && (
            <span className="ml-1">({stats.likeCount})</span>
          )}
        </button>
      </div>

      {/* Comments Section */}
      <div className="border-t border-gray-200 bg-gray-50 mt-6 sm:p-6 sm:-mx-6 sm:-mb-6">
        <div className="flex items-center justify-between mb-4 px-4 sm:px-0">
          <h3 className="text-lg font-semibold text-gray-900">
            Comments ({stats.commentCount})
          </h3>
        </div>

        {/* Comment Input */}
        <div className="mb-6 px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mb-2 sm:mb-0">
                <span className="text-gray-600 font-medium">You</span>
              </div>
            </div>
            <div className="flex-1">
              <textarea
                placeholder="Write a comment..."
                className="w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              ></textarea>
              <div className="mt-2 flex justify-end">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  <span>Post Comment</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Comments */}
        {stats.commentCount === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-4 px-4 sm:px-0">
            {/* Sample comment structure - replace with actual comments */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-start space-x-3">
                <img
                  src="/api/placeholder/40/40"
                  alt="Commenter"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      Sarah Johnson
                    </span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Expert
                    </span>
                    <span className="text-sm text-gray-500">
                      • 1250 rep • 4 days ago
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">
                    I highly recommend the Toyota RAV4 Hybrid. Great fuel
                    economy and very reliable!
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {" "}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />{" "}
                      </svg>
                      <span>5</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {" "}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />{" "}
                      </svg>
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
