// components/TrendingDiscussions.tsx
import Link from "next/link";
import CreatePostModal from "./CreatePostModal";
import React, { useState, useEffect } from "react";
import {
  MessageIcon,
  CheckCircleIcon,
  UserIcon,
  HeartIcon,
  PlusIcon,
} from "./Icons";

interface Author {
  _id: string;
  fullName: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Post {
  _id: string;
  title: string;
  author: Author | null;
  category: Category;
  commentCount: number;
  likes: string[];
  views: number;
  createdAt: string;
  isPinned: boolean; // Assuming 'urgent' can be mapped from 'isPinned'
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)} years ago`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)} months ago`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} days ago`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} hours ago`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} minutes ago`;
  return `${Math.floor(seconds)} seconds ago`;
};

export const TrendingDiscussions = () => {
  const [discussions, setDiscussions] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscussions = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
        // Fetching only the top 5 trending posts
        const response = await fetch(`${apiBaseUrl}/posts?limit=5&sort=-views`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch discussions.");
        }
        setDiscussions(result.data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  const handleSavePost = async (formData: FormData) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_BaseURL;
      // You'll need to get the token, e.g., from cookies
      // const token = Cookies.get("token");

      const response = await fetch(`${apiBaseUrl}/posts`, {
        method: "POST",
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create post.");
      }

      // Optionally, refresh discussions or add the new post to the list
      setCreatePostModalOpen(false);
    } catch (error: unknown) {
      setSaveError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSaving(false);
    }
  };

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
          <button
            onClick={() => setCreatePostModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            New Post
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          // Skeleton Loader
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 animate-pulse"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          discussions.map((discussion) => (
            <div
              key={discussion._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {discussion.isPinned && (
                      <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full mr-2">
                        PINNED
                      </span>
                    )}
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                      {discussion.category?.name || "Uncategorized"}
                    </span>
                  </div>
                  <Link href={`/forum/post/${discussion._id}`}>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {discussion.title}
                    </h3>
                  </Link>
                  <div className="flex items-center text-sm text-gray-600">
                    <UserIcon className="w-4 h-4 mr-1" />
                    <span className="font-medium">
                      {discussion.author?.fullName || "Anonymous"}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{formatTimeAgo(discussion.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MessageIcon className="w-4 h-4 mr-1" />
                    <span>{discussion.commentCount} replies</span>
                  </div>
                  <div className="flex items-center">
                    <HeartIcon className="w-4 h-4 mr-1" />
                    <span>{discussion.likes.length} likes</span>
                  </div>
                  <div className="flex items-center">
                    <span>{discussion.views} views</span>
                  </div>
                </div>
                <Link
                  href={`/forum/post/${discussion._id}`}
                  className="text-blue-800 hover:text-blue-900 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Join Discussion →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setCreatePostModalOpen(false)}
        onSave={handleSavePost}
        isSaving={isSaving}
        error={saveError}
      />
    </div>
  );
};
